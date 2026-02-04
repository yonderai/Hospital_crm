import { NextResponse } from "next/server";
import dbConnect from '@/lib/db';
import Payroll from "@/lib/models/Payroll";
import Staff from "@/lib/models/Staff"; // Needed for populate
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
    try {
        await dbConnect();
        const payrolls = await Payroll.find()
            .populate("staffId", "firstName lastName role department")
            .sort({ year: -1, month: -1 })
            .limit(200);
        return NextResponse.json(payrolls);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch payroll records" }, { status: 500 });
    }
}
