"use client";

import GenericModulePage from "@/components/ModulePage";
import { Building } from "lucide-react";

export default function AdminDepartmentsPage() {
    return (
        <GenericModulePage
            title="DEPARTMENTS & SERVICES"
            subtitle="ADMIN PORTAL"
            description="Configure hospital departments, services, and consultation charges."
            icon={Building}
        />
    );
}
