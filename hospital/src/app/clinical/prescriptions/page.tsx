"use client";

import DashboardLayout from "@/components/DashboardLayout";
import PrescriptionEditor from "@/components/clinical/PrescriptionEditor";

export default function PrescriptionsPage() {
    return (
        <DashboardLayout>
            <div className="p-8">
                <PrescriptionEditor />
            </div>
        </DashboardLayout>
    );
}
