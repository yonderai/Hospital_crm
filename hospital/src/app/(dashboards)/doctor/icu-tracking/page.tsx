"use client";

import DashboardLayout from "@/components/DashboardLayout";
import ICUFlowsheetUI from "@/components/clinical/ICUFlowsheet";

export default function ICUPage() {
    return (
        <DashboardLayout>
            <div className="space-y-8">
                <ICUFlowsheetUI />
            </div>
        </DashboardLayout>
    );
}
