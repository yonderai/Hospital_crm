import { NextResponse } from "next/server";
import dbConnect from '@/lib/db';
import EmergencyCase from "@/lib/models/EmergencyCase";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
    try {
        await dbConnect();
        // Fetch active cases
        const cases = await EmergencyCase.find({
            status: { $in: ["triage", "treatment", "observation"] }
        })
            .sort({ updatedAt: -1 })
            .populate("patientId", "firstName lastName dob gender mrn");

        return NextResponse.json(cases);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch cases" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const body = await req.json();
        await dbConnect();

        // Basic validation
        if (!body.chiefComplaint || !body.arrivalMode) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const newCase = await EmergencyCase.create({
            ...body,
            status: "triage", // Always start at triage
            triageLevel: "P3" // Default, updated by Triage officer
        });

        return NextResponse.json(newCase, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to register case" }, { status: 500 });
    }
}
