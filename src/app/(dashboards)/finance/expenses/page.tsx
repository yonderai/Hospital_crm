"use client";

import GenericModulePage from "@/components/ModulePage";
import { Activity } from "lucide-react";

export default function financeexpensesPage() {
    return (
        <GenericModulePage
            title="EXPENSES"
            subtitle=" PORTAL"
            description="Access your expenses management system. Real-time tracking and automated reporting active."
            icon={Activity}
            dataEndpoint="/api/finance/expenses"
        />
    );
}
