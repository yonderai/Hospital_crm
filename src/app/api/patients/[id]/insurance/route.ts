
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Patient from "@/lib/models/Patient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // Assuming authOptions is exported from here

export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        await dbConnect();

        // Auth Check (Optional but recommended)
        // const session = await getServerSession(authOptions);
        // if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const patient = await Patient.findOne({
            $or: [
                { mrn: params.id },
                { "contact.email": params.id } // Allow fetching by email too if ID is email
            ]
        }).select('insuranceInfo');

        if (!patient) {
            return NextResponse.json({ error: "Patient not found" }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            data: patient.insuranceInfo
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
    try {
        await dbConnect();
        const data = await request.json();

        // Find patient
        const patient = await Patient.findOne({
            $or: [
                { mrn: params.id },
                { "contact.email": params.id }
            ]
        });

        if (!patient) {
            return NextResponse.json({ error: "Patient not found" }, { status: 404 });
        }

        // Update Insurance Info
        // carefully merge or replace
        patient.insuranceInfo = {
            ...patient.insuranceInfo,
            ...data,
            // Ensure types
            validUntil: data.validUntil ? new Date(data.validUntil) : patient.insuranceInfo.validUntil,
        };

        await patient.save();

        return NextResponse.json({
            success: true,
            message: "Insurance updated successfully",
            data: patient.insuranceInfo
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
