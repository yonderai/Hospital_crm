"use client";

import DashboardLayout from "@/components/DashboardLayout";
import TicketManagement from "@/components/tickets/TicketManagement";

export default function FinanceApprovalsPage() {
    return (
        <DashboardLayout>
            <TicketManagement mode="finance" />
        </DashboardLayout>
    );
}
