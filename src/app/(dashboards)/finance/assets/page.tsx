"use client";

import GenericModulePage from "@/components/ModulePage";
import { Activity } from "lucide-react";

export default function financeassetsPage() {
    return (
        <GenericModulePage 
            title="ASSETS"
            subtitle=" PORTAL"
            description="Access your assets management system. Real-time tracking and automated reporting active."
            icon={Activity}
        />
    );
}
