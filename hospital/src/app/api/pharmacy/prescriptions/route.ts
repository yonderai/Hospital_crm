import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Prescription from "@/lib/models/Prescription";
import { protectRoute } from "@/lib/api-guard";

export async function GET() {
    const auth = await protectRoute(["pharmacist", "admin", "doctor"]);
    if (auth.error) {
        return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    try {
        await dbConnect();

        const prescriptions = await Prescription.find({ status: "active" })
            .populate("patientId", "firstName lastName mrn")
            .populate("providerId", "firstName lastName")
            .sort({ createdAt: 1 })
            .limit(50);

        return NextResponse.json(prescriptions);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
