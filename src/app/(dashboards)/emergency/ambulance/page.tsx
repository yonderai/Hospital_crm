"use client";

import { Ambulance, MapPin } from "lucide-react";

export default function AmbulancePage() {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h2 className="text-3xl font-black text-white tracking-tight italic uppercase">Ambulance Fleet</h2>
                <p className="text-slate-500 text-[10px] font-black mt-1 uppercase tracking-[0.4em]">Dispatch & Status</p>
            </div>

            <div className="grid grid-cols-3 gap-6">
                {/* Demo Ambulance Card */}
                <div className="bg-slate-950 border border-slate-800 rounded-[24px] p-6 relative overflow-hidden group hover:border-emerald-500/50 transition-all cursor-pointer">
                    <div className="absolute top-0 right-0 p-4 opacity-50">
                        <Ambulance size={64} className="text-slate-800 group-hover:text-emerald-900/50 transition-colors" />
                    </div>
                    <div className="relative z-10">
                        <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-lg text-[10px] font-black uppercase tracking-wider border border-emerald-500/20 mb-4 inline-block">
                            Available
                        </span>
                        <h3 className="text-2xl font-black text-white">AMB-01</h3>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mt-1">Ford Transit • ALS</p>

                        <div className="mt-6 flex items-center gap-2 text-slate-400">
                            <MapPin size={16} />
                            <span className="text-xs font-bold">Station 1 (Main)</span>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-[24px] p-6 relative overflow-hidden group hover:border-orange-500/50 transition-all cursor-pointer">
                    <div className="absolute top-0 right-0 p-4 opacity-50">
                        <Ambulance size={64} className="text-slate-800 group-hover:text-orange-900/50 transition-colors" />
                    </div>
                    <div className="relative z-10">
                        <span className="px-3 py-1 bg-orange-500/10 text-orange-500 rounded-lg text-[10px] font-black uppercase tracking-wider border border-orange-500/20 mb-4 inline-block">
                            Busy
                        </span>
                        <h3 className="text-2xl font-black text-white">AMB-02</h3>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mt-1">Mercedes Sprinter • ICU</p>

                        <div className="mt-6 flex items-center gap-2 text-orange-400">
                            <MapPin size={16} />
                            <span className="text-xs font-bold">In Transit &rarr; Hospital (ETA 5m)</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
