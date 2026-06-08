const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose'); // IMPORT MONGOOSE
require('dotenv').config();

const authRoutes = require('./routes/auth');
const requireAuth = require('./middleware/authMiddleware');

const app = express();

// Middleware
app.use(cors()); // Allows your React frontend to talk to this backend
app.use(express.json()); // Allows Express to read JSON data from frontend forms

// Connect to MongoDB Database
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected securely to MongoDB Atlas'))
  .catch((err) => console.error('MongoDB connection error:', err));

// --- REGISTER ROUTES ---
app.use('/api/auth', authRoutes); // This enables /api/auth/login and /api/auth/register

// ==========================================
// 1. RATE LIMITING (Protection)
// ==========================================
// Limits each IP to 5 requests per 15 minutes
const formSubmissionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 5, 
  message: {
    status: 429,
    error: 'Too many requests created from this IP, please try again after 15 minutes.'
  },
  standardHeaders: true, 
  legacyHeaders: false, 
});

// Apply the limiter to your public submission routes
app.post('/api/certificates', formSubmissionLimiter, (req, res) => {
  // TODO: Save certificate request to MongoDB here
  res.status(200).json({ message: "Certificate request received securely." });
});

app.post('/api/appointments', formSubmissionLimiter, (req, res) => {
  // TODO: Save appointment booking to MongoDB here
  res.status(200).json({ message: "Appointment request received securely." });
});


// ==========================================
// 2. AUTOMATED EMAILING (Nodemailer)
// ==========================================
// Configure the email transporter using credentials from your .env file
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// The route triggered when a staff member updates a request on their dashboard
app.put('/api/requests/:id/status', async (req, res) => {
  const { id } = req.params;
  const { newStatus, userEmail, userName, recordType } = req.body;

  try {
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

    const app = express();

    // Basic security & logging
    app.use(helmet());
    app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

    // CORS - allow frontend origin if provided, otherwise allow all (dev)
    const frontendOrigin = process.env.FRONTEND_URL || '*';
    app.use(cors({ origin: frontendOrigin }));
    app.use(express.json());

    // Connect to MongoDB (with options)
    async function connectDB() {
      if (!process.env.MONGO_URI) {
        console.error('MONGO_URI is not set in environment');
        process.exit(1);
      }

      try {
        await mongoose.connect(process.env.MONGO_URI, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
        console.log('Connected securely to MongoDB Atlas');
      } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1);
      }
    }
    connectDB();

    // --- REGISTER ROUTES ---
    app.use('/api/auth', authRoutes);

    // ==========================================
    // 1. RATE LIMITING (Protection)
    // ==========================================
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

    // Public submission endpoints
    app.post('/api/certificates', formSubmissionLimiter, async (req, res, next) => {
      try {
        const payload = req.body || {};
        // Minimal validation example
        if (!payload.name || !payload.recordType) {
          return res.status(400).json({ error: 'Missing required fields: name and recordType' });
        }

        // TODO: persist to MongoDB using a Certificate model
        console.log('Certificate request received:', payload);
        return res.status(201).json({ message: 'Certificate request received securely.' });
      } catch (err) {
        next(err);
      }
    });

    app.post('/api/appointments', formSubmissionLimiter, async (req, res, next) => {
      try {
        const payload = req.body || {};
        if (!payload.name || !payload.date) {
          return res.status(400).json({ error: 'Missing required fields: name and date' });
        }

        // TODO: persist to MongoDB using an Appointment model
        console.log('Appointment request received:', payload);
        return res.status(201).json({ message: 'Appointment request received securely.' });
      } catch (err) {
        next(err);
      }
    });


    // ==========================================
    // 2. AUTOMATED EMAILING (Nodemailer)
    // ==========================================
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

    // Verify transporter on startup (non-blocking)
    transporter.verify()
      .then(() => console.log('Email transporter is ready'))
      .catch((err) => console.warn('Email transporter verification failed:', err.message || err));

    // Protected route for staff to update request status
    app.put('/api/requests/:id/status', requireAuth, async (req, res, next) => {
      const { id } = req.params;
      const { newStatus, userEmail, userName, recordType } = req.body;

      if (!newStatus) return res.status(400).json({ error: 'newStatus is required' });

      try {
        // TODO: Update the status in MongoDB here (e.g., Request.findByIdAndUpdate)

        if (newStatus === 'Ready' && userEmail) {
          const mailOptions = {
            from: `"Diocese of Kalookan Portal" <${process.env.EMAIL_USER}>`,
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


    // 404 handler
    app.use((req, res) => res.status(404).json({ error: 'Not found' }));

    // Global error handler
    app.use((err, req, res, next) => {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      console.log('Shutting down server...');
      await mongoose.disconnect();
      process.exit(0);
    });

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Backend server is running smoothly on port ${PORT}`);
    });