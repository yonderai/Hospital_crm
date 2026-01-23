import { NextResponse } from 'next/server';
import dbConnect from "@/lib/mongoose";
import AuditLog from "@/lib/models/AuditLog";
import { protectRoute } from "@/lib/api-guard";

export async function GET(req: Request) {
    const auth = await protectRoute(["admin"]);
    if (auth.error) {
        return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    try {
        await dbConnect();

        // Fetch latest logs
        const logs = await AuditLog.find({})
            .populate("userId", "firstName lastName role email")
            .sort({ timestamp: -1 })
            .limit(50)
            .lean();

        // If logs are empty, maybe return some mock logs for the demo so the Admin sees something?
        // Or just return empty array. Ideally, the system should be logging things.
        // Let's seed mock logs in memory if empty for UX?
        // Actually, let's rely on real logs, or if none, the UI will handle empty state.

        return NextResponse.json({ logs });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
