"use client";

import { useState, useRef, useEffect } from "react";
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
import { medicines, Medicine } from "@/lib/data/medicines";

export default function PrescriptionEditor() {
    const [meds, setMeds] = useState([
        { drugName: "Metformin", dosage: "500mg", frequency: "Twice daily", route: "Oral", duration: "30 days" }
    ]);

    // Autocomplete State
    const [suggestions, setSuggestions] = useState<{ [key: number]: Medicine[] }>({});
    const [showSuggestions, setShowSuggestions] = useState<{ [key: number]: boolean }>({});
    const wrapperRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

    useEffect(() => {
        // Click outside listener to close suggestions
        function handleClickOutside(event: MouseEvent) {
            Object.keys(wrapperRefs.current).forEach((key: any) => {
                if (wrapperRefs.current[key] && !wrapperRefs.current[key]?.contains(event.target as Node)) {
                    setShowSuggestions(prev => ({ ...prev, [key]: false }));
                }
            });
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const addMed = () => {
        setMeds([...meds, { drugName: "", dosage: "", frequency: "", route: "Oral", duration: "" }]);
    };

    const removeMed = (index: number) => {
        setMeds(meds.filter((_, i) => i !== index));
    };

    const handleDrugChange = (index: number, value: string) => {
        const newMeds = [...meds];
        newMeds[index].drugName = value;
        setMeds(newMeds);

        if (value.length > 0) {
            const filtered = medicines.filter(m =>
                m.name.toLowerCase().includes(value.toLowerCase())
            );
            setSuggestions(prev => ({ ...prev, [index]: filtered }));
            setShowSuggestions(prev => ({ ...prev, [index]: true }));
        } else {
            setShowSuggestions(prev => ({ ...prev, [index]: false }));
        }
    };

    const selectMedicine = (index: number, med: Medicine) => {
        const newMeds = [...meds];
        newMeds[index].drugName = med.name;
        newMeds[index].dosage = med.strength;

        // Smart Route Selection
        let route = "Oral";
        if (med.form === "Injection") route = "Intravenous";
        if (med.form === "Cream") route = "Topical";
        if (med.form === "Inhaler") route = "Inhalation"; // Added support if added to select later

        newMeds[index].route = route;

        setMeds(newMeds);
        setShowSuggestions(prev => ({ ...prev, [index]: false }));
    };

    const handleFieldChange = (index: number, field: string, value: string) => {
        const newMeds: any = [...meds];
        newMeds[index][field] = value;
        setMeds(newMeds);
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
                                <tr key={i} className="group align-top">
                                    <td className="px-4 py-6">
                                        <div className="space-y-2">
                                            <div ref={el => { wrapperRefs.current[i] = el; }} className="relative">
                                                <div className="relative">
                                                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                                    <input
                                                        value={med.drugName}
                                                        onChange={(e) => handleDrugChange(i, e.target.value)}
                                                        placeholder="Search Drug Database..."
                                                        className="w-full bg-slate-50/50 border border-slate-100 p-3 pl-10 rounded-xl text-sm font-bold outline-none focus:border-olive-600 focus:bg-white transition-all"
                                                        onFocus={() => { if (med.drugName) setShowSuggestions(prev => ({ ...prev, [i]: true })) }}
                                                    />
                                                </div>

                                                {/* Autocomplete Dropdown */}
                                                {showSuggestions[i] && suggestions[i] && suggestions[i].length > 0 && (
                                                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-xl shadow-xl z-50 max-h-60 overflow-y-auto">
                                                        {suggestions[i].map((suggestion) => (
                                                            <div
                                                                key={suggestion.id}
                                                                onClick={() => selectMedicine(i, suggestion)}
                                                                className="p-3 hover:bg-olive-50 cursor-pointer border-b border-slate-50 last:border-none"
                                                            >
                                                                <div className="font-bold text-slate-900 text-sm">{suggestion.name}</div>
                                                                <div className="flex gap-2 text-xs text-slate-500 mt-0.5">
                                                                    <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">{suggestion.strength}</span>
                                                                    <span>{suggestion.form}</span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                            <input
                                                value={med.dosage}
                                                onChange={(e) => handleFieldChange(i, "dosage", e.target.value)}
                                                placeholder="Strength (e.g. 500mg)"
                                                className="w-full bg-transparent p-1 text-[10px] font-bold text-slate-400 outline-none focus:text-slate-900 transition-colors"
                                            />
                                        </div>
                                    </td>
                                    <td className="px-4 py-6">
                                        <select
                                            value={med.frequency}
                                            onChange={(e) => handleFieldChange(i, "frequency", e.target.value)}
                                            className="bg-slate-50/50 border border-slate-100 p-3 rounded-xl text-xs font-bold w-full outline-none"
                                        >
                                            <option value="">Select Frequency</option>
                                            <option value="Once Daily (QD)">Once Daily (QD)</option>
                                            <option value="Twice Daily (BID)">Twice Daily (BID)</option>
                                            <option value="Three Times (TID)">Three Times (TID)</option>
                                            <option value="Four Times (QID)">Four Times (QID)</option>
                                            <option value="Every 4 Hours">Every 4 Hours</option>
                                            <option value="Every 6 Hours">Every 6 Hours</option>
                                            <option value="As Needed (PRN)">As Needed (PRN)</option>
                                        </select>
                                    </td>
                                    <td className="px-4 py-6">
                                        <select
                                            value={med.route}
                                            onChange={(e) => handleFieldChange(i, "route", e.target.value)}
                                            className="bg-slate-50/50 border border-slate-100 p-3 rounded-xl text-xs font-bold w-full outline-none"
                                        >
                                            <option value="Oral">Oral</option>
                                            <option value="Intravenous">Intravenous</option>
                                            <option value="Subcutaneous">Subcutaneous</option>
                                            <option value="Intramuscular">Intramuscular</option>
                                            <option value="Topical">Topical</option>
                                            <option value="Inhalation">Inhalation</option>
                                            <option value="Ophthalmic">Ophthalmic</option>
                                        </select>
                                    </td>
                                    <td className="px-4 py-6">
                                        <input
                                            value={med.duration}
                                            onChange={(e) => handleFieldChange(i, "duration", e.target.value)}
                                            placeholder="30 days"
                                            className="bg-slate-50/50 border border-slate-100 p-3 rounded-xl text-xs font-bold w-full outline-none"
                                        />
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
