import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from '@/lib/db';
import Patient from "@/lib/models/Patient";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user?.role !== "doctor") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        // In a real scenario, we might filter by assignedDoctorId if strict assignment is needed.
        // For now, fetching all patients or those assigned to this doctor.
        // The prompt says "Sees only assigned patients".
        
        const doctorId = session.user.id;
        
        // Find patients assigned to this doctor OR all patients if we want to be lenient for demo
        // Strict interpretation:
        const patients = await Patient.find({ assignedDoctorId: doctorId })
            .select("mrn firstName lastName dob gender contact bloodType allergies chronicConditions")
            .sort({ updatedAt: -1 });

        return NextResponse.json(patients);

    } catch (error) {
        console.error("Error fetching patients:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
