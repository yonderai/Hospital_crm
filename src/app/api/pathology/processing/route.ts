import { NextResponse } from "next/server";
import dbConnect from '@/lib/db';
import Sample from "@/lib/models/Sample";

export async function GET() {
    try {
        await dbConnect();

        // Fetch samples currently in processing
        const samples = await Sample.find({ status: "PROCESSING" })
            .populate("patientId", "firstName lastName")
            .populate("orderId", "orderId tests")
            .sort({ processedAt: -1 });

        return NextResponse.json(samples);
    } catch (error) {
        console.error("Error fetching processing samples:", error);
        return NextResponse.json(
            { error: "Failed to fetch processing samples" },
            { status: 500 }
        );
    }
}

export async function PUT(req: Request) {
    try {
        await dbConnect();
        const body = await req.json();
        const { sampleId, stage, notes } = body; // stage could be "Slide Preparation", "Staining", etc.

        // Assuming we store stage info in notes or a separate field if we had one.
        // The prompt says "Update processing stage" and "Add remarks".
        // Sample model has 'notes'. I'll append to notes for now.

        const sample = await Sample.findById(sampleId);
        if (!sample) return NextResponse.json({ error: "Sample not found" }, { status: 404 });

        const newNote = `[${new Date().toLocaleString()}] Stage: ${stage}. Notes: ${notes || ''}`;

        sample.notes = sample.notes ? sample.notes + '\n' + newNote : newNote;
        await sample.save();

        return NextResponse.json(sample);
    } catch (error) {
        console.error("Error updating processing status:", error);
        return NextResponse.json(
            { error: "Failed to update processing status" },
            { status: 500 }
        );
    }
}
