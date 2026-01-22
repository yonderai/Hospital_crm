"use client";
import ModulePage from "@/components/ModulePage";
import { Package } from "lucide-react";

export default function InventoryPharmacyPage() {
    return (
        <ModulePage
            title="Pharmacy Supply Chain"
            subtitle="Medication Logistics"
            description="Bulk stock management, cold chain logistics, and pharmaceutical procurement for the central pharmacy."
            icon={Package}
        />
    );
}
