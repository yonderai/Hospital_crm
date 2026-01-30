import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import Encounter from "@/lib/models/Encounter";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !["nurse", "admin", "doctor"].includes(session.user?.role)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        // Fetch recent encounters for the clinical feed
        // Populate patient details and provider details
        const encounters = await Encounter.find({})
            .populate('patientId', 'firstName lastName')
            .populate('providerId', 'firstName lastName')
            .sort({ createdAt: -1 })
            .limit(50);

        return NextResponse.json(encounters);
    } catch (error) {
        console.error("Fetch nurse clinical updates error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
