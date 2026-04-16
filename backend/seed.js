require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Patient = require('./models/Patient');
const Doctor = require('./models/Doctor');

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Wipe existing data just in case to avoid duplicates for the seeded emails
    await User.deleteMany({ email: { $in: ['patient@medislot.com', 'doctor@medislot.com'] }});

    // Create test patient
    const hashedPassword = await bcrypt.hash('password123', 10);
    const patientUser = new User({
      email: 'patient@medislot.com',
      password: hashedPassword,
      name: 'John Doe (Patient)',
      role: 'patient',
    });
    await patientUser.save();
    
    await Patient.create({
      user: patientUser._id,
      phone: '1234567890',
      age: 28,
      gender: 'Male',
      address: 'Pune, Maharashtra',
      medicalHistory: 'None',
    });

    console.log('Test patient created: patient@medislot.com / password123');

    // Create test doctor
    const doctorUser = new User({
      email: 'doctor@medislot.com',
      password: hashedPassword,
      name: 'Dr. Jane Smith',
      role: 'doctor',
    });
    await doctorUser.save();

    await Doctor.create({
      user: doctorUser._id,
      phone: '0987654321',
      specialization: 'Cardiologist',
      experience: 12,
      location: 'City Hospital, Mumbai',
      clinicName: 'Heartbeat Clinic',
      fees: 500,
      availableTimeSlots: ['10:00 AM', '11:00 AM', '02:00 PM', '04:00 PM'],
    });

    console.log('Test doctor created: doctor@medislot.com / password123');

  } catch (error) {
    console.error('Error seeding:', error);
  } finally {
    mongoose.connection.close();
  }
}

seed();
