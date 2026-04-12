import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Doctor } from '@/lib/models/User';

export async function GET() {
  try {
    await dbConnect();
    const doctors = await Doctor.find().select('-password').lean();
    return NextResponse.json(doctors);
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err.message);
    } else {
      console.error('Unknown error');
    }
    return NextResponse.json({ error: 'Unable to fetch doctors' }, { status: 500 });
  }
}

