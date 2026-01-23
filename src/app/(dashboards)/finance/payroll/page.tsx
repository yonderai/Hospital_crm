"use client";

import GenericModulePage from "@/components/ModulePage";
import { Activity } from "lucide-react";

export default function financepayrollPage() {
    return (
        <GenericModulePage
            title="PAYROLL"
            subtitle=" PORTAL"
            description="Access your payroll management system. Real-time tracking and automated reporting active."
            icon={Activity}
            dataEndpoint="/api/hr/payroll"
        />
    );
}
