import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import User from '@/lib/models/User';

export async function GET() {
    await dbConnect();

    // Generate payroll data based on existing users
    const staff = await User.find({}).limit(20);

    const data = staff.map(u => {
        // Mock salary based on role length/complexity for variance
        const baseSalary = 3000 + (u.role.length * 500);
        return {
            id: `PAY-${Date.now().toString().slice(-4)}-${u._id.toString().slice(-2)}`,
            name: `${u.firstName} ${u.lastName}`,
            status: 'Processed',
            date: new Date().toLocaleDateString(),
            value: `$${baseSalary.toLocaleString()}`
        };
    });

    const totalPayroll = data.reduce((acc, curr) => acc + parseInt(curr.value.replace(/[^0-9]/g, '')), 0);

    return NextResponse.json({
        data,
        stats: [
            { label: "Total Payroll", value: `$${(totalPayroll / 1000).toFixed(1)}k`, change: "+1.2%", icon: "DollarSign", color: "text-green-600", bg: "bg-green-50" },
            { label: "Processed", value: staff.length.toString(), change: "100%", icon: "CheckCircle", color: "text-olive-600", bg: "bg-olive-50" },
            { label: "Pending Disputes", value: "0", change: "0%", icon: "AlertTriangle", color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Tax Deductions", value: `$${(totalPayroll * 0.2 / 1000).toFixed(1)}k`, change: "+1.2%", icon: "FileText", color: "text-orange-600", bg: "bg-orange-50" },
        ]
    });
}
