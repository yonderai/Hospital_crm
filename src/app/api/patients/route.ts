import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Patient from "@/lib/models/Patient";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const data = await req.json();

        // Generate a simple MRN for mock purposes if not provided
        if (!data.mrn) {
            data.mrn = `MRN-${Date.now().toString().slice(-6)}`;
        }

        const patient = await Patient.create(data);
        return NextResponse.json(patient, { status: 201 });
    } catch (error: any) {
        console.error("Patient Creation Error:", error);
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const { searchParams } = new URL(req.url);
        const query = searchParams.get("q");

        let filter = {};
        if (query) {
            filter = {
                $or: [
                    { firstName: { $regex: query, $options: "i" } },
                    { lastName: { $regex: query, $options: "i" } },
                    { mrn: { $regex: query, $options: "i" } },
                ],
            };
        }

        const patients = await Patient.find(filter).sort({ createdAt: -1 }).limit(50);
        return NextResponse.json(patients);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
