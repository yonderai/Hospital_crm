"use client";

import GenericModulePage from "@/components/ModulePage";
import { Activity } from "lucide-react";

export default function hrcomplaintsPage() {
    return (
        <GenericModulePage 
            title="COMPLAINTS"
            subtitle=" PORTAL"
            description="Access your complaints management system. Real-time tracking and automated reporting active."
            icon={Activity}
        />
    );
}
