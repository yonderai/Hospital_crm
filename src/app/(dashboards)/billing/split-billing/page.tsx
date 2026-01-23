"use client";

import GenericModulePage from "@/components/ModulePage";
import { Activity } from "lucide-react";

export default function billingsplitbillingPage() {
    return (
        <GenericModulePage 
            title="SPLIT BILLING"
            subtitle=" PORTAL"
            description="Access your split-billing management system. Real-time tracking and automated reporting active."
            icon={Activity}
        />
    );
}
