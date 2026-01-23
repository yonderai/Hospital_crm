"use client";

import GenericModulePage from "@/components/ModulePage";
import { Activity } from "lucide-react";

export default function adminchainmanagementPage() {
    return (
        <GenericModulePage 
            title="CHAIN MANAGEMENT"
            subtitle=" PORTAL"
            description="Access your chain-management management system. Real-time tracking and automated reporting active."
            icon={Activity}
        />
    );
}
