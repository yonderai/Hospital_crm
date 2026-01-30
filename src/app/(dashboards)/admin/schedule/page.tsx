"use client";

import DashboardLayout from "@/components/DashboardLayout";
import DoctorScheduleDashboard from "@/components/schedule/DoctorScheduleDashboard";

export default function AdminSchedulePage() {
    return (
        <DashboardLayout>
            <DoctorScheduleDashboard role="admin" />
        </DashboardLayout>
    );
}
