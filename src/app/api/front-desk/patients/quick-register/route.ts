import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Patient from "@/lib/models/Patient";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { firstName, lastName, age, gender, phone, reason } = body;

        if (!firstName || !lastName || !age || !gender || !phone) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        await dbConnect();

        // Calculate generic DOB from age
        const currentYear = new Date().getFullYear();
        const birthYear = currentYear - parseInt(age);
        const dob = new Date(`${birthYear}-01-01`);

        // Generate MRN
        const latestPatient = await Patient.findOne().sort({ createdAt: -1 });
        let nextMrnId = 1;
        if (latestPatient && latestPatient.mrn) {
            const parts = latestPatient.mrn.split('-');
            if (parts.length > 2) {
                nextMrnId = parseInt(parts[2]) + 1;
            }
        }
        const mrn = `MRN-${currentYear}-${nextMrnId.toString().padStart(6, '0')}`;

        const newPatient = await Patient.create({
            mrn,
            firstName,
            lastName,
            dob,
            gender: gender.toLowerCase(),
            contact: {
                phone,
                email: undefined,
                address: "Walk-in"
            },
            notes: `Walk-in. Reason: ${reason || 'Not specified'}`,
            createdBy: session.user.id
        });

        return NextResponse.json({
            success: true,
            patient: {
                _id: newPatient._id,
                firstName: newPatient.firstName,
                lastName: newPatient.lastName,
                mrn: newPatient.mrn,
                phone: newPatient.contact.phone
            }
        });

    } catch (error: any) {
        console.error("Quick Register Error:", error);
        return NextResponse.json({ error: error.message || "Failed to register patient" }, { status: 500 });
    }
}
