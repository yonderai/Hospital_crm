"use client";

import DashboardLayout from "@/components/DashboardLayout";
import EncounterEditor from "@/components/clinical/EncounterEditor";

export default function ClinicalEncounterPage() {
    return (
        <DashboardLayout>
            <EncounterEditor />
        </DashboardLayout>
    );
}
