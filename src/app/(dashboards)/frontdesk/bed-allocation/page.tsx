"use client";

import GenericModulePage from "@/components/ModulePage";
import { Activity } from "lucide-react";

export default function frontdeskbedallocationPage() {
    return (
        <GenericModulePage 
            title="BED ALLOCATION"
            subtitle=" PORTAL"
            description="Access your bed-allocation management system. Real-time tracking and automated reporting active."
            icon={Activity}
        />
    );
}
