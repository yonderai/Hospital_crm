import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Payroll from "@/lib/models/Payroll";
import Staff from "@/lib/models/Staff";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        await dbConnect();
        const data = await req.json();

        // Basic validation: ensure staff exists and netPay is calculated
        const staff = await Staff.findById(data.staffId);
        if (!staff) {
            return NextResponse.json({ error: "Staff member not found" }, { status: 404 });
        }

        // Calculate netPay if not provided
        if (!data.netPay) {
            data.netPay = (data.baseSalary || staff.baseSalary) +
                (data.allowances || 0) -
                (data.deductions || 0);
        }

        const payroll = await Payroll.create(data);
        return NextResponse.json(payroll, { status: 201 });
    } catch (error: any) {
        console.error("Payroll Creation Error:", error);
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
        const staffId = searchParams.get("staffId");
        const month = searchParams.get("month");
        const year = searchParams.get("year");

        let filter: any = {};
        if (staffId) filter.staffId = staffId;
        if (month) filter.month = parseInt(month);
        if (year) filter.year = parseInt(year);

        const payrolls = await Payroll.find(filter)
            .populate("staffId", "firstName lastName employeeId department")
            .sort({ year: -1, month: -1 });

        return NextResponse.json(payrolls);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
