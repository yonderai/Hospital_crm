import { NextResponse } from 'next/server';

export async function GET() {
    // Mocking a delay
    await new Promise(resolve => setTimeout(resolve, 800));

    return NextResponse.json({
        patients: [
            { firstName: "Alice", lastName: "Cooper", mrn: "88429", status: "Stable", condition: "Type 2 Diabetes", lastVisit: "Jan 15, 2026", severity: "Low" },
            { firstName: "Jim", lastName: "Morrison", mrn: "99102", status: "Admitted", condition: "Pulmonary Edema", lastVisit: "Jan 22, 2026", severity: "High" },
            { firstName: "Janis", lastName: "Joplin", mrn: "22031", status: "Stable", condition: "Hypertension", lastVisit: "Jan 10, 2026", severity: "Low" },
            { firstName: "Kurt", lastName: "Cobain", mrn: "44501", status: "Out-Patient", condition: "Chronic Pain", lastVisit: "Jan 20, 2026", severity: "Medium" },
            { firstName: "Freddie", lastName: "Mercury", mrn: "11293", status: "Admitted", condition: "Arrhythmia", lastVisit: "Jan 22, 2026", severity: "High" },
            { firstName: "David", lastName: "Bowie", mrn: "55678", status: "Stable", condition: "Thyroid Mass", lastVisit: "Jan 18, 2026", severity: "Medium" },
            { firstName: "Elvis", lastName: "Presley", mrn: "77321", status: "Out-Patient", condition: "Sleep Apnea", lastVisit: "Jan 12, 2026", severity: "Low" },
        ]
    });
}
