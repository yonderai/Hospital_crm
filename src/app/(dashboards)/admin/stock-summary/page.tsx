"use client";

import GenericModulePage from "@/components/ModulePage";
import { Activity } from "lucide-react";

export default function adminstocksummaryPage() {
    return (
        <GenericModulePage
            title="STOCK SUMMARY"
            subtitle=" PORTAL"
            description="Access your stock-summary management system. Real-time tracking and automated reporting active."
            icon={Activity}
            dataEndpoint="/api/admin/stock-summary"
        />
    );
}
