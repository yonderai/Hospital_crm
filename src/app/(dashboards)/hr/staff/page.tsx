"use client";

import GenericModulePage from "@/components/ModulePage";
import { Activity } from "lucide-react";

export default function hrstaffPage() {
    return (
        <GenericModulePage
            title="STAFF"
            subtitle=" PORTAL"
            description="Access your staff management system. Real-time tracking and automated reporting active."
            icon={Activity}
            dataEndpoint="/api/hr/staff"
        />
    );
}
