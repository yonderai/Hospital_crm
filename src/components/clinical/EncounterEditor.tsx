"use client";

import { useState } from "react";
import {
    FileText,
    Activity,
    Plus,
    Search,
    Save,
    History,
    Thermometer,
    Heart,
    Eye,
    CheckCircle2,
    ShieldCheck
} from "lucide-react";

export default function EncounterEditor() {
    const [activeTab, setActiveTab] = useState("soap");

    return (
        <div className="max-w-6xl mx-auto space-y-10 font-sans pb-32">
            {/* Patient Header Banner */}
            <div className="bg-white border border-slate-100 rounded-[40px] p-8 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-[24px] bg-slate-900 border border-slate-800 flex items-center justify-center text-olive-400 font-serif text-3xl italic">
                        P
                    </div>
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Johnathan Doe</h2>
                            <span className="text-[10px] font-black bg-olive-50 text-olive-600 px-3 py-1 rounded-full uppercase tracking-widest border border-olive-100">In-Patient</span>
                        </div>
                        <div className="flex gap-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                            <span>MRN: 99824-X</span>
                            <span>DOB: 05/12/1982 (43Y)</span>
                            <span className="text-olive-700">Allergies: Penicillin, Sulfa</span>
                        </div>
                    </div>
                </div>
                <div className="flex gap-4">
                    <button className="flex items-center gap-2 px-6 py-3 bg-slate-50 text-slate-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all">
                        <History size={14} /> Full Chart
                    </button>
                </div>
            </div>

            {/* Main Tabs */}
            <div className="flex gap-2 p-1 bg-slate-100/50 rounded-2xl w-fit">
                {["SOAP Notes", "Vitals & Biometrics", "Diagnostics", "Care Plan"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab.toLowerCase())}
                        className={`px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === tab.toLowerCase() ? "bg-white text-olive-700 shadow-sm" : "text-slate-400 hover:text-slate-600"
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Editor Area */}
                <div className="lg:col-span-2 space-y-8">
                    <section className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-10 space-y-10">
                        <SOAPField
                            label="Subjective"
                            placeholder="Chief complaint, history of present illness..."
                            desc="Patient reports increased chest tightness for 2 days. Worse at night."
                        />
                        <SOAPField
                            label="Objective"
                            placeholder="Physical exam findinds, physical observations..."
                            desc="HR: 88, Lungs clear to auscultation. No peripheral edema noted."
                        />
                        <SOAPField
                            label="Assessment"
                            placeholder="Diagnosis and differential diagnosis..."
                            desc="Chest pain, unspecified. R/O stable angina."
                        />
                        <SOAPField
                            label="Plan"
                            placeholder="Treatment plan, orders, and follow-up..."
                            desc="Prescribed 81mg Aspirin. Referred for Stress Test (Stat)."
                        />
                    </section>

                    <div className="flex items-center justify-between px-4">
                        <div className="flex items-center gap-2 text-slate-400">
                            <CheckCircle2 size={16} className="text-olive-600" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Last autosaved: 30 seconds ago</span>
                        </div>
                        <div className="flex gap-4">
                            <button className="px-12 py-4 bg-olive-700 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-olive-600/20 hover:bg-olive-800 transition-all flex items-center gap-2">
                                <Save size={18} /> Finalize Encounter
                            </button>
                        </div>
                    </div>
                </div>

                {/* Clinical Context Sidebar */}
                <div className="space-y-8">
                    <div className="bg-white rounded-[40px] border border-slate-100 p-8 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Real-time Vitals</h3>
                            <Plus size={16} className="text-olive-600 cursor-pointer" />
                        </div>
                        <div className="space-y-4">
                            <VitalRow icon={Activity} label="Heart Rate" value="88" unit="bpm" status="Normal" />
                            <VitalRow icon={Heart} label="BP" value="128/82" unit="mmHg" status="Normal" />
                            <VitalRow icon={Thermometer} label="Temp" value="98.6" unit="°F" status="Normal" />
                            <VitalRow icon={Activity} label="SpO2" value="95" unit="%" status="Caution" color="text-orange-500" />
                        </div>
                    </div>

                    <div className="bg-[#0F172A] rounded-[40px] p-8 text-white relative overflow-hidden shadow-2xl">
                        <div className="relative z-10 space-y-6">
                            <div className="flex items-center gap-2">
                                <ShieldCheck size={18} className="text-olive-400" />
                                <h4 className="text-sm font-black uppercase tracking-widest">ICD-10 Search</h4>
                            </div>
                            <div className="relative">
                                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                                <input className="w-full bg-white/5 border border-white/10 p-3 pl-10 rounded-xl text-xs outline-none focus:bg-white/10" placeholder="Type name or code..." />
                            </div>
                            <div className="space-y-2">
                                <p className="text-[10px] font-black text-olive-400 uppercase tracking-widest mb-1">Selected Codes</p>
                                <div className="p-3 bg-white/5 rounded-xl border border-white/5 flex justify-between items-center">
                                    <span className="text-xs font-bold">R07.9 - Chest Pain</span>
                                    <Plus size={14} className="opacity-40" />
                                </div>
                            </div>
                        </div>
                        <FileText className="absolute bottom-[-10%] right-[-10%] text-white/5" size={200} />
                    </div>

                    <button className="w-full flex items-center justify-center gap-3 p-6 bg-slate-50 border border-slate-100 rounded-[40px] text-slate-500 hover:text-slate-900 transition-all group">
                        <Eye size={20} />
                        <span className="text-xs font-black uppercase tracking-widest">Clinical Summary PDF</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

function SOAPField({ label, placeholder, desc }: any) {
    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-olive-600" />
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-[0.3em]">{label}</h4>
            </div>
            <textarea
                className="w-full min-h-[120px] bg-slate-50/50 border border-slate-100 p-6 rounded-[32px] text-sm font-medium text-slate-700 outline-none focus:bg-white focus:border-olive-400 focus:ring-4 focus:ring-olive-600/5 transition-all shadow-inner"
                placeholder={placeholder}
                defaultValue={desc}
            />
        </div>
    );
}

function VitalRow({ icon: Icon, label, value, unit, status, color = "text-olive-700" }: any) {
    return (
        <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-50">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg border border-slate-100">
                    <Icon size={14} className="text-slate-400" />
                </div>
                <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{label}</p>
                    <p className="text-sm font-black text-slate-900">{value} <span className="text-[10px] text-slate-400 font-bold">{unit}</span></p>
                </div>
            </div>
            <span className={`text-[9px] font-black uppercase tracking-widest ${color}`}>{status}</span>
        </div>
    );
}
