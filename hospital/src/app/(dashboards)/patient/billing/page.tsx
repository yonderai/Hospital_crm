"use client";
import ModulePage from "@/components/ModulePage";
import { DollarSign } from "lucide-react";

export default function PatientBillingPage() {
    return (
        <ModulePage
            title="My Billing & Insurance"
            subtitle="Financial Overview"
            description="View your medical bills, insurance claims status, and payment history. Pay balances securely online."
            icon={DollarSign}
        />
    );
}
