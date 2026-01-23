"use client";

import GenericModulePage from "@/components/ModulePage";
import { Activity } from "lucide-react";

export default function nurserosterPage() {
    return (
        <GenericModulePage 
            title="ROSTER"
            subtitle=" PORTAL"
            description="Access your roster management system. Real-time tracking and automated reporting active."
            icon={Activity}
        />
    );
}
