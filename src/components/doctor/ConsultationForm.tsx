"use client";
import { useState } from "react";
import { Activity, Thermometer, Heart, Wind, Droplet, FileText, ClipboardList, Stethoscope } from "lucide-react";

export default function ConsultationForm({ patientId, appointmentId, encounterId, onSuccess }: { patientId: string; appointmentId?: string; encounterId?: string; onSuccess: () => void }) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        chiefComplaint: "",
        vitals: { temp: "", bp: "", hr: "", rr: "", spo2: "" },
        soap: { subjective: "", objective: "", assessment: "", plan: "" },
        diagnosis: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch("/api/doctor/consultation", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    patientId,
                    type: "outpatient",
                    chiefComplaint: formData.chiefComplaint,
                    vitals: {
                        temperature: parseFloat(formData.vitals.temp),
                        bloodPressure: formData.vitals.bp,
                        heartRate: parseInt(formData.vitals.hr),
                        respiratoryRate: parseInt(formData.vitals.rr),
                        oxygenSaturation: parseInt(formData.vitals.spo2)
                    },
                    soapNotes: formData.soap,
                    diagnosis: formData.diagnosis.split(",").map(d => d.trim()),
                    status: "closed",
                    appointmentId,
                    encounterId
                })
            });
            if (res.ok) {
                alert("Consultation saved & Billing triggered!");
                onSuccess();
            } else {
                alert("Error saving consultation");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 p-6 bg-white rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="p-2 bg-olive-100 text-olive-600 rounded-lg">
                    <Stethoscope size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-800">Clinical Consultation (SOAP)</h3>
            </div>

            {/* Vitals Section */}
            <div className="space-y-3">
                <label className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <Activity size={16} /> Vital Signs
                </label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 focus-within:border-olive-500 focus-within:ring-1 focus-within:ring-olive-500 transition-all">
                        <div className="flex items-center gap-2 mb-1 text-slate-500">
                            <Thermometer size={14} />
                            <span className="text-xs font-bold">Temp</span>
                        </div>
                        <div className="flex items-end gap-1">
                            <input
                                type="number" step="0.1" required
                                className="w-full bg-transparent text-xl font-black text-slate-900 outline-none p-0"
                                placeholder="--"
                                value={formData.vitals.temp}
                                onChange={e => setFormData({ ...formData, vitals: { ...formData.vitals, temp: e.target.value } })}
                            />
                            <span className="text-xs font-bold text-slate-400 mb-1">°C</span>
                        </div>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 focus-within:border-olive-500 focus-within:ring-1 focus-within:ring-olive-500 transition-all">
                        <div className="flex items-center gap-2 mb-1 text-slate-500">
                            <Activity size={14} />
                            <span className="text-xs font-bold">BP</span>
                        </div>
                        <div className="flex items-end gap-1">
                            <input
                                type="text" required
                                className="w-full bg-transparent text-xl font-black text-slate-900 outline-none p-0"
                                placeholder="120/80"
                                value={formData.vitals.bp}
                                onChange={e => setFormData({ ...formData, vitals: { ...formData.vitals, bp: e.target.value } })}
                            />
                            <span className="text-xs font-bold text-slate-400 mb-1">mmHg</span>
                        </div>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 focus-within:border-olive-500 focus-within:ring-1 focus-within:ring-olive-500 transition-all">
                        <div className="flex items-center gap-2 mb-1 text-slate-500">
                            <Heart size={14} />
                            <span className="text-xs font-bold">HR</span>
                        </div>
                        <div className="flex items-end gap-1">
                            <input
                                type="number" required
                                className="w-full bg-transparent text-xl font-black text-slate-900 outline-none p-0"
                                placeholder="--"
                                value={formData.vitals.hr}
                                onChange={e => setFormData({ ...formData, vitals: { ...formData.vitals, hr: e.target.value } })}
                            />
                            <span className="text-xs font-bold text-slate-400 mb-1">bpm</span>
                        </div>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 focus-within:border-olive-500 focus-within:ring-1 focus-within:ring-olive-500 transition-all">
                        <div className="flex items-center gap-2 mb-1 text-slate-500">
                            <Wind size={14} />
                            <span className="text-xs font-bold">RR</span>
                        </div>
                        <div className="flex items-end gap-1">
                            <input
                                type="number" required
                                className="w-full bg-transparent text-xl font-black text-slate-900 outline-none p-0"
                                placeholder="--"
                                value={formData.vitals.rr}
                                onChange={e => setFormData({ ...formData, vitals: { ...formData.vitals, rr: e.target.value } })}
                            />
                            <span className="text-xs font-bold text-slate-400 mb-1">/min</span>
                        </div>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 focus-within:border-olive-500 focus-within:ring-1 focus-within:ring-olive-500 transition-all">
                        <div className="flex items-center gap-2 mb-1 text-slate-500">
                            <Droplet size={14} />
                            <span className="text-xs font-bold">SpO2</span>
                        </div>
                        <div className="flex items-end gap-1">
                            <input
                                type="number" required
                                className="w-full bg-transparent text-xl font-black text-slate-900 outline-none p-0"
                                placeholder="--"
                                value={formData.vitals.spo2}
                                onChange={e => setFormData({ ...formData, vitals: { ...formData.vitals, spo2: e.target.value } })}
                            />
                            <span className="text-xs font-bold text-slate-400 mb-1">%</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-3">
                <label className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <FileText size={16} /> Chief Complaint
                </label>
                <input
                    type="text" required
                    className="w-full p-4 bg-white border border-slate-200 rounded-xl text-lg font-medium text-slate-900 focus:border-olive-500 focus:ring-1 focus:ring-olive-500 outline-none shadow-sm placeholder:text-slate-300 transition-all"
                    placeholder="e.g. Severe headache having started 2 days ago..."
                    value={formData.chiefComplaint}
                    onChange={e => setFormData({ ...formData, chiefComplaint: e.target.value })}
                />
            </div>

            {/* SOAP Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="col-span-2">
                    <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2 mb-4">
                        <ClipboardList size={16} /> Notes
                    </h4>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-100 transition-all">
                    <label className="block text-xs font-black text-blue-600 mb-2 uppercase tracking-wide">S — Subjective</label>
                    <textarea
                        rows={4}
                        className="w-full text-slate-700 outline-none resize-none placeholder:text-slate-300"
                        placeholder="Patient's history, symptoms, and feelings..."
                        value={formData.soap.subjective}
                        onChange={e => setFormData({ ...formData, soap: { ...formData.soap, subjective: e.target.value } })}
                    />
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm focus-within:border-indigo-400 focus-within:ring-1 focus-within:ring-indigo-100 transition-all">
                    <label className="block text-xs font-black text-indigo-600 mb-2 uppercase tracking-wide">O — Objective</label>
                    <textarea
                        rows={4}
                        className="w-full text-slate-700 outline-none resize-none placeholder:text-slate-300"
                        placeholder="Physical exam findings, lab results, vitals..."
                        value={formData.soap.objective}
                        onChange={e => setFormData({ ...formData, soap: { ...formData.soap, objective: e.target.value } })}
                    />
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm focus-within:border-orange-400 focus-within:ring-1 focus-within:ring-orange-100 transition-all">
                    <label className="block text-xs font-black text-orange-600 mb-2 uppercase tracking-wide">A — Assessment</label>
                    <textarea
                        rows={4}
                        className="w-full text-slate-700 outline-none resize-none placeholder:text-slate-300"
                        placeholder="Diagnosis, differential diagnosis..."
                        value={formData.soap.assessment}
                        onChange={e => setFormData({ ...formData, soap: { ...formData.soap, assessment: e.target.value } })}
                    />
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm focus-within:border-emerald-400 focus-within:ring-1 focus-within:ring-emerald-100 transition-all">
                    <label className="block text-xs font-black text-emerald-600 mb-2 uppercase tracking-wide">P — Plan</label>
                    <textarea
                        rows={4}
                        className="w-full text-slate-700 outline-none resize-none placeholder:text-slate-300"
                        placeholder="Treatment, prescriptions, referrals, follow-up..."
                        value={formData.soap.plan}
                        onChange={e => setFormData({ ...formData, soap: { ...formData.soap, plan: e.target.value } })}
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">Diagnosis</label>
                <input
                    type="text"
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-olive-500 focus:ring-1 focus:ring-olive-500 outline-none shadow-sm"
                    placeholder="e.g. Hypertension, Type 2 Diabetes"
                    value={formData.diagnosis}
                    onChange={e => setFormData({ ...formData, diagnosis: e.target.value })}
                />
                <p className="text-xs text-slate-400 mt-2 ml-1">Separate multiple diagnoses with commas</p>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
                <button type="submit" disabled={loading} className="px-8 py-3 bg-olive-600 text-white font-bold rounded-xl hover:bg-olive-700 disabled:opacity-50 shadow-lg shadow-olive-100 transition-all transform hover:-translate-y-1">
                    {loading ? "Saving..." : "Save Consultation"}
                </button>
            </div>
        </form>
    );
}
