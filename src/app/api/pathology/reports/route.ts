import { NextResponse } from "next/server";
import dbConnect from '@/lib/db';
import PathologyReport from "@/lib/models/PathologyReport";
import LabOrder from "@/lib/models/LabOrder";
import Sample from "@/lib/models/Sample";
import { writeFile } from "fs/promises";
import path from "path";

// Helper to save file
async function saveFile(file: File): Promise<string> {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const filename = `report-${Date.now()}-${file.name.replace(/\s/g, "_")}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads", "reports");
    const filepath = path.join(uploadDir, filename);

    await writeFile(filepath, buffer);
    return `/uploads/reports/${filename}`;
}

export async function POST(req: Request) {
    try {
        await dbConnect();

        const formData = await req.formData();
        const file = formData.get("file") as File | null;
        const metadata = JSON.parse(formData.get("data") as string);

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        const { orderId, patientId, specimenSource, grossDescription, microscopicDescription, diagnosis, clinicalHistory, pathologistId } = metadata;

        const reportUrl = await saveFile(file);

        const report = await PathologyReport.create({
            orderId,
            patientId,
            specimenSource,
            grossDescription,
            microscopicDescription,
            diagnosis,
            clinicalHistory,
            pathologistId,
            reportUrl,
            status: "final",
            signedAt: new Date()
        });

        // Update Lab Order status
        await LabOrder.findByIdAndUpdate(orderId, { status: "completed", resultDate: new Date() });

        // Update Sample status
        // Assuming we look up sample by orderId or pass sampleId. 
        // Logic: if report is done, sample processing is completed.
        await Sample.updateMany({ orderId }, { $set: { status: "COMPLETED", completedAt: new Date() } });

        return NextResponse.json(report);
    } catch (error) {
        console.error("Error uploading report:", error);
        return NextResponse.json(
            { error: "Failed to upload report" },
            { status: 500 }
        );
    }
}

export async function GET(req: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const patientId = searchParams.get("patientId");

        const query = patientId ? { patientId } : {};

        const reports = await PathologyReport.find(query)
            .populate("patientId", "firstName lastName")
            .populate("orderId", "orderId tests")
            .populate("pathologistId", "firstName lastName")
            .sort({ createdAt: -1 });

        return NextResponse.json(reports);
    } catch (error) {
        console.error("Error fetching reports:", error);
        return NextResponse.json(
            { error: "Failed to fetch reports" },
            { status: 500 }
        );
    }
}
