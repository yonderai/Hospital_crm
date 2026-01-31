"use client";

import GenericModulePage from "@/components/ModulePage";
import { Activity } from "lucide-react";
import QueueList from "@/components/frontdesk/queue/QueueList";

export default function frontdeskqueuePage() {
    return (
        <GenericModulePage
            title="QUEUE"
            subtitle=" PORTAL"
            description="Access your queue management system. Real-time tracking and automated reporting active."
            icon={Activity}
            disableLayout={true}
        >
            <QueueList />
        </GenericModulePage>
    );
}
