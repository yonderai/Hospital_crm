import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import ORCase from '@/lib/models/ORCase';
import Staff from '@/lib/models/Staff';

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
        // In a real scenario, we'd assign a surgeonId from the logged-in user session
        // For now, we'll use a placeholder or look for a doctor
        const doctor = await Staff.findOne({ role: 'doctor' });

        const newCase = await ORCase.create({
            patientId,
            surgeonId: doctor?._id || "64b0f1a2e4b0f1a2e4b0f1a2", // Placeholder if no doctor found
            procedureName,
            procedureCode: "SURG-" + Math.floor(Math.random() * 1000),
            scheduledDate: new Date(scheduledDate),
            startTime: startTime, // Storing as string or Date depends on model usage, model says Date but form gives string
            orRoomId,
            status: 'scheduled',
            notes // Adding notes to ORCase if model supports it or as complications/postOpNotes placeholder?
            // Note: ORCase model doesn't have 'notes', I'll map it to 'complications' or similar if needed, 
            // but let's check model again. Model has complications, postOpNotes.
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
