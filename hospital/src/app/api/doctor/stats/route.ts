import { NextResponse } from 'next/server';

export async function GET() {
    // Mocking a delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return NextResponse.json({
        stats: [
            { title: "Today's Appointments", value: "12", icon: "Calendar", color: "text-olive-500", bg: "bg-olive-50" },
            { title: "Patients Under Care", value: "45", icon: "Users", color: "text-olive-600", bg: "bg-olive-50" },
            { title: "Pending Lab Results", value: "08", icon: "Beaker", color: "text-olive-400", bg: "bg-olive-50/50" },
            { title: "Critical Alerts", value: "02", icon: "AlertTriangle", color: "text-red-500", bg: "bg-red-50" },
        ]
    });
}
