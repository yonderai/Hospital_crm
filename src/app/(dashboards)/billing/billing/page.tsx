"use client";
import ModulePage from "@/components/ModulePage";
import { DollarSign } from "lucide-react";

export default function BillingMainPage() {
    return (
        <ModulePage
            title="Invoice Management"
            subtitle="Financial Services"
            description="Centralized billing hub for insurance claims processing, patient invoicing, and accounts receivable."
            icon={DollarSign}
        />
    );
}
