"use client";

import GenericModulePage from "@/components/ModulePage";
import { Activity } from "lucide-react";

export default function pharmacistdispensingPage() {
    return (
        <GenericModulePage 
            title="DISPENSING"
            subtitle=" PORTAL"
            description="Access your dispensing management system. Real-time tracking and automated reporting active."
            icon={Activity}
        />
    );
}
