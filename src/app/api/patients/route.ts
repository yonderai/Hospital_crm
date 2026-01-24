import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Patient from "@/lib/models/Patient";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const role = (session.user as any).role;
        // Verify doctor/admin/nurse role
        if (!['doctor', 'admin', 'nurse'].includes(role)) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        await dbConnect();

        const { searchParams } = new URL(req.url);
        const search = searchParams.get('search');

        let query: Record<string, any> = {};

        if (search) {
            const regex = new RegExp(search, 'i');
            query = {
                $or: [
                    { firstName: { $regex: regex } },
                    { lastName: { $regex: regex } },
                    { mrn: { $regex: regex } },
                    // Searching chronic conditions array if needed, but simplistic regex on strings for now
                    { chronicConditions: { $in: [regex] } }
                ]
            };
        }

        // Strict RBAC: Doctor only sees assigned patients
        if (role === 'doctor') {
            query.assignedDoctorId = (session.user as any).id;
        }

        const patients = await Patient.find(query).sort({ updatedAt: -1 });

        // Map to UI format
        const formattedPatients = patients.map(p => ({
            _id: p._id,
            firstName: p.firstName,
            lastName: p.lastName,
            mrn: p.mrn,
            status: "Stable", // Defaulting for now as status isn't in Patient schema explicitly, usually in encounter/admission
            condition: p.chronicConditions[0] || "N/A", // showing first condition
            lastVisit: new Date(p.updatedAt).toLocaleDateString(),
            severity: "Medium" // Default
        }));

        return NextResponse.json({ patients: formattedPatients });
    } catch (error) {
        console.error("Error fetching patients:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
