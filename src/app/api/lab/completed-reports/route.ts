import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from '@/lib/db';
import LabOrder from "@/lib/models/LabOrder";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !["lab", "labtech", "doctor", "admin", "patient"].includes(session.user?.role as string)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        // If patient, only show their own reports
        let filter: any = { status: "completed" };
        if (session.user.role === "patient") {
            filter.patientId = session.user.id;
        }

        const reports = await LabOrder.find(filter)
            .populate("patientId", "firstName lastName mrn contact gender dob")
            .populate("orderingProviderId", "firstName lastName department")
            .populate("reviewedBy", "firstName lastName")
            .sort({ resultDate: -1 })
            .lean();

        return NextResponse.json(reports);

    } catch (error) {
        console.error("Error fetching completed lab reports:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
