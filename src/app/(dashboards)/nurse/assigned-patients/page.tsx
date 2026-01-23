"use client";

import GenericModulePage from "@/components/ModulePage";
import { Activity } from "lucide-react";

export default function nurseassignedpatientsPage() {
    return (
        <GenericModulePage 
            title="ASSIGNED PATIENTS"
            subtitle=" PORTAL"
            description="Access your assigned-patients management system. Real-time tracking and automated reporting active."
            icon={Activity}
        />
    );
}
