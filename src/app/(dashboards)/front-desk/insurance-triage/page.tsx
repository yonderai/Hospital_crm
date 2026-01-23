"use client";

import GenericModulePage from "@/components/ModulePage";
import { Activity } from "lucide-react";

export default function frontdeskinsurancetriagePage() {
    return (
        <GenericModulePage 
            title="INSURANCE TRIAGE"
            subtitle=" PORTAL"
            description="Access your insurance-triage management system. Real-time tracking and automated reporting active."
            icon={Activity}
        />
    );
}
