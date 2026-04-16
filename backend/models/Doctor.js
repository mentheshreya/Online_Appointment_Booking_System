const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  phone: {
    type: String,
  },
  specialization: {
    type: String,
  },
  experience: {
    type: Number,
  },
  location: {
    type: String,
  },
  clinicName: {
    type: String,
  },
  fees: {
    type: Number,
  },
  availableTimeSlots: {
    type: [String], // e.g., ["10:00 AM", "11:00 AM", "2:00 PM"]
    default: [],
  },
  blockedDates: {
    type: [String], // e.g., ["2024-04-18"]
    default: [],
  },
  dateSpecificSlots: [{
    date: { type: String },
    slots: [{ type: String }]
  }],
  profilePhoto: {
    type: String,
  }
}, { timestamps: true });

// Add index for searching
doctorSchema.index({ specialization: 'text', location: 'text' });

module.exports = mongoose.model('Doctor', doctorSchema);
