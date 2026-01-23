import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import LabResult from "@/lib/models/LabResult";
import LabOrder from "@/lib/models/LabOrder";
import { protectRoute } from "@/lib/api-guard";

export async function POST(req: NextRequest) {
    const auth = await protectRoute(["lab-tech", "admin", "doctor"]); // Doctors might upload sometimes? Let's say lab-tech mostly.
    if (auth.error) {
        return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const mongoose = require('mongoose');
    const dbSession = await mongoose.startSession();
    dbSession.startTransaction();

    try {
        await dbConnect();
        const data = await req.json();
        const result = await LabResult.create([data], { session: dbSession });

        // Update the order status when a result is posted
        if (data.orderId) {
            await LabOrder.findByIdAndUpdate(
                data.orderId,
                { status: "completed", resultDate: new Date() },
                { session: dbSession }
            );
        }

        await dbSession.commitTransaction();
        dbSession.endSession();

        return NextResponse.json(result[0], { status: 201 });
    } catch (error: any) {
        await dbSession.abortTransaction();
        dbSession.endSession();
        console.error("Lab Result Creation Error:", error);
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}

export async function GET(req: NextRequest) {
    const auth = await protectRoute(["lab-tech", "doctor", "nurse", "admin"]);
    if (auth.error) {
        return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const orderId = searchParams.get("orderId");
        const patientId = searchParams.get("patientId");

        let filter: any = {};
        if (orderId) filter.orderId = orderId;
        if (patientId) filter.patientId = patientId;

        const results = await LabResult.find(filter)
            .populate("patientId", "firstName lastName mrn")
            .populate("performedBy", "firstName lastName")
            .sort({ createdAt: -1 });

        return NextResponse.json(results);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
