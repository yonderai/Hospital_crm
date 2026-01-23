"use client";
import ModulePage from "@/components/ModulePage";
import { ShieldCheck } from "lucide-react";

export default function HRCompliancePage() {
    return (
        <ModulePage
            title="Staff Compliance"
            subtitle="Regulatory Standards"
            description="Manage medical licenses, training certifications, and policy acknowledgements for hospital personnel."
            icon={ShieldCheck}
        />
    );
}
