"use client";
import ModulePage from "@/components/ModulePage";
import { Package } from "lucide-react";

export default function PatientPharmacyPage() {
    return (
        <ModulePage
            title="My Prescriptions"
            subtitle="Medication Portal"
            description="Track your active prescriptions, view dosage instructions, and request refills from the hospital pharmacy."
            icon={Package}
        />
    );
}
