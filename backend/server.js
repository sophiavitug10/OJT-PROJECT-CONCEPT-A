const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const requireAuth = require('./middleware/authMiddleware');

// IMPORT YOUR NEW MONGOOSE MODELS HERE
const CertificateRequest = require('./models/CertificateRequest');
const Appointment = require('./models/Appointment');

const app = express();

// ==========================================
// MIDDLEWARE
// ==========================================
app.use(helmet()); 
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev')); 
app.use(express.json()); 

const frontendOrigin = process.env.FRONTEND_URL || '*';
app.use(cors({ origin: frontendOrigin }));

// ==========================================
// DATABASE CONNECTION
// ==========================================
async function connectDB() {
  if (!process.env.MONGO_URI) {
    console.error('MONGO_URI is not set in environment');
    process.exit(1);
  }
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected securely to MongoDB Atlas');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
}
connectDB();

// ==========================================
// ROUTES
// ==========================================

// --- 1. Authentication Routes ---
app.use('/api/auth', authRoutes);

// --- 2. Rate Limiting for Public Forms ---
const formSubmissionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    status: 429,
    error: 'Too many requests from this IP, try again after 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// --- 3. Refactored Public Form Submissions (PERSISTING TO MONGODB) ---

app.post('/api/certificates', formSubmissionLimiter, async (req, res, next) => {
  try {
    const { recordType, parish, firstName, lastName, purpose } = req.body;

    // Validate request structure
    if (!recordType || !parish || !firstName || !lastName || !purpose) {
      return res.status(400).json({ error: 'Please provide all required fields.' });
    }

    // Instantiating a new database entry using our schema
    const newRequest = new CertificateRequest({
      recordType,
      parish,
      firstName,
      lastName,
      purpose
    });

    // Commit transaction to MongoDB Atlas cloud database
    const savedRequest = await newRequest.save();

    return res.status(201).json({ 
      message: 'Certificate request received securely.',
      referenceNumber: savedRequest.referenceNumber 
    });
  } catch (err) {
    next(err);
  }
});

app.post('/api/appointments', formSubmissionLimiter, async (req, res, next) => {
  try {
    const { appointmentType, date, time, fullName, phone } = req.body;

    if (!appointmentType || !date || !time || !fullName || !phone) {
      return res.status(400).json({ error: 'Please provide all required fields.' });
    }

    const newAppointment = new Appointment({
      appointmentType,
      date,
      time,
      fullName,
      phone
    });

    const savedAppointment = await newAppointment.save();

    return res.status(201).json({ 
      message: 'Appointment request received securely.',
      referenceNumber: savedAppointment.referenceNumber 
    });
  } catch (err) {
    next(err);
  }
});

// --- 4. Automated Emailing & Staff Updates ---
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.warn('EMAIL_USER or EMAIL_PASS not set. Emailing disabled until configured.');
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Protected route for staff to update request status
app.put('/api/requests/:id/status', requireAuth, async (req, res, next) => {
  const { id } = req.params;
  const { newStatus, userEmail, userName, recordType } = req.body;

  if (!newStatus) return res.status(400).json({ error: 'newStatus is required' });

  try {
    // UPDATING STATUS IN MONGODB ATLAS
    // Finds record by its tracking identification property and modifies status
    const updatedCertificate = await CertificateRequest.findOneAndUpdate(
      { referenceNumber: id }, 
      { status: newStatus },
      { new: true }
    );

    // If it wasn't a certificate, check the appointment database collection instead
    if (!updatedCertificate) {
      await Appointment.findOneAndUpdate(
        { referenceNumber: id },
        { status: newStatus }
      );
    }

    if (newStatus === 'Ready' && userEmail) {
      const mailOptions = {
        from: `"Diocese Portal" <${process.env.EMAIL_USER}>`,
        to: userEmail,
        subject: `Update: Your ${recordType || 'request'} is Ready for Pickup`,
        html: `
          <div style="font-family: Arial, sans-serif; color: #333;">
            <h2>Good day, ${userName || 'Parishioner'}!</h2>
            <p>Your requested <strong>${recordType || 'document'}</strong> (Ref: ${id}) is now fully processed and ready for pickup.</p>
            <p>Please visit the parish office during our standard operating hours (Monday to Friday) to claim your document.</p>
            <p><em>Note: Please bring a valid ID for verification.</em></p>
            <br/>
            <p>God bless,</p>
            <p><strong>Parish Administration</strong></p>
          </div>
        `
      };

      try {
        await transporter.sendMail(mailOptions);
        console.log(`Email successfully sent to ${userEmail}`);
      } catch (emailErr) {
        console.error('Failed to send notification email:', emailErr);
      }
    }

    return res.status(200).json({ message: `Status updated to ${newStatus}. User notified if ready.` });
  } catch (err) {
    next(err);
  }
});

// ==========================================
// ERROR HANDLING & SHUTDOWN
// ==========================================
app.use((req, res) => res.status(404).json({ error: 'Endpoint not found' }));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

process.on('SIGINT', async () => {
  console.log('Shutting down server...');
  await mongoose.disconnect();
  process.exit(0);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server is running smoothly on port ${PORT}`);
});