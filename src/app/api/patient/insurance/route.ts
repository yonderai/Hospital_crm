import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from '@/lib/mongoose';
import Patient from '@/lib/models/Patient';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session || (session.user as any).role !== 'patient') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        // Find patient by user email
        const patient = await Patient.findOne({
            $or: [
                { "contact.email": session.user.email },
                { "email": session.user.email }
            ]
        });

        if (!patient) {
            return NextResponse.json({ error: "Patient not found" }, { status: 404 });
        }

        return NextResponse.json({
            data: {
                provider: patient.insuranceInfo?.provider || "N/A",
                policyNumber: patient.insuranceInfo?.policyNumber || "N/A",
                groupNumber: patient.insuranceInfo?.groupNumber || "N/A",
                status: "Active", // Mock status
                expiryDate: "12/2026", // Mock expiry
                coverageType: "Full Medical Coverage" // Mock coverage
            }
        });
    } catch (error) {
        console.error("Error fetching patient insurance:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
