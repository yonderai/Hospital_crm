"use client";

import GenericModulePage from "@/components/ModulePage";
import { Activity } from "lucide-react";

export default function billingclaimsPage() {
    return (
        <GenericModulePage 
            title="CLAIMS"
            subtitle=" PORTAL"
            description="Access your claims management system. Real-time tracking and automated reporting active."
            icon={Activity}
        />
    );
}
