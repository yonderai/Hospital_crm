import { NextResponse } from 'next/server';

export async function GET() {
    // Mocking a delay
    await new Promise(resolve => setTimeout(resolve, 800));

    return NextResponse.json({
        queue: [
            { name: "Alice Cooper", time: "09:00 AM", status: "Checked-in", reason: "Diabetes Follow-up" },
            { name: "Bob Marley", time: "09:30 AM", status: "Waiting", reason: "Chronic Pain Mgmt" },
            { name: "Charlie Brown", time: "10:15 AM", status: "Checked-in", reason: "Post-Op Review" },
            { name: "David Bowie", time: "11:00 AM", status: "Waiting", reason: "General Checkup" },
            { name: "Elvis Presley", time: "11:30 AM", status: "Scheduled", reason: "Vocal Cord Exam" },
        ]
    });
}
