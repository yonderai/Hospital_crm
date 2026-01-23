"use client";
import ModulePage from "@/components/ModulePage";
import { FlaskConical } from "lucide-react";

export default function LabTechResearchPage() {
    return (
        <ModulePage
            title="Clinical Research"
            subtitle="R&D Initiatives"
            description="Participate in ongoing clinical trials, data aggregation for medical journals, and experimental pathology."
            icon={FlaskConical}
        />
    );
}
