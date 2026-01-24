"use client";

import GenericModulePage from "@/components/ModulePage";
import { Activity } from "lucide-react";

export default function labtechdigitalreportsPage() {
    return (
        <GenericModulePage 
            title="DIGITAL REPORTS"
            subtitle=" PORTAL"
            description="Access your digital-reports management system. Real-time tracking and automated reporting active."
            icon={Activity}
        />
    );
}
