"use client";

import GenericModulePage from "@/components/ModulePage";
import { Activity } from "lucide-react";

export default function billingpreauthPage() {
    return (
        <GenericModulePage 
            title="PRE AUTH"
            subtitle=" PORTAL"
            description="Access your pre-auth management system. Real-time tracking and automated reporting active."
            icon={Activity}
        />
    );
}
