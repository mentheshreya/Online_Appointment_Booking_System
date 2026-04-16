const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  phone: {
    type: String,
  },
  age: {
    type: Number,
  },
  gender: {
    type: String,
  },
  address: {
    type: String,
  },
  medicalHistory: {
    type: String,
  },
  profilePhoto: {
    type: String,
  }
}, { timestamps: true });

module.exports = mongoose.model('Patient', patientSchema);
