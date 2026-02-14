import { NextResponse } from "next/server";
import dbConnect from '@/lib/db';
import Payroll from "@/lib/models/Payroll";
import Staff from "@/lib/models/Staff"; // Needed for populate
import { Activity, FileText, LayoutGrid, CheckCircle } from "lucide-react";

export async function GET(req: Request) {
    try {
        await dbConnect();

        // Fetch payrolls - limiting to distinct recent ones or just all for now (with limit)
        const payrolls = await Payroll.find()
            .populate("staffId", "firstName lastName role department employeeId")
            .sort({ year: -1, month: -1, createdAt: -1 })
            .limit(100);

        // Calculate Real-Time Stats
        const totalRecords = payrolls.length;

        // 1. Total Salary Paid
        const totalPaid = payrolls
            .filter(p => p.status === 'paid')
            .reduce((sum, p) => sum + p.netPay, 0);

        // 2. Pending Payments
        const totalPending = payrolls
            .filter(p => p.status === 'pending' || p.status === 'processed')
            .reduce((sum, p) => sum + p.netPay, 0);

        // 3. Active Staff (Unique Staff Count in this payroll batch)
        const uniqueStaff = new Set(payrolls.map(p => p.staffId?._id?.toString() || p.staffId?.toString())).size;

        // 4. Completion Rate
        const paidCount = payrolls.filter(p => p.status === 'paid').length;
        const completionRate = totalRecords > 0 ? ((paidCount / totalRecords) * 100).toFixed(1) : "0";

        // Backend Response with Format for GenericModulePage
        const statsResponse = [
            {
                label: "Total Salary Paid",
                value: `₹${totalPaid.toLocaleString()}`,
                change: "Verified",
                icon: "IndianRupee",
                color: "text-green-600",
                bg: "bg-green-50"
            },
            {
                label: "Pending Payments",
                value: `₹${totalPending.toLocaleString()}`,
                change: totalPending > 0 ? "Action Req" : "All Clear",
                icon: "AlertCircle",
                color: "text-orange-600",
                bg: "bg-orange-50"
            },
            {
                label: "Active Staff",
                value: uniqueStaff.toString().padStart(2, '0'),
                change: "On Payroll",
                icon: "Users",
                color: "text-blue-600",
                bg: "bg-blue-50"
            },
            {
                label: "Payment Completion",
                value: `${completionRate}%`,
                change: "Progress",
                icon: "CheckCircle",
                color: "text-olive-600",
                bg: "bg-olive-50"
            },
        ];

        // Map data for table
        const mappedData = payrolls.map(p => ({
            id: (p.staffId as any)?.employeeId || "EMP-???",
            name: `${(p.staffId as any)?.firstName || 'Unknown'} ${(p.staffId as any)?.lastName || ''}`,
            status: p.status.charAt(0).toUpperCase() + p.status.slice(1),
            date: `${new Date(p.year, p.month - 1).toLocaleString('default', { month: 'short' })} ${p.year}`,
            value: `₹${p.netPay.toLocaleString()}`
        }));

        return NextResponse.json({
            data: mappedData,
            stats: statsResponse
        });

    } catch (error) {
        console.error("Salary Overview API Error:", error);
        return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
    }
}
