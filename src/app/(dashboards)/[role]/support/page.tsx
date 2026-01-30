"use client";

import DashboardLayout from "@/components/DashboardLayout";
import TicketManagement from "@/components/tickets/TicketManagement";

export default function UniversalSupportPage() {
    return (
        <DashboardLayout>
            <TicketManagement mode="user" />
        </DashboardLayout>
    );
}
