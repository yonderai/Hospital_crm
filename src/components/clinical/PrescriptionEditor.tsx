"use client";

import { useState } from "react";
import {
    Plus,
    Search,
    Trash2,
    CheckCircle,
    Stethoscope,
    ShieldCheck,
    Calculator,
    Save,
    ChevronDown
} from "lucide-react";

export default function PrescriptionEditor() {
    const [meds, setMeds] = useState([
        { drugName: "Metformin", dosage: "500mg", frequency: "Twice daily", route: "Oral", duration: "30 days" }
    ]);

    const addMed = () => {
        setMeds([...meds, { drugName: "", dosage: "", frequency: "", route: "Oral", duration: "" }]);
    };

    const removeMed = (index: number) => {
        setMeds(meds.filter((_, i) => i !== index));
    };

    return (
        <div className="max-w-5xl mx-auto space-y-10 font-sans">
            <div className="flex items-center justify-between border-b border-slate-100 pb-8">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-olive-100 text-olive-700 rounded-2xl flex items-center justify-center shadow-lg shadow-olive-600/10">
                        <Stethoscope size={28} />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Prescription Writer</h2>
                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mt-1">E-Prescribing Node Alpha</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="px-4 py-2 bg-olive-50 text-olive-700 rounded-xl border border-olive-100 flex items-center gap-2">
                        <ShieldCheck size={14} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Drug Interaction Check: Clear</span>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-8 bg-slate-50/50 border-b border-slate-50 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-olive-400 font-black text-xs">P</div>
                        <div>
                            <p className="text-sm font-bold text-slate-900 underline">Johnathan Doe</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">DOB: 05/12/1982 • MRN: 99824-X</p>
                        </div>
                    </div>
                    <button className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-all">
                        Clinical Context (ICD-10) <ChevronDown size={14} />
                    </button>
                </div>

                <div className="p-10 space-y-8">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                                <th className="px-4 py-4 w-1/3 text-slate-900">Medication / Strength</th>
                                <th className="px-4 py-4">Frequency</th>
                                <th className="px-4 py-4">Route</th>
                                <th className="px-4 py-4">Duration</th>
                                <th className="px-4 py-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {meds.map((med, i) => (
                                <tr key={i} className="group">
                                    <td className="px-4 py-6">
                                        <div className="space-y-2">
                                            <div className="relative">
                                                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                                <input
                                                    value={med.drugName}
                                                    placeholder="Search Drug Database..."
                                                    className="w-full bg-slate-50/50 border border-slate-100 p-3 pl-10 rounded-xl text-sm font-bold outline-none focus:border-olive-600 focus:bg-white transition-all"
                                                />
                                            </div>
                                            <input value={med.dosage} placeholder="Strength (e.g. 500mg)" className="w-full bg-transparent p-1 text-[10px] font-bold text-slate-400 outline-none" />
                                        </div>
                                    </td>
                                    <td className="px-4 py-6">
                                        <select className="bg-slate-50/50 border border-slate-100 p-3 rounded-xl text-xs font-bold w-full outline-none">
                                            <option>Twice Daily (BID)</option>
                                            <option>Once Daily (QD)</option>
                                            <option>Three Times (TID)</option>
                                            <option>As Needed (PRN)</option>
                                        </select>
                                    </td>
                                    <td className="px-4 py-6">
                                        <select className="bg-slate-50/50 border border-slate-100 p-3 rounded-xl text-xs font-bold w-full outline-none">
                                            <option>Oral</option>
                                            <option>Intravenous</option>
                                            <option>Subcutaneous</option>
                                            <option>Topical</option>
                                        </select>
                                    </td>
                                    <td className="px-4 py-6">
                                        <input placeholder="30 days" className="bg-slate-50/50 border border-slate-100 p-3 rounded-xl text-xs font-bold w-full outline-none" />
                                    </td>
                                    <td className="px-4 py-6 text-center">
                                        <button onClick={() => removeMed(i)} className="p-2.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <button
                        onClick={addMed}
                        className="flex items-center gap-2 text-[10px] font-black text-olive-700 uppercase tracking-[0.2em] px-4 py-2 hover:bg-olive-50 rounded-xl transition-all border border-olive-100 hover:border-olive-200"
                    >
                        <Plus size={14} /> Add Additional Line Item
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-slate-900 rounded-[40px] p-8 text-white relative overflow-hidden">
                    <div className="relative z-10 flex flex-col justify-between h-full space-y-8">
                        <div className="space-y-2">
                            <h4 className="text-xl font-black italic">Formulary Advisor</h4>
                            <p className="text-xs text-slate-400 leading-relaxed font-medium">Metformin is the Tier 1 preferred agent for Type 2 Diabetes on the patient's current insurance plan.</p>
                        </div>
                        <div className="flex gap-4">
                            <button className="flex items-center gap-2 text-[10px] font-black text-olive-400 uppercase tracking-widest">
                                <Calculator size={14} /> GFR: 72 mL/min (Normal)
                            </button>
                        </div>
                    </div>
                    <div className="absolute top-[-10%] right-[-10%] opacity-10">
                        <CheckCircle size={200} />
                    </div>
                </div>

                <div className="bg-white rounded-[40px] border border-slate-100 p-8 flex flex-col justify-between">
                    <div>
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Finalize Directive</h4>
                        <p className="text-[11px] text-slate-500 leading-relaxed mb-6 font-medium italic">
                            "Pharmacy: CVS Health #4823. E-Prescribe node is ready for signature."
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <button className="flex-1 py-4 bg-olive-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-olive-600/20 hover:bg-olive-800 transition-all flex items-center justify-center gap-2">
                            <Save size={16} /> Authorize & Send
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
