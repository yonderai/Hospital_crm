import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import ORCase from '@/lib/models/ORCase';
import Staff from '@/lib/models/Staff';
import User from '@/lib/models/User';
import Encounter from '@/lib/models/Encounter';

export async function POST(req: NextRequest) {
    await dbConnect();
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user?.role !== "doctor") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { patientId, procedureName, scheduledDate, startTime, orRoomId, notes } = body;

        // Create the OR Case
        // Assign surgeonId from the logged-in user session if they are a doctor,
        // otherwise find a doctor in the User collection.
        const currentUser = await User.findOne({ email: session.user?.email });
        const fallbackDoctor = !currentUser ? await User.findOne({ role: 'doctor' }) : null;
        const surgeonId = currentUser?._id || fallbackDoctor?._id || "64b0f1a2e4b0f1a2e4b0f1a2";

        const newCase = await ORCase.create({
            patientId,
            surgeonId,
            procedureName,
            procedureCode: "SURG-" + Math.floor(Math.random() * 1000).toString().padStart(3, '0'),
            scheduledDate: new Date(scheduledDate),
            startTime: startTime,
            orRoomId,
            status: 'scheduled',
            notes
        });

        // Create an accompanying Encounter for clinical history/SOAP notes
        await Encounter.create({
            encounterId: "ENC-" + Math.floor(Math.random() * 1000000).toString().padStart(6, '0'),
            patientId,
            providerId: surgeonId,
            type: "outpatient",
            chiefComplaint: `Surgery Scheduled: ${procedureName}`,
            soapNotes: {
                subjective: `Patient scheduled for ${procedureName}.`,
                objective: `Planned for ${scheduledDate} at ${startTime} in ${orRoomId}.`,
                assessment: `Requires surgical intervention: ${procedureName}.`,
                plan: notes || "Standard pre-operative protocol."
            },
            status: "open"
        });

        return NextResponse.json(newCase, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    await dbConnect();
    try {
        const cases = await ORCase.find({})
            .populate('patientId', 'firstName lastName mrn')
            .populate('surgeonId', 'firstName lastName')
            .sort({ scheduledDate: 1 });
        return NextResponse.json(cases);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
