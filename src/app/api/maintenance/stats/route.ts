import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import MaintenanceTicket from "@/lib/models/MaintenanceTicket";
import { SessionUser } from "@/lib/types";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const role = (session.user as unknown as SessionUser).role;
        // Optional: restrict stats to maintenance/backoffice/admin only
        if (role !== "maintenance" && role !== "backoffice" && role !== "admin") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        await dbConnect();

        // Aggregate counts by status
        // We can do individual queries or an aggregation. Aggregation is cleaner.
        // But for simplicity/speed with strict strings (Approved/Pending Approval/Rejected), specific queries are fine too.
        // Let's use countDocuments for clarity.

        // Note: The requirement asked for "Approved", "Pending", "Denied".
        // The model has "Pending Approval" and "Rejected". I should map them.

        const approvedCount = await MaintenanceTicket.countDocuments({ status: "Approved" });
        const pendingCount = await MaintenanceTicket.countDocuments({ status: "Pending Approval" });
        const deniedCount = await MaintenanceTicket.countDocuments({ status: "Rejected" }); // Mapping "Denied" to "Rejected"
        const totalCount = await MaintenanceTicket.countDocuments({});

        return NextResponse.json({
            approved: approvedCount,
            pending: pendingCount,
            denied: deniedCount, // Sending as "denied" to match frontend expectation or just map it there
            total: totalCount
        });

    } catch (error) {
        console.error("Error fetching stats:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
