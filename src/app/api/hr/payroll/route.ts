import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Payroll from '@/lib/models/Payroll';

export async function GET() {
    await dbConnect();

    try {
        // Fetch real payroll data
        // Fetch real payroll data without enforcing schema too strictly on retrieve
        // We use lean() to get plain JS objects and avoid some Mongoose casting errors if schema mismatches
        const payrolls = await Payroll.find({})
            .sort({ createdAt: -1 })
            .limit(50)
            .populate('staffId', 'firstName lastName')
            .lean();

        const data = payrolls.map((p: any) => {
            // Handle populated staffId or fallback
            // Note: populate wasn't called above to save bandwidth/complexity with mixed schemas, 
            // but if we need names from User/Staff ref, we should populate. 
            // For now, let's use the fallback logic which covers legacy data.

            let name = 'Unknown Staff';
            if (p.staffId && p.staffId.firstName) {
                name = `${p.staffId.firstName} ${p.staffId.lastName}`;
            } else if (p.employeeName) {
                name = p.employeeName;
            }

            const netPay = p.netPay || p.netSalary || 0;
            const status = p.status || 'pending';

            return {
                id: p.employeeId || (p._id ? p._id.toString().slice(-6).toUpperCase() : 'PAY-???'),
                name: name,
                status: status.charAt(0).toUpperCase() + status.slice(1),
                date: p.createdAt ? new Date(p.createdAt).toLocaleDateString() : new Date().toLocaleDateString(),
                value: `₹${netPay.toLocaleString()}`
            };
        });

        const totalPayroll = data.reduce((acc, curr) => acc + parseInt(curr.value.replace(/[^0-9]/g, '')), 0);
        const processedCount = data.filter(p => p.status.toLowerCase() === 'processed' || p.status.toLowerCase() === 'paid').length;
        const pendingCount = data.filter(p => p.status.toLowerCase() === 'pending').length;

        // Calculate stats
        const stats = [
            { label: "Total Payroll", value: `₹${(totalPayroll / 1000).toFixed(1)}k`, change: "+1.2%", icon: "IndianRupee", color: "text-green-600", bg: "bg-green-50" },
            { label: "Processed", value: processedCount.toString(), change: "Active", icon: "CheckCircle", color: "text-olive-600", bg: "bg-olive-50" },
            { label: "Pending", value: pendingCount.toString(), change: `${pendingCount > 0 ? '-' : ''}Action Req`, icon: "AlertCircle", color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Avg Salary", value: `₹${data.length ? (totalPayroll / data.length / 1000).toFixed(1) : 0}k`, change: "Stable", icon: "Activity", color: "text-orange-600", bg: "bg-orange-50" },
        ];

        return NextResponse.json({ data, stats });

    } catch (error) {
        console.error("Payroll API Error:", error);
        return NextResponse.json({ error: "Failed to fetch payroll data" }, { status: 500 });
    }
}
