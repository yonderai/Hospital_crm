import { NextResponse } from 'next/server';

export async function GET() {
    // Mocking a delay
    await new Promise(resolve => setTimeout(resolve, 600));

    return NextResponse.json({
        schedule: [
            { time: "09:00", period: "AM", patientName: "Alice Cooper", type: "consultation", duration: "30m", reason: "Diabetes Follow-up", status: "confirmed" },
            { time: "09:30", period: "AM", patientName: "Bob Marley", type: "follow-up", duration: "45m", reason: "Chronic Pain Mgmt", status: "waiting" },
            { time: "11:00", period: "AM", patientName: "David Bowie", type: "consultation", duration: "30m", reason: "General Checkup", status: "confirmed" },
            { time: "02:00", period: "PM", patientName: "Elvis Presley", type: "consultation", duration: "20m", reason: "Vocal Cord Exam", status: "confirmed" },
            { time: "04:30", period: "PM", patientName: "Freddie Mercury", type: "follow-up", duration: "1h", reason: "Endurance Test", status: "confirmed" },
        ]
    });
}
