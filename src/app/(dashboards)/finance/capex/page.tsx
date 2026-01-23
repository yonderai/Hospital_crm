"use client";

import GenericModulePage from "@/components/ModulePage";
import { Activity } from "lucide-react";

export default function financecapexPage() {
    return (
        <GenericModulePage 
            title="CAPEX"
            subtitle=" PORTAL"
            description="Access your capex management system. Real-time tracking and automated reporting active."
            icon={Activity}
        />
    );
}
