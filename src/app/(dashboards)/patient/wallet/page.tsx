"use client";

import GenericModulePage from "@/components/ModulePage";
import { Activity } from "lucide-react";

export default function patientwalletPage() {
    return (
        <GenericModulePage 
            title="WALLET"
            subtitle=" PORTAL"
            description="Access your wallet management system. Real-time tracking and automated reporting active."
            icon={Activity}
        />
    );
}
