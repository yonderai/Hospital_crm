"use client";

import { Stethoscope } from "lucide-react";

export default function ClinicalPage() {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight italic uppercase">Clinical Workspace</h2>
                <p className="text-slate-500 text-[10px] font-black mt-1 uppercase tracking-[0.4em]">Doctor Notes & Orders</p>
            </div>

            <div className="flex items-center justify-center h-64 border-2 border-dashed border-slate-200 rounded-[32px] text-slate-400 font-bold bg-slate-50/50">
                Select a patient from Triage to view clinical details.
            </div>
        </div>
    );
}
