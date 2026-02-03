import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from '@/lib/mongoose';
import RefillRequest from '@/lib/models/RefillRequest';
import Prescription from '@/lib/models/Prescription';
import Patient from '@/lib/models/Patient';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== 'patient') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const { prescriptionId, drugName } = await req.json();

        // 1. Find Patient
        const patient = await Patient.findOne({
            $or: [
                { "contact.email": session.user?.email },
                { "email": session.user?.email }
            ]
        });

        if (!patient) {
            return NextResponse.json({ error: "Patient profile not found" }, { status: 404 });
        }

        // 2. Find Prescription
        // Note: frontend passes 'id' which maps to 'prescriptionId' string, OR we might need to find by that custom field
        // Let's check how frontend passes it. It uses rx.id which comes from rx.prescriptionId (string).
        // BUT, RefillRequest expects ObjectId for prescriptionId reference.
        // So we need to find the document first.

        const prescription = await Prescription.findOne({ prescriptionId: prescriptionId }); // Find by custom string ID

        if (!prescription) {
            return NextResponse.json({ error: "Prescription not found" }, { status: 404 });
        }

        // 3. Check for existing pending request
        const existing = await RefillRequest.findOne({
            patientId: patient._id,
            prescriptionId: prescription._id,
            drugName: drugName,
            status: "pending"
        });

        if (existing) {
            return NextResponse.json({ message: "Refill request already pending" }, { status: 200 });
        }

        // 4. Create Request
        const newRequest = await RefillRequest.create({
            patientId: patient._id,
            prescriptionId: prescription._id,
            drugName: drugName,
            doctorId: prescription.providerId,
            status: "pending"
        });

        return NextResponse.json({ success: true, message: "Refill requested successfully" });

    } catch (error: any) {
        console.error("Refill Request Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
