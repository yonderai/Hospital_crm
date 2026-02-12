"use client";

import GenericModulePage from "@/components/ModulePage";
import { Activity } from "lucide-react";

export default function hrpayrolldataPage() {
    return (
        <GenericModulePage
            title="PAYROLL DATA"
            subtitle=" PORTAL"
            description="Access your payroll-data management system. Real-time tracking and automated reporting active."
            icon={Activity}
            dataEndpoint="/api/hr/payroll"
        />
    );
}
