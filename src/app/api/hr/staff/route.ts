import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/lib/models/User';

export async function GET() {
    await dbConnect();

    const staff = await User.find({})
        .limit(50)
        .sort({ createdAt: -1 });

    const data = staff.map(u => ({
        id: `EMP-${u._id.toString().slice(-4).toUpperCase()}`,
        name: `${u.firstName} ${u.lastName}`,
        status: u.isActive ? 'Active' : 'On Leave',
        date: new Date(u.createdAt).toLocaleDateString(),
        value: u.role.split('_').map((s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()).join(' ') // Role as value
    }));

    return NextResponse.json({
        data,
        stats: [
            { label: "Total Staff", value: staff.length.toString(), change: "+2", icon: "Users", color: "text-olive-600", bg: "bg-olive-50" },
            { label: "On Shift", value: Math.floor(staff.length * 0.6).toString(), change: "+12%", icon: "Activity", color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Leaf Requests", value: "4", change: "-1", icon: "FileText", color: "text-orange-600", bg: "bg-orange-50" },
            { label: "Compliance Pending", value: "1", change: "-5%", icon: "ShieldCheck", color: "text-red-500", bg: "bg-red-50" },
        ]
    });
}
