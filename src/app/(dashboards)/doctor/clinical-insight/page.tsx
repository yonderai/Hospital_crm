"use client";

import DashboardLayout from "@/components/DashboardLayout";
import ClinicalInsightForm from "@/components/clinical/ClinicalInsightForm";
import { Sparkles } from "lucide-react";

export default function ClinicalInsightPage() {
    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
                        <Sparkles size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Clinical AI Insight</h1>
                        <p className="text-sm text-slate-500 font-medium">Generate AI-powered clinical summaries and risk assessments.</p>
                    </div>
                </div>

                <ClinicalInsightForm />
            </div>
        </DashboardLayout>
    );
}
