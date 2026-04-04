import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '../../../lib/mongodb';
import Appointment from '../../../lib/models/Appointment';
import jwt from 'jsonwebtoken';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const { doctorId, date, time } = await req.json();

    const appointment = new Appointment({
      patient: decoded.id,
      doctor: doctorId,
      date: new Date(date),
      time,
    });

    await appointment.save();
    return NextResponse.json({ message: 'Appointment booked successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to book appointment' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const appointments = await Appointment.find({ patient: decoded.id }).populate('doctor', 'name email');
    return NextResponse.json(appointments);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch appointments' }, { status: 500 });
  }
}