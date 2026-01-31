"use client";

import GenericModulePage from "@/components/ModulePage";
import { ShieldAlert } from "lucide-react";

export default function BillingClaimsPage() {
    return (
        <GenericModulePage
            title="CLAIMS"
            subtitle=" BILLING PORTAL"
            description="Track insurance claims, status updates, and adjudications."
            icon={ShieldAlert}
            dataEndpoint="/api/billing/claims"
        />
    );
}
