"use client";

import GenericModulePage from "@/components/ModulePage";
import { Activity } from "lucide-react";

export default function nursewardmanagementPage() {
    return (
        <GenericModulePage
            title="WARD MANAGEMENT"
            subtitle=" PORTAL"
            description="Access your ward-management management system. Real-time tracking and automated reporting active."
            icon={Activity}
            dataEndpoint="/api/nurse/ward-management"
        />
    );
}
