"use client";

import GenericModulePage from "@/components/ModulePage";
import { Activity } from "lucide-react";

export default function hrattendancePage() {
    return (
        <GenericModulePage
            title="ATTENDANCE"
            subtitle=" PORTAL"
            description="Access your attendance management system. Real-time tracking and automated reporting active."
            icon={Activity}
            dataEndpoint="/api/hr/attendance"
        />
    );
}
