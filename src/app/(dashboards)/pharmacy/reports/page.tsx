"use client";

import GenericModulePage from "@/components/ModulePage";
import { Activity } from "lucide-react";

export default function pharmacistreportsPage() {
    return (
        <GenericModulePage 
            title="REPORTS"
            subtitle=" PORTAL"
            description="Access your reports management system. Real-time tracking and automated reporting active."
            icon={Activity}
        />
    );
}
