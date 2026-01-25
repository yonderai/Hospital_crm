import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import MaintenanceLog from "@/lib/models/MaintenanceLog";
import MedicalAsset from "@/lib/models/MedicalAsset"; // Needed for populate
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
    try {
        await dbConnect();
        const logs = await MaintenanceLog.find()
            .populate("assetId", "name assetTag category")
            .sort({ nextScheduledDate: 1 })
            .limit(100);
        return NextResponse.json(logs);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch maintenance logs" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const body = await req.json();
        await dbConnect();

        const log = await MaintenanceLog.create(body);

        // Update asset dates if needed (e.g. lastMaintenanceDate)
        if (log.assetId && log.performedAt) {
            await MedicalAsset.findByIdAndUpdate(log.assetId, {
                lastMaintenanceDate: log.performedAt,
                nextMaintenanceDate: log.nextScheduledDate,
                status: log.status === 'completed' ? 'operational' : 'under-repair'
            });
        }

        return NextResponse.json(log, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to create maintenance log" }, { status: 500 });
    }
}
