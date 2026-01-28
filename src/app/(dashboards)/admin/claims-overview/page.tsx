"use client";

import GenericModulePage from "@/components/ModulePage";
import { Activity } from "lucide-react";

export default function adminclaimsoverviewPage() {
    return (
        <GenericModulePage
            title="CLAIMS OVERVIEW"
            subtitle=" PORTAL"
            description="Access your claims-overview management system. Real-time tracking and automated reporting active."
            icon={Activity}
            dataEndpoint="/api/admin/claims-overview"
        />
    );
}
