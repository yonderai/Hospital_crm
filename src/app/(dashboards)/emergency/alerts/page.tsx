"use client";

import { AlertTriangle } from "lucide-react";

export default function AlertsPage() {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight italic uppercase">Emergency Alerts</h2>
                <p className="text-slate-500 text-[10px] font-black mt-1 uppercase tracking-[0.4em]">Critical Notifications</p>
            </div>

            <div className="bg-red-50 border border-red-100 rounded-[24px] p-6 flex items-start gap-4 shadow-sm">
                <div className="p-3 bg-red-100 rounded-xl text-red-600">
                    <AlertTriangle size={24} />
                </div>
                <div>
                    <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Mass Casualty Protocol</h3>
                    <p className="text-slate-600 text-sm mt-1">Standby mode active. Expecting multiple trauma cases from highway accident.</p>
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-4">Broadcasted 10 mins ago</p>
                </div>
            </div>
        </div>
    );
}
