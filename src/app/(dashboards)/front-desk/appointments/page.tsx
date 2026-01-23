"use client";

import GenericModulePage from "@/components/ModulePage";
import { Activity } from "lucide-react";

export default function frontdeskappointmentsPage() {
    return (
        <GenericModulePage 
            title="APPOINTMENTS"
            subtitle=" PORTAL"
            description="Access your appointments management system. Real-time tracking and automated reporting active."
            icon={Activity}
        />
    );
}
