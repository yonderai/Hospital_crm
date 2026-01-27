import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from '@/lib/mongoose';
import Prescription from '@/lib/models/Prescription';
import Patient from '@/lib/models/Patient';
import * as fs from 'fs';
import * as path from 'path';

const logPath = path.join(process.cwd(), 'api-debug.log');
const log = (msg: string) => {
    try {
        fs.appendFileSync(logPath, `[${new Date().toISOString()}] RX API: ${msg}\n`);
    } catch (e) { }
};

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        log(`Session: ${session ? JSON.stringify(session.user) : "No session"}`);

        if (!session || (session.user as any).role !== 'patient') {
            log(`Unauthorized access attempt for Prescriptions`);
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        log(`Searching for patient with email: ${session.user?.email}`);

        // Find the clinical patient profile for this user
        const patient = await Patient.findOne({
            $or: [
                { "contact.email": session.user?.email },
                { "email": session.user?.email }
            ]
        });

        if (!patient) {
            log(`Patient profile NOT found for ${session.user?.email}`);
            return NextResponse.json({ data: [] });
        }
        log(`Found patient: ${patient._id} (${patient.firstName})`);

        const prescriptions = await Prescription.find({ patientId: patient._id })
            .populate('providerId', 'firstName lastName department')
            .sort({ prescribedDate: -1 });

        log(`RX API - Prescriptions found: ${prescriptions.length}`);

        const data = prescriptions.map((rx: any) => ({
            id: rx.prescriptionId,
            date: new Date(rx.prescribedDate).toLocaleDateString(),
            doctor: `Dr. ${rx.providerId?.firstName} ${rx.providerId?.lastName}`,
            department: rx.providerId?.department || 'General',
            medications: rx.medications,
            status: rx.status.toUpperCase()
        }));

        return NextResponse.json({ data });
    } catch (error) {
        console.error("Prescription fetch error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
