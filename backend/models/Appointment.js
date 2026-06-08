const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  referenceNumber: {
    type: String,
    unique: true,
    required: true,
    default: () => `APT-${Math.floor(1000 + Math.random() * 9000)}`
  },
  appointmentType: {
    type: String,
    required: true,
    enum: ['Pastoral Counseling', 'Marriage Preparation', 'Baptismal Briefing', 'General Inquiry']
  },
  date: {
    type: String, // Stored as a raw string 'YYYY-MM-DD' from the frontend picker
    required: true
  },
  time: {
    type: String, // Stored as a string slot 'HH:MM'
    required: true
  },
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    required: true,
    enum: ['Pending', 'Confirmed', 'Rescheduled', 'Cancelled'],
    default: 'Pending'
  },
  staffNotes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Appointment', appointmentSchema);