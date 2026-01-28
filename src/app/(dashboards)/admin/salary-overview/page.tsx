"use client";

import GenericModulePage from "@/components/ModulePage";
import { Activity } from "lucide-react";

export default function adminsalaryoverviewPage() {
    return (
        <GenericModulePage
            title="SALARY OVERVIEW"
            subtitle=" PORTAL"
            description="Access your salary-overview management system. Real-time tracking and automated reporting active."
            icon={Activity}
            dataEndpoint="/api/admin/salary-overview"
        />
    );
}
