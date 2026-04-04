import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['patient', 'doctor'], required: true },
  specialization: { type: String }, // for doctors
  location: { type: String },
  phone: { type: String },
  bio: { type: String },
  rating: { type: Number, default: 0 },
  reviews: { type: Number, default: 0 },
  availableSlots: [{ type: String }], // for doctors, array of time strings
  blockedDates: [{ type: Date }],
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);