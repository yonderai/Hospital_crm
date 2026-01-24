
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Patient from "@/lib/models/Patient";
import User from "@/lib/models/User";

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const role = (session.user as any).role;
        // Verify doctor role (or admin/nurse)
        if (!['doctor', 'admin', 'nurse'].includes(role)) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        await dbConnect();

        // Find patient
        const patient = await Patient.findById(params.id)
            .populate('assignedDoctorId', 'firstName lastName department');

        if (!patient) {
            return NextResponse.json({ error: "Patient not found" }, { status: 404 });
        }

        // Optional: specific check if doctor is assigned to patient (if strict RBAC is needed)
        // For this demo, assuming any doctor of the hospital can view (common in EMRs unless restricted)

        return NextResponse.json(patient);
    } catch (error) {
        console.error("Error fetching patient:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
