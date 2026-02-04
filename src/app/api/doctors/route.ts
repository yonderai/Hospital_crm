import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/lib/models/User';

export async function GET() {
    await dbConnect();

    const doctors = await User.find({ role: 'doctor' })
        .select('firstName lastName department _id')
        .sort({ firstName: 1 });

    return NextResponse.json(doctors);
}
