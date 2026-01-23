"use client";

import GenericModulePage from "@/components/ModulePage";
import { Activity } from "lucide-react";

export default function adminstaffoverviewPage() {
    return (
        <GenericModulePage 
            title="STAFF OVERVIEW"
            subtitle=" PORTAL"
            description="Access your staff-overview management system. Real-time tracking and automated reporting active."
            icon={Activity}
        />
    );
}
