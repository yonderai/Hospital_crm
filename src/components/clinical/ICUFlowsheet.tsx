"use client";

import { useState } from "react";
import {
    Thermometer,
    Droplet,
    Wind,
    Activity,
    Brain,
    Save,
    AlertTriangle,
    Plus,
    Clock,
    User
} from "lucide-react";

export default function ICUFlowsheet() {
    const [activePatient, setActivePatient] = useState({
        name: "John Doe",
        mrn: "MRN-12345",
        bed: "ICU-BED-04",
        diagnose: "Septic Shock / ARDS"
    });

    const [vitals, setVitals] = useState({
        temp: 38.5,
        bp: "105/65",
        hr: 112,
        rr: 24,
        o2sat: 94,
        map: 78
    });

    return (
        <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl overflow-hidden font-sans">
            {/* ICU Top Header */}
            <div className="bg-[#0F172A] p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-gradient-to-tr from-rose-500 to-orange-400 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-500/20">
                        <Activity className="text-white animate-pulse" size={32} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="px-2 py-0.5 bg-rose-500/20 text-rose-400 text-[10px] font-black uppercase tracking-widest rounded border border-rose-500/20 underline decoration-rose-500">Critical Care</span>
                            <span className="text-white/40 text-[10px] font-black uppercase tracking-widest">{activePatient.bed}</span>
                        </div>
                        <h2 className="text-2xl font-black text-white tracking-tight">{activePatient.name}</h2>
                        <p className="text-slate-400 text-xs font-medium uppercase tracking-widest mt-1">Diagnosis: {activePatient.diagnose}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 px-6 py-3 bg-white text-slate-900 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg hover:scale-[1.02] transition-all">
                        <Clock size={16} /> View History
                    </button>
                    <button className="flex items-center gap-2 px-8 py-3 bg-teal-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-teal-500/30 hover:bg-teal-600 transition-all">
                        <Save size={16} /> Log hourly data
                    </button>
                </div>
            </div>

            <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Vitals Entry */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                            { label: "Temp (°C)", icon: Thermometer, color: "text-rose-600", bg: "bg-rose-50", value: vitals.temp },
                            { label: "BP (mmHg)", icon: Activity, color: "text-blue-600", bg: "bg-blue-50", value: vitals.bp },
                            { label: "Heart Rate", icon: Activity, color: "text-emerald-600", bg: "bg-emerald-50", value: vitals.hr },
                            { label: "O2 Sat (%)", icon: Droplet, color: "text-purple-600", bg: "bg-purple-50", value: vitals.o2sat },
                        ].map((item, i) => (
                            <div key={i} className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100 group hover:border-olive-400 transition-all">
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`${item.bg} ${item.color} p-3 rounded-xl`}>
                                        <item.icon size={20} />
                                    </div>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Entry Required</span>
                                </div>
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">{item.label}</label>
                                <input
                                    type="text"
                                    value={item.value}
                                    className="text-2xl font-black text-slate-900 bg-transparent outline-none w-full border-b-2 border-transparent focus:border-olive-500 transition-all"
                                />
                            </div>
                        ))}
                    </div>

                    {/* Ventilator Settings */}
                    <div className="bg-zinc-900 p-8 rounded-[40px] text-white">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center">
                                    <Wind className="text-white" size={20} />
                                </div>
                                <h3 className="text-sm font-black uppercase tracking-widest">Ventilator Parameters</h3>
                            </div>
                            <span className="text-[10px] font-black text-teal-400 uppercase tracking-[0.3em]">Mode: AC/VC</span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            {[
                                { label: "FiO2", val: "40%" },
                                { label: "PEEP", val: "8.0" },
                                { label: "Tidal Vol", val: "450" },
                                { label: "Rate", val: "16" },
                            ].map((v, i) => (
                                <div key={i} className="space-y-1">
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{v.label}</p>
                                    <p className="text-xl font-black text-white">{v.val}<span className="text-[10px] text-slate-600 ml-1">SET</span></p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Score & Intake/Output */}
                <div className="space-y-8">
                    <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm space-y-8">
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <Brain className="text-olive-600" size={20} />
                                <h3 className="text-sm font-black uppercase tracking-widest">Neuro & Scores</h3>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">GCS Score</p>
                                        <span className="text-xs font-bold text-slate-900">E4 V4 M6 = 14</span>
                                    </div>
                                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-olive-500 w-[93%]"></div>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">RASS Sedation Scale</p>
                                    <select className="w-full bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs font-bold font-sans outline-none focus:ring-2 focus:ring-olive-500/20">
                                        <option>-1: Drowsy</option>
                                        <option>0: Alert and Calm</option>
                                        <option>+1: Restless</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="pt-8 border-t border-slate-100">
                            <div className="flex items-center gap-3 mb-6">
                                <Droplet className="text-blue-600" size={20} />
                                <h3 className="text-sm font-black uppercase tracking-widest">Intake / Output</h3>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
                                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Total Intake</p>
                                    <p className="text-lg font-black text-blue-900">1,250 <span className="text-[10px]">mL</span></p>
                                </div>
                                <div className="p-4 bg-orange-50/50 rounded-2xl border border-orange-100">
                                    <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest mb-1">Total Output</p>
                                    <p className="text-lg font-black text-orange-900">850 <span className="text-[10px]">mL</span></p>
                                </div>
                            </div>
                            <div className="mt-4 p-4 bg-slate-900 rounded-2xl flex items-center justify-between">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Net Balance</span>
                                <span className="text-emerald-400 font-black">+400 mL</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-rose-50 border border-rose-100 p-6 rounded-[32px] flex items-start gap-4">
                        <AlertTriangle className="text-rose-500 shrink-0" size={20} />
                        <div>
                            <h4 className="text-xs font-black text-rose-900 uppercase tracking-tighter decoration-rose-500 underline underline-offset-4">Critical Alert</h4>
                            <p className="text-[11px] text-rose-700 mt-2 font-medium leading-relaxed">
                                MAP (78) is trending downwards. Vasopressor titration may be needed.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
