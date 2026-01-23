"use client";

import GenericModulePage from "@/components/ModulePage";
import { Activity } from "lucide-react";

export default function nurseicumonitorPage() {
    return (
        <GenericModulePage 
            title="ICU MONITOR"
            subtitle=" PORTAL"
            description="Access your icu-monitor management system. Real-time tracking and automated reporting active."
            icon={Activity}
        />
    );
}
