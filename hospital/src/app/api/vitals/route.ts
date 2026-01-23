
import { NextResponse } from 'next/server';
import dbConnect from "@/lib/mongoose";
import ClinicalRecord from "@/lib/models/ClinicalRecord";
import Patient from "@/lib/models/Patient";
import { protectRoute } from "@/lib/api-guard";

export async function POST(req: Request) {
    const auth = await protectRoute(["nurse", "doctor", "admin"]);
    if (auth.error) {
        return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    try {
        await dbConnect();
        const body = await req.json();
        const { patientId, vitals } = body;

        if (!patientId || !vitals) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const record = await ClinicalRecord.create({
            patientId,
            providerId: auth.user!.id,
            type: "Vitals",
            data: vitals,
            recordedAt: new Date()
        });

        return NextResponse.json(record, { status: 201 });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET(req: Request) {
    const auth = await protectRoute(["nurse", "doctor", "admin"]);
    if (auth.error) {
        return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    // Simplistic last 50 vitals fetch
    try {
        await dbConnect();
        const url = new URL(req.url);
        const patientId = url.searchParams.get("patientId");

        const filter = patientId ? { patientId, type: "Vitals" } : { type: "Vitals" };

        const records = await ClinicalRecord.find(filter)
            .sort({ recordedAt: -1 })
            .limit(50)
            .populate("patientId", "firstName lastName mrn")
            .populate("providerId", "firstName lastName role");

        return NextResponse.json({ records });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
