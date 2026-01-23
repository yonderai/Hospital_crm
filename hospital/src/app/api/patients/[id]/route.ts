import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Patient from "@/lib/models/Patient";
import { protectRoute } from "@/lib/api-guard";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const auth = await protectRoute(["doctor", "nurse", "front-desk", "admin"]);
    if (auth.error) {
        return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    try {
        await dbConnect();
        const { id } = await params;

        const patient = await Patient.findById(id).lean();

        if (!patient) {
            return NextResponse.json({ error: "Patient not found" }, { status: 404 });
        }

        return NextResponse.json(patient);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
