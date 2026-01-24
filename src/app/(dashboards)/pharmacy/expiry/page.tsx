"use client";

import GenericModulePage from "@/components/ModulePage";
import { Activity } from "lucide-react";

export default function pharmacistexpiryPage() {
    return (
        <GenericModulePage 
            title="EXPIRY"
            subtitle=" PORTAL"
            description="Access your expiry management system. Real-time tracking and automated reporting active."
            icon={Activity}
        />
    );
}
