"use client";

import GenericModulePage from "@/components/ModulePage";
import { Activity } from "lucide-react";

export default function financeprocurementPage() {
    return (
        <GenericModulePage 
            title="PROCUREMENT"
            subtitle=" PORTAL"
            description="Access your procurement management system. Real-time tracking and automated reporting active."
            icon={Activity}
        />
    );
}
