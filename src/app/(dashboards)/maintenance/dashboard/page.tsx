"use client";

import GenericModulePage from "@/components/ModulePage";
import { Wrench } from "lucide-react";

export default function MaintenanceDashboardPage() {
    return (
        <GenericModulePage
            title="MAINTENANCE DASHBOARD"
            subtitle="STAFF PORTAL"
            description="Overview of your maintenance tasks and pending tickets."
            icon={Wrench}
        // dataEndpoint="/api/maintenance/overview" // To be implemented if specialized stats needed
        />
    );
}
