"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { ShieldCheck } from "lucide-react";
import InsurancePreAuth from "@/components/billing/InsurancePreAuth";

export default function BillingPreAuthPage() {
    return (
        <DashboardLayout>
            <div className="space-y-10">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                            <ShieldCheck className="text-blue-600" size={32} />
                            INSURANCE PRE-AUTH
                        </h2>
                        <p className="text-olive-600 text-[10px] font-black mt-1 uppercase tracking-[0.3em] ml-1">
                            BILLING PORTAL
                        </p>
                    </div>
                    <div className="px-6 py-2 bg-blue-50 text-blue-600 rounded-full font-black text-[10px] uppercase tracking-widest border border-blue-100 shadow-sm">
                        SECURE PAYER GATEWAY ACTIVE
                    </div>
                </div>

                <InsurancePreAuth />
            </div>
        </DashboardLayout>
    );
}
