import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import RadiologyReport from "@/lib/models/RadiologyReport";
import ImagingOrder from "@/lib/models/ImagingOrder";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const mongoose = require('mongoose');
    const dbSession = await mongoose.startSession();
    dbSession.startTransaction();

    try {
        await dbConnect();
        const data = await req.json();
        const report = await RadiologyReport.create([data], { session: dbSession });

        // Update the order status when a report is created
        if (data.orderId) {
            await ImagingOrder.findByIdAndUpdate(
                data.orderId,
                { status: "completed", completedAt: new Date() },
                { session: dbSession }
            );
        }

        await dbSession.commitTransaction();
        dbSession.endSession();

        return NextResponse.json(report[0], { status: 201 });
    } catch (error: any) {
        await dbSession.abortTransaction();
        dbSession.endSession();
        console.error("Radiology Report Creation Error:", error);
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
        const orderId = searchParams.get("orderId");
        const patientId = searchParams.get("patientId");

        let filter: any = {};
        if (orderId) filter.orderId = orderId;
        if (patientId) filter.patientId = patientId;

        const reports = await RadiologyReport.find(filter)
            .populate("patientId", "firstName lastName mrn")
            .populate("interpretedBy", "firstName lastName")
            .populate("orderId", "imagingType bodyPart")
            .sort({ createdAt: -1 });

        return NextResponse.json(reports);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
