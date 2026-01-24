import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import LabOrder from "@/lib/models/LabOrder";
import Sample from "@/lib/models/Sample";
import PathologyReport from "@/lib/models/PathologyReport";

export async function GET() {
    try {
        await dbConnect();

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const [
            pendingTests,
            samplesCollectedToday,
            testsProcessing,
            reportsCompleted
        ] = await Promise.all([
            LabOrder.countDocuments({ status: "ordered" }),
            Sample.countDocuments({
                collectedAt: { $gte: today },
                status: "COLLECTED"
            }),
            Sample.countDocuments({ status: "PROCESSING" }),
            PathologyReport.countDocuments({ status: "final" })
        ]);

        return NextResponse.json({
            pendingTests,
            samplesCollectedToday,
            testsProcessing,
            reportsCompleted
        });
    } catch (error) {
        console.error("Error fetching pathology stats:", error);
        return NextResponse.json(
            { error: "Failed to fetch statistics" },
            { status: 500 }
        );
    }
}
