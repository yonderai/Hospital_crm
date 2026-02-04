import { NextResponse } from "next/server";
import dbConnect from '@/lib/db';
import EmergencyCase from "@/lib/models/EmergencyCase";
import Ambulance from "@/lib/models/Ambulance";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
    try {
        await dbConnect();

        // Parallel queries for speed
        const [
            totalActive,
            waitingTriage,
            criticalCases,
            ambulances
        ] = await Promise.all([
            EmergencyCase.countDocuments({ status: { $in: ["triage", "treatment", "observation"] } }),
            EmergencyCase.countDocuments({ status: "triage" }),
            EmergencyCase.countDocuments({ triageLevel: "P1", status: { $in: ["triage", "treatment", "observation"] } }),
            Ambulance.find({ status: { $ne: "maintenance" } }).select("plateNumber status eta")
        ]);

        return NextResponse.json({
            activeCases: totalActive,
            waitingTriage,
            criticalP1: criticalCases,
            ambulances
        });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
    }
}
