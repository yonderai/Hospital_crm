import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import User from '@/lib/models/User';

export async function GET() {
    await dbConnect();

    const staff = await User.find({})
        .limit(30)
        .sort({ lastName: 1 });

    const data = staff.map(u => {
        // Mock attendance logic
        const isPresent = Math.random() > 0.1;
        const checkInTime = isPresent ? `${8 + Math.floor(Math.random() * 2)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')} AM` : '-';

        return {
            id: u.employeeId || u._id.toString().slice(-6).toUpperCase(), // Assuming employeeId might exist or fallback
            name: `${u.firstName} ${u.lastName}`,
            status: isPresent ? 'Present' : 'Absent',
            date: new Date().toLocaleDateString(),
            value: checkInTime
        };
    });

    const presentCount = data.filter(d => d.status === 'Present').length;

    return NextResponse.json({
        data,
        stats: [
            { label: "Present Today", value: presentCount.toString(), change: "90%", icon: "Users", color: "text-green-600", bg: "bg-green-50" },
            { label: "Absent", value: (data.length - presentCount).toString(), change: "10%", icon: "UserMinus", color: "text-red-600", bg: "bg-red-50" },
            { label: "Late Arrivals", value: "3", change: "+1", icon: "Clock", color: "text-orange-600", bg: "bg-orange-50" },
            { label: "On Leave", value: "2", change: "0%", icon: "Calendar", color: "text-blue-600", bg: "bg-blue-50" },
        ]
    });
}
