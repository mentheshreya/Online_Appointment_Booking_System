import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import { Patient, Doctor } from '@/lib/models/User';

const isEmailValid = (email: string) => typeof email === 'string' && email.includes('@');
const isNumericString = (value: string) => !Number.isNaN(Number(value)) && value.trim() !== '';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const { role, name, age, gender, phone, email, password, occupation, medicalNotes, specialization, experience, location, qualification } = body;

    if (!role || !['patient', 'doctor'].includes(role)) {
      return NextResponse.json({ error: 'Please select patient or doctor' }, { status: 400 });
    }

    if (!name || !age || !gender || !phone || !email || !password) {
      return NextResponse.json({ error: 'All basic fields are required' }, { status: 400 });
    }

    if (!isEmailValid(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    if (!isNumericString(String(age)) || Number(age) <= 0) {
      return NextResponse.json({ error: 'Age must be a valid number' }, { status: 400 });
    }

    const existingEmail = await Patient.findOne({ email }) || await Doctor.findOne({ email });
    if (existingEmail) {
      return NextResponse.json({ error: 'Email already in use' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    if (role === 'patient') {
      if (!occupation || !medicalNotes) {
        return NextResponse.json({ error: 'Patient role requires occupation and medical notes' }, { status: 400 });
      }
      const patient = new Patient({
        name,
        age: Number(age),
        gender,
        phone,
        email,
        password: hashedPassword,
        role,
        occupation,
        medicalNotes,
      });
      await patient.save();
      return NextResponse.json({ message: 'Patient account created successfully' }, { status: 201 });
    }

    if (!specialization || !experience || !location || !qualification) {
      return NextResponse.json({ error: 'Doctor role requires full profile details' }, { status: 400 });
    }

    const doctor = new Doctor({
      name,
      age: Number(age),
      gender,
      phone,
      email,
      password: hashedPassword,
      role,
      specialization,
      experience: Number(experience),
      location,
      qualification,
    });
    await doctor.save();
    return NextResponse.json({ message: 'Doctor account created successfully' }, { status: 201 });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err.message);
    } else {
      console.error('Unknown error');
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
