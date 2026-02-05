
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Encounter from "@/lib/models/Encounter";

function generateId(length: number) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== 'nurse') {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const { patientId, note, type = "inpatient" } = await req.json();

        if (!patientId || !note) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const encounter = await Encounter.create({
            encounterId: `ENC-${generateId(8)}`,
            patientId,
            providerId: (session.user as any).id,
            encounterDate: new Date(),
            type,
            chiefComplaint: "Nursing Clinical Note",
            soapNotes: {
                assessment: note
            },
            status: "open" // Or closed? Open usually implies ongoing encounter.
        });


        return NextResponse.json(encounter, { status: 201 });
    } catch (error) {
        console.error("Error creating clinical note:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        // Allow doctors/nurses/admin to view notes
        if (!session || !['nurse', 'doctor', 'admin'].includes((session.user as any).role)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const { searchParams } = new URL(req.url);
        const patientId = searchParams.get('patientId');

        if (!patientId) {
            return NextResponse.json({ error: "Patient ID required" }, { status: 400 });
        }

        const notes = await Encounter.find({
            patientId,
            // Optional: filter by type or chiefComplaint if we only want nursing notes
            // type: "inpatient" 
        })
            .sort({ createdAt: -1 })
            .populate('providerId', 'firstName lastName role');

        return NextResponse.json(notes);
    } catch (error) {
        console.error("Error fetching notes:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
