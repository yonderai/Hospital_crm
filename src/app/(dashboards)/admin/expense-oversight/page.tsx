"use client";

import GenericModulePage from "@/components/ModulePage";
import { Activity } from "lucide-react";

export default function adminexpenseoversightPage() {
    return (
        <GenericModulePage 
            title="EXPENSE OVERSIGHT"
            subtitle=" PORTAL"
            description="Access your expense-oversight management system. Real-time tracking and automated reporting active."
            icon={Activity}
        />
    );
}
