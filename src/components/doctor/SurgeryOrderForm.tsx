"use client";
import { useState } from "react";
import { Calendar, Clock, Activity, Send, CheckCircle2 } from "lucide-react";

export default function SurgeryOrderForm({ patientId, onSuccess }: { patientId: string; onSuccess: () => void }) {
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        procedureName: "",
        scheduledDate: "",
        startTime: "",
        orRoomId: "OR-01",
        notes: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch("/api/doctor/surgery", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...formData, patientId })
            });

            if (res.ok) {
                setSubmitted(true);
                setTimeout(() => {
                    setSubmitted(false);
                    setFormData({
                        procedureName: "",
                        scheduledDate: "",
                        startTime: "",
                        orRoomId: "OR-01",
                        notes: ""
                    });
                    onSuccess();
                }, 2000);
            }
        } catch (error) {
            console.error("Failed to prescribe surgery:", error);
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="bg-olive-50 border border-olive-100 rounded-[32px] p-12 text-center space-y-4 animate-in fade-in zoom-in duration-500">
                <div className="w-20 h-20 bg-olive-600 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-olive-600/20">
                    <CheckCircle2 className="text-white" size={40} />
                </div>
                <h3 className="text-2xl font-black text-slate-900 uppercase italic">Surgery Scheduled</h3>
                <p className="text-slate-500 font-medium tracking-tight">The procedure has been logged in the Surgery Monitor and Patient Record.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center">
                        <Activity className="text-teal-400" size={24} />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-slate-900 tracking-tight italic uppercase leading-none">Prescribe Surgical Procedure</h3>
                        <p className="text-[10px] font-black text-olive-600 mt-2 uppercase tracking-[0.3em]">Operational Readiness Protocol • OR-IX</p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="p-10 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-sans">
                    <div className="space-y-2 lg:col-span-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Procedure Name</label>
                        <input
                            required
                            type="text"
                            placeholder="e.g., Laparoscopic Appendectomy"
                            className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-olive-500/20 outline-none transition-all"
                            value={formData.procedureName}
                            onChange={(e) => setFormData({ ...formData, procedureName: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Scheduled Date</label>
                        <div className="relative">
                            <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                required
                                type="date"
                                className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-olive-500/20 outline-none transition-all"
                                value={formData.scheduledDate}
                                onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Est. Start Time</label>
                        <div className="relative">
                            <Clock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                required
                                type="time"
                                className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-olive-500/20 outline-none transition-all"
                                value={formData.startTime}
                                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Preferred OR Suite</label>
                        <select
                            className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-olive-500/20 outline-none transition-all appearance-none"
                            value={formData.orRoomId}
                            onChange={(e) => setFormData({ ...formData, orRoomId: e.target.value })}
                        >
                            <option value="OR-01">OR Suite 01</option>
                            <option value="OR-02">OR Suite 02</option>
                            <option value="OR-03">OR Suite 03</option>
                            <option value="OR-04">OR Suite 04</option>
                        </select>
                    </div>

                    <div className="space-y-2 lg:col-span-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Pre-operative Instructions / Notes</label>
                        <textarea
                            rows={3}
                            placeholder="Fluid restrictions, anesthesia considerations, special equipment needed..."
                            className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-olive-500/20 outline-none transition-all resize-none"
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        />
                    </div>
                </div>

                <div className="pt-4">
                    <button
                        disabled={loading}
                        type="submit"
                        className="w-full md:w-auto px-12 py-4 bg-slate-900 text-teal-400 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-slate-900/20 hover:bg-olive-700 hover:text-white transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                        {loading ? "Initializing OR Stream..." : (
                            <>
                                <Send size={16} /> Finalize Surgery Order
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
