"use client";
import ModulePage from "@/components/ModulePage";
import { BarChart3 } from "lucide-react";

export default function AnalyticsPage() {
    return (
        <ModulePage
            title="Clinical Analytics"
            subtitle="Performance Insights"
            description="Track clinical outcomes, patient recovery rates, and department efficiency metrics."
            icon={BarChart3}
        />
    );
}
