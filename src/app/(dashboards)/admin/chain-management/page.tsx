"use client";

import GenericModulePage from "@/components/ModulePage";
import { Activity } from "lucide-react";

export default function adminchainmanagementPage() {
    return (
        <GenericModulePage
            title="CHAIN MANAGEMENT"
            subtitle=" PORTAL"
            description="Access your hospital chain management system. Real-time ward and facility tracking."
            icon={Activity}
            dataEndpoint="/api/admin/chain-management"
        />
    );
}
