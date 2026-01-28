"use client";

import GenericModulePage from "@/components/ModulePage";
import { Users } from "lucide-react";

export default function AdminUsersPage() {
    return (
        <GenericModulePage
            title="USER MANAGEMENT"
            subtitle="ADMIN PORTAL"
            description="Manage doctor, nurse, and staff accounts. Assign roles and permissions."
            icon={Users}
        />
    );
}
