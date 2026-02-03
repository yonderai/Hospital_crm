import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from '@/lib/mongoose';
import Patient from '@/lib/models/Patient';
import ORCase from '@/lib/models/ORCase';
import User from '@/lib/models/User';
import Staff from '@/lib/models/Staff';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== 'patient') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        // Find the clinical patient profile for this user
        const patient = await Patient.findOne({ "contact.email": session.user?.email });

        if (!patient) {
            return NextResponse.json([]);
        }

        const surgeries = await ORCase.find({ patientId: patient._id })
            .populate('surgeonId', 'firstName lastName')
            .sort({ scheduledDate: -1 });

        return NextResponse.json(surgeries);
    } catch (error: any) {
        console.error("Patient surgery fetch error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
