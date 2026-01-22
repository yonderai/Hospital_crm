"use client";
import ModulePage from "@/components/ModulePage";
import { Aperture } from "lucide-react";

export default function RadiologyPage() {
    return (
        <ModulePage
            title="Radiology & Imaging"
            subtitle="Diagnostic Services"
            description="Access patient scans, X-rays, MRIs, and CT reports. Integrated PACS viewer coming soon."
            icon={Aperture}
        />
    );
}
