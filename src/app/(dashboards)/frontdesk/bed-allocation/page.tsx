"use client";

import BedManagementDashboard from "@/components/beds/BedManagementDashboard";
import { Activity } from "lucide-react";

export default function frontdeskbedallocationPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-slate-800">Bed Management</h1>
                    <p className="text-slate-500 font-medium">Real-time bed availability tracking and patient allocation.</p>
                </div>
            </div>

            <BedManagementDashboard />
        </div>
    );
}
