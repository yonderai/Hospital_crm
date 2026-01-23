"use client";

import GenericModulePage from "@/components/ModulePage";
import { Activity } from "lucide-react";

export default function labtechtestschedulingPage() {
    return (
        <GenericModulePage 
            title="TEST SCHEDULING"
            subtitle=" PORTAL"
            description="Access your test-scheduling management system. Real-time tracking and automated reporting active."
            icon={Activity}
        />
    );
}
