"use client";

import { AlertTriangle } from "lucide-react";

export default function AlertsPage() {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h2 className="text-3xl font-black text-white tracking-tight italic uppercase">Emergency Alerts</h2>
                <p className="text-slate-500 text-[10px] font-black mt-1 uppercase tracking-[0.4em]">Critical Notifications</p>
            </div>

            <div className="bg-red-500/10 border border-red-500/20 rounded-[24px] p-6 flex items-start gap-4">
                <div className="p-3 bg-red-500/20 rounded-xl text-red-500">
                    <AlertTriangle size={24} />
                </div>
                <div>
                    <h3 className="text-lg font-black text-white uppercase tracking-tight">Mass Casualty Protocol</h3>
                    <p className="text-red-200 text-sm mt-1">Standby mode active. Expecting multiple trauma cases from highway accident.</p>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-4">Broadcasted 10 mins ago</p>
                </div>
            </div>
        </div>
    );
}
