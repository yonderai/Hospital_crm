"use client";

import GenericModulePage from "@/components/ModulePage";
import { Activity } from "lucide-react";

export default function labtechstatusPage() {
    return (
        <GenericModulePage 
            title="STATUS"
            subtitle=" PORTAL"
            description="Access your status management system. Real-time tracking and automated reporting active."
            icon={Activity}
        />
    );
}
