"use client";
import ModulePage from "@/components/ModulePage";
import { Calendar } from "lucide-react";

export default function PatientSchedulePage() {
    return (
        <ModulePage
            title="My Appointments"
            subtitle="Personal Healthcare Schedule"
            description="View your upcoming doctor visits, lab tests, and follow-up appointments. Book or reschedule online."
            icon={Calendar}
        />
    );
}
