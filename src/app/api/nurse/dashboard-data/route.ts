import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from '@/lib/db';
import Encounter from "@/lib/models/Encounter";
import Prescription from "@/lib/models/Prescription";
import Patient from "@/lib/models/Patient";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !["nurse", "admin", "doctor"].includes(session.user?.role as string)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        // 1. Patients Under Care (Open Encounters)
        const openEncounters = await Encounter.find({ status: "open" })
            .populate("patientId", "firstName lastName mrn")
            .sort({ updatedAt: -1 });

        const patientsUnderCareCount = new Set(openEncounters.map(e => e.patientId?._id?.toString())).size;

        // 2. Medications Due (Active Prescriptions)
        const activePrescriptions = await Prescription.find({ status: "active" })
            .populate("patientId", "firstName lastName mrn")
            .sort({ prescribedDate: -1 });

        let medicationsDueCount = 0;
        const medicationSchedule: any[] = [];

        activePrescriptions.forEach(p => {
            p.medications.forEach((m: any) => {
                medicationsDueCount++;
                medicationSchedule.push({
                    id: p._id,
                    patientName: `${(p.patientId as any)?.firstName} ${(p.patientId as any)?.lastName}`,
                    room: "Ward " + (Math.floor(Math.random() * 5) + 1) + "-" + String.fromCharCode(65 + Math.floor(Math.random() * 4)), // Random Room for simulation if not in model
                    medication: m.drugName,
                    dose: m.dosage,
                    time: "Next Due",
                    status: "pending"
                });
            });
        });

        // 3. Vitals Pending (Encounters with missing vitals)
        const vitalsPendingCount = openEncounters.filter(e =>
            !e.vitals.bloodPressure || !e.vitals.temperature || !e.vitals.heartRate
        ).length;

        // 4. Tasks Summary (Mocked for now as we don't have a task model yet)
        const stats = {
            patientsUnderCare: patientsUnderCareCount || 0,
            medicationsDue: medicationsDueCount || 0,
            vitalsPending: vitalsPendingCount || 0,
            tasksCompleted: "72%" // Placeholder for task completion percentage
        };

        return NextResponse.json({
            stats,
            medicationSchedule: medicationSchedule.slice(0, 5), // Limit to top 5 for dashboard
            vitalsFlow: openEncounters.slice(0, 3).map(e => ({
                label: "Vital Check",
                patient: `${(e.patientId as any)?.firstName} ${(e.patientId as any)?.lastName}`,
                status: e.vitals.bloodPressure ? "Updated" : "Due Now",
                color: e.vitals.bloodPressure ? "border-olive-500" : "border-red-500"
            }))
        });

    } catch (error) {
        console.error("Nurse Dashboard API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
