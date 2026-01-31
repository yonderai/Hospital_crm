"use client";

import GenericModulePage from "@/components/ModulePage";
import { CreditCard } from "lucide-react";

export default function BillingDigitalPaymentsPage() {
    return (
        <GenericModulePage
            title="DIGITAL PAYMENTS"
            subtitle=" BILLING PORTAL"
            description="Track credit cards, debit cards, and EFT transactions."
            icon={CreditCard}
            dataEndpoint="/api/billing/payments?method=digital"
        />
    );
}
