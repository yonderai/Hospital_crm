"use client";
import ModulePage from "@/components/ModulePage";
import { Beaker } from "lucide-react";

export default function LaboratoryPage() {
    return (
        <ModulePage
            title="Clinical Laboratory"
            subtitle="Diagnostics & Pathology"
            description="View real-time lab results, specimen tracking, and pathology reports."
            icon={Beaker}
        />
    );
}
