"use client";

import GenericModulePage from "@/components/ModulePage";
import { Activity } from "lucide-react";

export default function billingdigitalpaymentsPage() {
    return (
        <GenericModulePage 
            title="DIGITAL PAYMENTS"
            subtitle=" PORTAL"
            description="Access your digital-payments management system. Real-time tracking and automated reporting active."
            icon={Activity}
        />
    );
}
