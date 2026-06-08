const mongoose = require('mongoose');

const certificateRequestSchema = new mongoose.Schema({
  referenceNumber: {
    type: String,
    unique: true,
    required: true,
    default: () => `REQ-${Math.floor(1000 + Math.random() * 9000)}`
  },
  recordType: {
    type: String,
    required: true,
    enum: ['baptism', 'confirmation', 'marriage'] // Restricts input to valid database choices
  },
  parish: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  purpose: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    required: true,
    enum: ['Pending', 'Processing', 'Ready', 'Archived'],
    default: 'Pending'
  },
  staffNotes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true // Automatically creates 'createdAt' and 'updatedAt' database fields
});

module.exports = mongoose.model('CertificateRequest', certificateRequestSchema);