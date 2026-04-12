import mongoose from 'mongoose';

const PatientSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['patient', 'doctor'], required: true, default: 'patient' },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  phone: { type: String, required: true },
  occupation: { type: String, required: true },
  medicalNotes: { type: String, required: true },
}, { timestamps: true, collection: 'patients' });

const DoctorSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['patient', 'doctor'], required: true, default: 'doctor' },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  phone: { type: String, required: true },
  specialization: { type: String, required: true },
  experience: { type: Number, required: true },
  location: { type: String, required: true },
  qualification: { type: String, required: true },
}, { timestamps: true, collection: 'doctors' });

const Patient = mongoose.models.Patient || mongoose.model('Patient', PatientSchema);
const Doctor = mongoose.models.Doctor || mongoose.model('Doctor', DoctorSchema);

export { Patient, Doctor };
export default Patient;
