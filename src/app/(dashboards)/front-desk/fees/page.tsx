"use client";

import GenericModulePage from "@/components/ModulePage";
import { Activity } from "lucide-react";

export default function frontdeskfeesPage() {
    return (
        <GenericModulePage 
            title="FEES"
            subtitle=" PORTAL"
            description="Access your fees management system. Real-time tracking and automated reporting active."
            icon={Activity}
        />
    );
}
