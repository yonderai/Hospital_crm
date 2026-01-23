"use client";

import GenericModulePage from "@/components/ModulePage";
import { Activity } from "lucide-react";

export default function labtechsampletrackingPage() {
    return (
        <GenericModulePage 
            title="SAMPLE TRACKING"
            subtitle=" PORTAL"
            description="Access your sample-tracking management system. Real-time tracking and automated reporting active."
            icon={Activity}
        />
    );
}
