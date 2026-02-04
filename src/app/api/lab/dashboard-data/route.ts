import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from '@/lib/db';
import LabOrder from "@/lib/models/LabOrder";
import LabResult from "@/lib/models/LabResult";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !["lab", "labtech"].includes(session.user?.role as string)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        // 1. Fetch Orders for Stats and Queue
        const allOrders = await LabOrder.find({
            status: { $nin: ["cancelled"] }
        })
            .populate("patientId", "firstName lastName mrn")
            .sort({ createdAt: -1 })
            .lean();

        // 2. Fetch Preliminary Results for Verification Count
        const preliminaryResults = await LabResult.countDocuments({ status: "preliminary" });

        // 3. Fetch Critical Findings Count
        const criticalFindings = await LabResult.countDocuments({ abnormalFlag: true });

        // 4. Calculate Stats
        const stats = {
            pending: allOrders.filter(o => ["ordered", "scheduled", "collected"].includes(o.status)).length,
            inProcessing: allOrders.filter(o => o.status === "in-progress").length,
            resultsVerification: preliminaryResults,
            criticalFindings: criticalFindings
        };

        // 5. Prepare Queue (Only pending or in-progress)
        const queue = allOrders.filter(o => ["ordered", "scheduled", "collected", "in-progress"].includes(o.status))
            .map(o => ({
                id: o._id,
                patient: `${o.patientId?.firstName} ${o.patientId?.lastName}`,
                test: o.tests.join(", "),
                priority: o.priority.charAt(0).toUpperCase() + o.priority.slice(1),
                status: o.status === "in-progress" ? "Processing" :
                    o.status === "collected" ? "Collected" : "Awaiting",
                arrival: new Date(o.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }));

        return NextResponse.json({ stats, queue });

    } catch (error) {
        console.error("Error fetching lab dashboard data:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
