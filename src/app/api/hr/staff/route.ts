import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/lib/models/User';

export async function GET() {
    await dbConnect();

    // For the list: only HR department
    const hrStaff = await User.find({ department: 'HR' })
        .limit(50)
        .sort({ createdAt: -1 });

    // For the stats: Global counts
    const totalStaffCount = await User.countDocuments({
        role: { $in: ['doctor', 'nurse', 'frontdesk', 'labtech', 'pharmacist', 'billing', 'hr', 'finance', 'emergency', 'maintenance', 'backoffice', 'admin'] }
    });
    const doctorCount = await User.countDocuments({ role: 'doctor' });
    const nurseCount = await User.countDocuments({ role: 'nurse' });

    const data = hrStaff.map(u => ({
        id: `EMP-${u._id.toString().slice(-4).toUpperCase()}`,
        name: `${u.firstName} ${u.lastName}`,
        status: u.isActive ? 'Active' : 'On Leave',
        date: new Date(u.createdAt).toLocaleDateString(),
        value: u.role.split('_').map((s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()).join(' ')
    }));

    return NextResponse.json({
        data,
        stats: [
            { label: "Total Staff", value: totalStaffCount.toString(), change: "+2", icon: "Users", color: "text-olive-600", bg: "bg-olive-50" },
            { label: "Doctors", value: doctorCount.toString(), change: "+1", icon: "Stethoscope", color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Nurses", value: nurseCount.toString(), change: "+3", icon: "Activity", color: "text-red-500", bg: "bg-red-50" },
            { label: "Other", value: (totalStaffCount - doctorCount - nurseCount).toString(), change: "0", icon: "Briefcase", color: "text-orange-600", bg: "bg-orange-50" },
        ]
    });
}
