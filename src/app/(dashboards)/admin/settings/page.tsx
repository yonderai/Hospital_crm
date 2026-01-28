"use client";

import GenericModulePage from "@/components/ModulePage";
import { Settings } from "lucide-react";

export default function AdminSettingsPage() {
    return (
        <GenericModulePage
            title="SYSTEM SETTINGS"
            subtitle="ADMIN PORTAL"
            description="Configure hospital branding, security rules, and access policies."
            icon={Settings}
        />
    );
}
