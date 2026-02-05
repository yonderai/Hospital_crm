import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from '@/lib/db';
import Patient from "@/lib/models/Patient";
import Bed from "@/lib/models/Bed";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        // Find Patient by Email (linking User to Patient)
        // Assuming the logged in user's email matches the patient's email
        const patient = await Patient.findOne({ email: session.user.email });

        if (!patient) {
            return NextResponse.json({ message: "Patient profile not found" });
        }

        // Find Bed where this patient is admitted
        const bed = await Bed.findOne({ currentPatientId: patient._id });

        if (!bed) {
            return NextResponse.json({ admitted: false });
        }

        return NextResponse.json({
            admitted: true,
            bed: {
                roomNumber: bed.roomNumber,
                bedNumber: bed.bedNumber,
                floor: bed.floor,
                ward: bed.ward,
                admissionDate: bed.updatedAt // Using update time as admission time proxy for now
            }
        });

    } catch (error: any) {
        console.error("Admission Fetch Error:", error);
        return NextResponse.json({ error: "Failed to fetch admission details" }, { status: 500 });
    }
}
