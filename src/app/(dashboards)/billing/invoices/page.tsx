"use client";

import GenericModulePage from "@/components/ModulePage";
import { Activity } from "lucide-react";

export default function billinginvoicesPage() {
    return (
        <GenericModulePage 
            title="INVOICES"
            subtitle=" PORTAL"
            description="Access your invoices management system. Real-time tracking and automated reporting active."
            icon={Activity}
        />
    );
}
