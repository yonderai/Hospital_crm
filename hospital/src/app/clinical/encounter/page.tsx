"use client";

import PatientBanner from "@/components/clinical/PatientBanner";
import AISuggestions from "@/components/clinical/AISuggestions";
import { FileText, ClipboardList, Stethoscope, Microscope, Beaker, Camera, LayoutGrid } from "lucide-react";
import { useState } from "react";

export default function EncounterPage() {
    const [activeTab, setActiveTab] = useState("notes");

    return (
        <div className="flex flex-col h-screen bg-olive-50">
            {/* Top Banner */}
            <PatientBanner />

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar Nav */}
                <div className="w-16 bg-white border-r border-olive-200 flex flex-col items-center py-4 gap-6">
                    <button onClick={() => setActiveTab("overview")} className={`p-2 rounded-lg transition-colors ${activeTab === 'overview' ? 'bg-olive-100 text-olive-600' : 'text-olive-400 hover:text-olive-600'}`}>
                        <LayoutGrid size={24} />
                    </button>
                    <button onClick={() => setActiveTab("notes")} className={`p-2 rounded-lg transition-colors ${activeTab === 'notes' ? 'bg-olive-100 text-olive-600' : 'text-olive-400 hover:text-olive-600'}`}>
                        <FileText size={24} />
                    </button>
                    <button onClick={() => setActiveTab("vitals")} className={`p-2 rounded-lg transition-colors ${activeTab === 'vitals' ? 'bg-olive-100 text-olive-600' : 'text-olive-400 hover:text-olive-600'}`}>
                        <ClipboardList size={24} />
                    </button>
                    <button onClick={() => setActiveTab("physical")} className={`p-2 rounded-lg transition-colors ${activeTab === 'physical' ? 'bg-olive-100 text-olive-600' : 'text-olive-400 hover:text-olive-600'}`}>
                        <Stethoscope size={24} />
                    </button>
                    <div className="w-8 h-[1px] bg-olive-200 my-2" />
                    <button className="p-2 text-olive-400 hover:text-olive-600"><Microscope size={24} /></button>
                    <button className="p-2 text-olive-400 hover:text-olive-600"><Beaker size={24} /></button>
                    <button className="p-2 text-olive-400 hover:text-olive-600"><Camera size={24} /></button>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Internal Header */}
                    <div className="p-4 bg-white border-b border-olive-100 flex items-center justify-between">
                        <h2 className="text-lg font-bold text-olive-900 capitalize">{activeTab} Encounter</h2>
                        <div className="flex gap-2">
                            <button className="px-4 py-2 border border-olive-300 rounded text-olive-700 text-sm font-medium hover:bg-olive-50">Draft</button>
                            <button className="px-4 py-2 bg-olive-600 text-white rounded text-sm font-medium hover:bg-olive-700">Sign & Close</button>
                        </div>
                    </div>

                    {/* Editor Area */}
                    <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center">
                        <div className="w-full max-w-3xl bg-white min-h-[500px] shadow-sm border border-olive-200 rounded-lg p-8">
                            <div className="mb-6 pb-4 border-b border-olive-100">
                                <span className="text-[10px] uppercase font-bold text-olive-400 tracking-widest">SOAP NOTE</span>
                                <p className="text-xl font-serif text-olive-900 italic mt-1 font-semibold">Initial Progress Note...</p>
                            </div>

                            <div className="space-y-8">
                                <section>
                                    <label className="text-xs font-bold text-olive-600 uppercase mb-2 block">Subjective</label>
                                    <textarea
                                        className="w-full h-32 p-3 bg-olive-50 border border-transparent focus:border-olive-300 focus:bg-white rounded transition-all outline-none text-sm text-olive-800 leading-relaxed"
                                        placeholder="Patient describes symptoms..."
                                        defaultValue="Patient presents for follow-up on Type 2 Diabetes management. Reports occasional dizziness in the morning but overall adherence to diet is good. No new complaints..."
                                    />
                                </section>

                                <section>
                                    <label className="text-xs font-bold text-olive-600 uppercase mb-2 block">Objective</label>
                                    <div className="grid grid-cols-4 gap-4 mb-4">
                                        <div className="p-2 bg-olive-50 rounded border border-olive-100">
                                            <span className="text-[10px] text-olive-500 block uppercase">BP</span>
                                            <span className="text-sm font-bold text-olive-900">128/82</span>
                                        </div>
                                        <div className="p-2 bg-olive-50 rounded border border-olive-100">
                                            <span className="text-[10px] text-olive-500 block uppercase">HR</span>
                                            <span className="text-sm font-bold text-olive-900">74 bpm</span>
                                        </div>
                                        <div className="p-2 bg-olive-50 rounded border border-olive-100">
                                            <span className="text-[10px] text-olive-500 block uppercase">Temp</span>
                                            <span className="text-sm font-bold text-olive-900">98.6°F</span>
                                        </div>
                                        <div className="p-2 bg-olive-50 rounded border border-olive-100">
                                            <span className="text-[10px] text-olive-500 block uppercase">SpO2</span>
                                            <span className="text-sm font-bold text-olive-900">99%</span>
                                        </div>
                                    </div>
                                    <textarea
                                        className="w-full h-24 p-3 bg-olive-50 border border-transparent focus:border-olive-300 focus:bg-white rounded transition-all outline-none text-sm text-olive-800"
                                        placeholder="Physical findings..."
                                    />
                                </section>

                                <section>
                                    <label className="text-xs font-bold text-olive-600 uppercase mb-2 block">Assessment & Plan</label>
                                    <textarea
                                        className="w-full h-32 p-3 bg-olive-50 border border-transparent focus:border-olive-300 focus:bg-white rounded transition-all outline-none text-sm text-olive-800"
                                        placeholder="Diagnosis and next steps..."
                                        defaultValue="1. Type 2 Diabetes Mellitus - Controlled. Continue Metformin.&#10;2. Hypertension - Stable on Lisinopril.&#10;3. Follow up in 3 months with Labs."
                                    />
                                </section>
                            </div>
                        </div>
                    </div>
                </div>

                {/* AI Sidebar */}
                <AISuggestions />
            </div>

            {/* Footer / Status Bar */}
            <div className="h-8 bg-olive-900 text-olive-100 px-4 flex items-center justify-between text-[10px] font-medium">
                <div className="flex gap-4">
                    <span>SECURE CONNECTION</span>
                    <span>AUTOSAVED 2m ago</span>
                </div>
                <div>
                    PROVIDER: DR. YUVRAJ SINGH
                </div>
            </div>
        </div>
    );
}
