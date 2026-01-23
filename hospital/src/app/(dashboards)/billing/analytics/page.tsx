"use client";
import ModulePage from "@/components/ModulePage";
import { BarChart3 } from "lucide-react";

export default function BillingAnalyticsPage() {
    return (
        <ModulePage
            title="Revenue Analytics"
            subtitle="Financial Performance"
            description="Track hospital collections, denial rates, and revenue cycle efficiency across all clinical departments."
            icon={BarChart3}
        />
    );
}
