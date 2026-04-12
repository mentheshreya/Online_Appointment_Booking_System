import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '../../../lib/mongodb';
import { Patient, Doctor } from '../../../lib/models/User';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  id: string;
  role: 'patient' | 'doctor';
}

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    const user = decoded.role === 'doctor'
      ? await Doctor.findById(decoded.id).select('-password')
      : await Patient.findById(decoded.id).select('-password');
    return NextResponse.json(user);
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err.message);
    } else {
      console.error('Unknown error');
    }
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectToDatabase();
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    const { name, email, phone } = await req.json();
    const updater = { name, email, phone };

    const user = decoded.role === 'doctor'
      ? await Doctor.findByIdAndUpdate(decoded.id, updater, { new: true }).select('-password')
      : await Patient.findByIdAndUpdate(decoded.id, updater, { new: true }).select('-password');
    return NextResponse.json(user);
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err.message);
    } else {
      console.error('Unknown error');
    }
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}