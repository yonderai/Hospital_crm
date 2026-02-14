import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/lib/models/User';

export async function GET() {
    await dbConnect();

    const staff = await User.find({
        role: { $in: ['doctor', 'nurse', 'frontdesk', 'labtech', 'pharmacist', 'billing', 'hr', 'finance', 'emergency', 'maintenance', 'backoffice', 'admin'] }
    })
        .sort({ lastName: 1 });

    const data = staff.map(u => {
        // Mock attendance logic - in a real app this would query an Attendance model
        const rand = Math.random();
        const isPresent = rand > 0.15;
        const isLate = isPresent && rand > 0.8;
        const isOnLeave = !isPresent && rand < 0.05;

        let status = 'Absent';
        if (isPresent) status = 'Present';
        if (isOnLeave) status = 'On Leave';

        const checkInTime = isPresent ? `${8 + Math.floor(Math.random() * 2)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')} AM` : '-';

        return {
            id: `EMP-${u._id.toString().slice(-4).toUpperCase()}`,
            name: `${u.firstName} ${u.lastName}`,
            status,
            date: new Date().toLocaleDateString(),
            value: checkInTime,
            isLate // hidden field for stat calculation
        };
    });

    const presentCount = data.filter(d => d.status === 'Present').length;
    const absentCount = data.filter(d => d.status === 'Absent').length;
    const leaveCount = data.filter(d => d.status === 'On Leave').length;
    const lateCount = data.filter(d => d.isLate).length;

    return NextResponse.json({
        data,
        stats: [
            { label: "Present Today", value: presentCount.toString(), change: `${Math.round((presentCount / data.length) * 100)}%`, icon: "Users", color: "text-green-600", bg: "bg-green-50" },
            { label: "Absent", value: absentCount.toString(), change: `${Math.round((absentCount / data.length) * 100)}%`, icon: "UserMinus", color: "text-red-600", bg: "bg-red-50" },
            { label: "Late Arrivals", value: lateCount.toString(), change: `+${Math.floor(Math.random() * 3)}`, icon: "Clock", color: "text-orange-600", bg: "bg-orange-50" },
            { label: "On Leave", value: leaveCount.toString(), change: "0%", icon: "Calendar", color: "text-blue-600", bg: "bg-blue-50" },
        ]
    });
}
