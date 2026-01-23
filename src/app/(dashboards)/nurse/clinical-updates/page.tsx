"use client";

import GenericModulePage from "@/components/ModulePage";
import { Activity } from "lucide-react";

export default function nurseclinicalupdatesPage() {
    return (
        <GenericModulePage
            title="CLINICAL UPDATES"
            subtitle=" PORTAL"
            description="Access your clinical-updates management system. Real-time tracking and automated reporting active."
            icon={Activity}
            dataEndpoint="/api/nurse/clinical-updates"
        />
    );
}
