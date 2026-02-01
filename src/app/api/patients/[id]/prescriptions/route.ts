import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from '@/lib/db';
import Prescription from '@/lib/models/Prescription';
import Patient from '@/lib/models/Patient';

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);
        if (!session || !['doctor', 'admin', 'nurse'].includes((session.user as any).role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        const prescriptions = await Prescription.find({ patientId: id })
            .populate('providerId', 'firstName lastName department')
            .sort({ prescribedDate: -1 });

        return NextResponse.json(prescriptions);
    } catch (error) {
        console.error("Fetch patient prescriptions error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== 'doctor') {
            return NextResponse.json({ error: 'Only doctors can prescribe' }, { status: 401 });
        }

        await dbConnect();
        const body = await req.json();

        const { medications } = body;
        if (!medications || !Array.isArray(medications) || medications.length === 0) {
            return NextResponse.json({ error: 'Medications are required' }, { status: 400 });
        }

        const prescriptionId = `RX-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        const newPrescription = await Prescription.create({
            prescriptionId,
            patientId: id,
            providerId: (session.user as any).id,
            medications,
            status: 'active',
            prescribedDate: new Date(),
            encounterId: body.encounterId,
            appointmentId: body.appointmentId
        });

        return NextResponse.json(newPrescription, { status: 201 });
    } catch (error) {
        console.error("Create prescription error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
