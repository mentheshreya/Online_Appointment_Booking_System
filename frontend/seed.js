import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './lib/models/User.js';

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if test user exists
    const existingUser = await User.findOne({ email: 'patient@test.com' });
    if (existingUser) {
      console.log('Test patient user already exists');
      return;
    }

    // Create test patient
    const hashedPassword = await bcrypt.hash('password123', 10);
    const patient = new User({
      email: 'patient@test.com',
      password: hashedPassword,
      name: 'Test Patient',
      role: 'patient',
      location: 'Pune',
    });
    await patient.save();
    console.log('Test patient created');

    // Create test doctor
    const existingDoctor = await User.findOne({ email: 'doctor@test.com' });
    if (!existingDoctor) {
      const hashedDocPassword = await bcrypt.hash('password123', 10);
      const doctor = new User({
        email: 'doctor@test.com',
        password: hashedDocPassword,
        name: 'Dr. Test Doctor',
        role: 'doctor',
        specialization: 'Cardiologist',
        location: 'Pune',
        availableSlots: ['10:00 AM', '11:00 AM', '2:00 PM'],
      });
      await doctor.save();
      console.log('Test doctor created');
    }

  } catch (error) {
    console.error('Error seeding:', error);
  } finally {
    mongoose.connection.close();
  }
}

seed();