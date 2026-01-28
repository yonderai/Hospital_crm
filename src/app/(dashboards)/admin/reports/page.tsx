"use client";

import GenericModulePage from "@/components/ModulePage";
import { ClipboardList } from "lucide-react";

export default function AdminReportsPage() {
    return (
        <GenericModulePage
            title="SYSTEM REPORTS"
            subtitle="ADMIN PORTAL"
            description="View and export daily, weekly, and monthly system reports."
            icon={ClipboardList}
        />
    );
}
