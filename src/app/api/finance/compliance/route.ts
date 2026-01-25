import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import AuditLog from "@/lib/models/AuditLog";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
    try {
        await dbConnect();
        // Finance users see relevant logs. For now, fetch latest 100 system logs.
        const logs = await AuditLog.find()
            .populate("userId", "firstName lastName role")
            .sort({ timestamp: -1 })
            .limit(100);
        return NextResponse.json(logs);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch audit logs" }, { status: 500 });
    }
}
