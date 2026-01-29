"use client";

import { useState, useEffect } from "react";
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
    User,
    RefreshCw
} from "lucide-react";

export default function ICUFlowsheet() {
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [patient, setPatient] = useState<any>(null);
    const [vitals, setVitals] = useState({
        temp: 37.5,
        bp: "120/80",
        hr: 80,
        rr: 18,
        o2sat: 98,
        map: 93
    });
    const [vent, setVent] = useState({
        mode: "AC/VC",
        fiO2: 40,
        peep: 5,
        tidalVolume: 450,
        rate: 16
    });

    const fetchLatestData = async () => {
        try {
            // First get an ICU patient from dashboard data
            const dashRes = await fetch("/api/nurse/dashboard-data");
            const dashData = await dashRes.json();

            // For demo, we just pick the first patient that looks like they are in ICU or Ward
            const targetPatient = dashData.vitalsFlow?.[0];
            if (targetPatient) {
                setPatient({
                    name: targetPatient.patient,
                    mrn: "MRN-ICU-001",
                    bed: "ICU-BED-01",
                    diagnose: "Post-Op Observation"
                });
            } else {
                setPatient({
                    name: "John Doe",
                    mrn: "MRN-12345",
                    bed: "ICU-BED-04",
                    diagnose: "Septic Shock / ARDS"
                });
            }

            // Fetch actual flowsheet data if exists
            // const res = await fetch(`/api/clinical/icu/flowsheet?patientId=${...}`);
        } catch (error) {
            console.error("ICU Fetch Error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLatestData();
    }, []);

    const handleSave = async () => {
        setSubmitting(true);
        try {
            // This would call POST /api/clinical/icu/flowsheet
            // For now simulate success
            await new Promise(r => setTimeout(r, 1000));
            alert("ICU Flowsheet entry saved successfully.");
        } catch (error) {
            alert("Error saving data.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <div className="h-96 flex flex-col items-center justify-center bg-white rounded-[40px] border border-slate-100">
            <RefreshCw className="animate-spin text-olive-600 mb-4" size={48} />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Initializing ICU Node...</p>
        </div>
    );

    return (
        <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl overflow-hidden font-sans group/flow">
            {/* ICU Top Header */}
            <div className="bg-[#0F172A] p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-olive-500/5 rounded-full -mr-32 -mt-32 blur-3xl" />

                <div className="flex items-center gap-6 relative z-10">
                    <div className="w-16 h-16 bg-gradient-to-tr from-rose-500 to-orange-400 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-500/20">
                        <Activity className="text-white animate-pulse" size={32} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="px-2 py-0.5 bg-rose-500 text-white text-[9px] font-black uppercase tracking-[0.2em] rounded border border-rose-400/20">Critical Care</span>
                            <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest ml-2">{patient?.bed}</span>
                        </div>
                        <h2 className="text-2xl font-black text-white tracking-tight uppercase italic">{patient?.name}</h2>
                        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">Diagnosis: {patient?.diagnose}</p>
                    </div>
                </div>

                <div className="flex items-center gap-4 relative z-10">
                    <button className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">
                        <Clock size={16} /> Stream History
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={submitting}
                        className="flex items-center gap-2 px-10 py-3 bg-olive-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-olive-600/30 hover:bg-olive-700 transition-all active:scale-95 disabled:opacity-70"
                    >
                        {submitting ? "Syncing..." : <><Save size={16} /> Commit Entry</>}
                    </button>
                </div>
            </div>

            <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Vitals Entry */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                            { label: "Temp (°C)", icon: Thermometer, color: "text-rose-600", bg: "bg-rose-50", value: vitals.temp, field: 'temp' },
                            { label: "BP (mmHg)", icon: Activity, color: "text-blue-600", bg: "bg-blue-50", value: vitals.bp, field: 'bp' },
                            { label: "Heart Rate", icon: Activity, color: "text-emerald-600", bg: "bg-emerald-50", value: vitals.hr, field: 'hr' },
                            { label: "O2 Sat (%)", icon: Droplet, color: "text-purple-600", bg: "bg-purple-50", value: vitals.o2sat, field: 'o2sat' },
                            { label: "Resp Rate", icon: Wind, color: "text-teal-600", bg: "bg-teal-50", value: vitals.rr, field: 'rr' },
                            { label: "MAP", icon: Activity, color: "text-orange-600", bg: "bg-orange-50", value: vitals.map, field: 'map' },
                        ].map((item, i) => (
                            <div key={i} className="bg-slate-50 border border-slate-100 p-5 rounded-3xl group/item hover:border-olive-400 transition-all">
                                <div className="flex items-center justify-between mb-3 text-slate-400">
                                    <div className={`${item.bg} ${item.color} p-2.5 rounded-xl group-hover/item:scale-110 transition-transform`}>
                                        <item.icon size={16} />
                                    </div>
                                    <span className="text-[8px] font-black uppercase tracking-widest group-hover/item:text-olive-600 transition-colors">Sentinel Active</span>
                                </div>
                                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">{item.label}</label>
                                <input
                                    type="text"
                                    value={item.value}
                                    onChange={(e) => setVitals({ ...vitals, [item.field]: e.target.value })}
                                    className="text-xl font-black text-slate-900 bg-transparent outline-none w-full border-b-2 border-transparent focus:border-olive-500 transition-all"
                                />
                            </div>
                        ))}
                    </div>

                    {/* Ventilator Settings */}
                    <div className="bg-[#020617] p-10 rounded-[48px] text-white shadow-2xl relative overflow-hidden group/vent">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500/0 via-teal-500 to-teal-500/0 opacity-50" />

                        <div className="flex items-center justify-between mb-10 relative z-10">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-teal-500/10 border border-teal-500/20 text-teal-400 rounded-2xl flex items-center justify-center">
                                    <Wind size={24} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-black uppercase tracking-[0.2em]">Ventilator Matrix</h3>
                                    <p className="text-[9px] font-bold text-slate-500 uppercase">Synchronized Breathing Node</p>
                                </div>
                            </div>
                            <span className="px-4 py-1.5 bg-teal-500 text-white text-[9px] font-black uppercase tracking-[0.3em] rounded-lg">Mode: AC/VC</span>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 relative z-10">
                            {[
                                { label: "FiO2", val: vent.fiO2, unit: "%", field: "fiO2" },
                                { label: "PEEP", val: vent.peep, unit: "cmH2O", field: "peep" },
                                { label: "Tidal Vol", val: vent.tidalVolume, unit: "mL", field: "tidalVolume" },
                                { label: "Rate", val: vent.rate, unit: "BPM", field: "rate" },
                            ].map((v, i) => (
                                <div key={i} className="space-y-2 group/val">
                                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">{v.label}</p>
                                    <div className="flex items-end gap-1">
                                        <input
                                            className="text-3xl font-black text-white bg-transparent w-full outline-none focus:text-teal-400 transition-colors"
                                            value={v.val}
                                            onChange={(e) => setVent({ ...vent, [v.field]: Number(e.target.value) })}
                                        />
                                        <span className="text-[10px] text-teal-500 font-bold mb-1.5 uppercase tracking-widest">{v.unit}</span>
                                    </div>
                                    <div className="h-0.5 w-full bg-slate-800 rounded-full group-hover/val:bg-teal-500/30 transition-all" />
                                </div>
                            ))}
                        </div>
                        <Activity className="absolute bottom-[-10%] right-[-5%] text-teal-500/5 rotate-12" size={200} />
                    </div>
                </div>

                {/* Score & Intake/Output */}
                <div className="space-y-8">
                    <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm space-y-10 group/scores">
                        <div>
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-3 bg-olive-50 text-olive-600 rounded-xl">
                                    <Brain size={20} />
                                </div>
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Neurological Sentinel</h3>
                            </div>
                            <div className="space-y-6">
                                <div>
                                    <div className="flex justify-between items-center mb-3">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">GCS Score Matrix</p>
                                        <span className="text-xs font-black text-olive-700 uppercase italic">E4 V4 M6 = 14</span>
                                    </div>
                                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden p-0.5">
                                        <div className="h-full bg-olive-500 w-[93%] rounded-full shadow-lg shadow-olive-500/20 shadow-glow animate-pulse"></div>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">RASS Sedation Scale</p>
                                    <select className="w-full bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs font-black italic uppercase tracking-tight outline-none focus:ring-4 focus:ring-olive-500/5 focus:border-olive-400 transition-all">
                                        <option value="0">0: Alert and Calm</option>
                                        <option value="-1">-1: Drowsy</option>
                                        <option value="+1">+1: Restless</option>
                                        <option value="-2">-2: Light Sedation</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="pt-10 border-t border-slate-50">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                                    <Droplet size={20} />
                                </div>
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Fluid Dynamics</h3>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-5 bg-blue-50/50 rounded-3xl border border-blue-100 hover:bg-blue-50 transition-colors cursor-pointer">
                                    <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-1">Intake</p>
                                    <p className="text-2xl font-black text-blue-900 tracking-tighter">1,250 <span className="text-[10px] font-bold">mL</span></p>
                                </div>
                                <div className="p-5 bg-orange-50/50 rounded-3xl border border-orange-100 hover:bg-orange-50 transition-colors cursor-pointer">
                                    <p className="text-[9px] font-black text-orange-400 uppercase tracking-widest mb-1">Output</p>
                                    <p className="text-2xl font-black text-orange-900 tracking-tighter">850 <span className="text-[10px] font-bold">mL</span></p>
                                </div>
                            </div>
                            <div className="mt-6 p-5 bg-slate-900 rounded-3xl flex items-center justify-between shadow-xl shadow-slate-900/10 group/balance">
                                <div className="flex items-center gap-2">
                                    <RefreshCw size={12} className="text-slate-500 animate-spin-slow" />
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Net Hydration</span>
                                </div>
                                <span className="text-emerald-400 text-lg font-black tracking-tighter font-mono group-hover:scale-110 transition-transform">+400 mL</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-rose-50 border border-rose-100 p-8 rounded-[48px] flex items-start gap-5 shadow-sm relative overflow-hidden group/alert">
                        <div className="absolute top-0 left-0 w-1 h-full bg-rose-500" />
                        <AlertTriangle className="text-rose-500 shrink-0 group-hover:rotate-12 transition-transform" size={24} />
                        <div>
                            <h4 className="text-[10px] font-black text-rose-900 uppercase tracking-[0.2em] mb-2">Clinical Trigger Active</h4>
                            <p className="text-xs text-rose-700 font-bold leading-relaxed italic">
                                MAP (93) is stable but surveillance is active. Respiratory Rate trending towards tachypnea (18). Monitor SpO2 closely.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
