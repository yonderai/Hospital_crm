"use client";

import GenericModulePage from "@/components/ModulePage";
import { Banknote } from "lucide-react";

export default function BillingCashPaymentsPage() {
    return (
        <GenericModulePage
            title="CASH PAYMENTS"
            subtitle=" BILLING PORTAL"
            description="View all cash payments collected at front desk and billing counters."
            icon={Banknote}
            dataEndpoint="/api/billing/payments?method=cash"
        />
    );
}
