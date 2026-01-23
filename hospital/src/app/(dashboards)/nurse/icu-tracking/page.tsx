"use client";

import DashboardLayout from "@/components/DashboardLayout";
import ICUFlowsheetUI from "@/components/clinical/ICUFlowsheet";
import { Wind } from "lucide-react";

export default function NurseICUPage() {
    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="px-4">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">ICU Vigilance</h2>
                    <p className="text-slate-500 text-xs font-medium uppercase tracking-widest mt-1">Critical Care Monitoring • Station 7G</p>
                </div>
                <ICUFlowsheetUI />
            </div>
        </DashboardLayout>
    );
}
