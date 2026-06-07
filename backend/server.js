const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors()); // Allows your React frontend to talk to this backend
app.use(express.json()); // Allows Express to read JSON data from frontend forms

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
    // TODO: Update the status in MongoDB here

    // If the staff marks the document as "Ready", fire off the email
    if (newStatus === 'Ready') {
      const mailOptions = {
        from: `"Diocese of Kalookan Portal" <${process.env.EMAIL_USER}>`,
        to: userEmail,
        subject: `Update: Your ${recordType} is Ready for Pickup`,
        html: `
          <div style="font-family: Arial, sans-serif; color: #333;">
            <h2>Good day, ${userName}!</h2>
            <p>Your requested <strong>${recordType}</strong> (Ref: ${id}) is now fully processed and ready for pickup.</p>
            <p>Please visit the parish office during our standard operating hours (Monday to Friday) to claim your document.</p>
            <p><em>Note: Please bring a valid ID for verification.</em></p>
            <br/>
            <p>God bless,</p>
            <p><strong>Parish Administration</strong></p>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);
      console.log(`Email successfully sent to ${userEmail}`);
    }

    res.status(200).json({ message: `Status updated to ${newStatus}. User notified if ready.` });

  } catch (error) {
    console.error('Error updating status or sending email:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ==========================================
// SERVER INITIALIZATION
// ==========================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server is running smoothly on port ${PORT}`);
});