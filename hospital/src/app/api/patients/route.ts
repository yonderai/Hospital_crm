import { NextResponse } from 'next/server';
import dbConnect from "@/lib/mongoose";
import Patient from "@/lib/models/Patient";
import { protectRoute } from "@/lib/api-guard";

export async function GET() {
    const auth = await protectRoute(["doctor", "nurse", "front-desk", "admin"]);
    if (auth.error) {
        return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    try {
        await dbConnect();
        const patients = await Patient.find({})
            .sort({ updatedAt: -1 })
            .limit(50)
            .lean();

        // Transform for UI (Deterministic Mapping for Demo Filtering)
        const formattedPatients = patients.map((p: any) => {
            // Deterministic Logic based on MRN to simulate different statuses
            const lastDigit = parseInt(p.mrn.slice(-1)) || 0;
            const isCritical = p.chronicConditions?.some((c: string) => c.toLowerCase().includes('heart') || c.toLowerCase().includes('diabetes'));

            let status = "Active";
            let type = "OPD";
            let severity = "Stable";

            if (isCritical) {
                status = "Admitted";
                type = "IPD";
                severity = "High";
            } else if (lastDigit % 3 === 0) {
                status = "Admitted";
                type = "IPD";
                severity = "Moderate";
            } else {
                status = "Active";
                type = "OPD";
                severity = "Low";
            }

            return {
                _id: p._id,
                firstName: p.firstName,
                lastName: p.lastName,
                mrn: p.mrn,
                status: status, // For UI badge
                type: type, // For filtering (IPD/OPD)
                condition: p.chronicConditions?.[0] || "General Checkup",
                lastVisit: p.updatedAt ? new Date(p.updatedAt).toLocaleDateString() : "N/A",
                severity: severity, // For filtering
                isCritical: severity === "High" // Helper
            };
        });

        return NextResponse.json({ patients: formattedPatients });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const auth = await protectRoute(["front-desk", "admin", "doctor"]);
    if (auth.error) {
        return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    try {
        await dbConnect();
        const data = await req.json();

        // Basic validation could go here or Zod

        // Check for existing MRN? 
        const existing = await Patient.findOne({ mrn: data.mrn });
        if (existing) {
            return NextResponse.json({ error: "Patient with this MRN already exists" }, { status: 400 });
        }

        const patient = await Patient.create({
            ...data,
            // Ensure some defaults if missing
            chronicConditions: data.chronicConditions || [],
        });

        return NextResponse.json(patient, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
