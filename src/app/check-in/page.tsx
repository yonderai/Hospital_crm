"use client";

import { useState } from "react";
import { CheckCircle2, User, Phone, MapPin, Activity } from "lucide-react";

export default function CheckInPage() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        firstName: "", lastName: "", age: "", gender: "Male", phone: "", address: "", reason: ""
    });
    const [successData, setSuccessData] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch("/api/patients/self-register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (res.ok) {
                setSuccessData(data.patient);
                setStep(2);
            } else {
                alert("Registration failed. Please try again or visit the desk.");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (step === 2 && successData) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
                <div className="bg-white p-10 rounded-[48px] w-full max-w-md text-center shadow-xl space-y-6">
                    <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 size={40} />
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight italic uppercase">Check-In Successful!</h1>
                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Your Patient ID</p>
                        <p className="text-2xl font-black text-slate-900 mt-2">{successData.mrn}</p>
                    </div>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">
                        Welcome, <b>{successData.name}</b>. Please proceed to the <b>Front Desk</b> and show this screen or mention your Patient ID.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F1F5F9] flex flex-col items-center justify-center p-6 font-sans">
            <div className="bg-white w-full max-w-md rounded-[40px] shadow-2xl overflow-hidden">
                <div className="bg-slate-900 p-8 text-white text-center">
                    <h1 className="text-2xl font-black italic tracking-tight uppercase">Hospital Express Check-In</h1>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-2">Self-Registration Portal</p>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">First Name</label>
                            <input required className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-slate-900 transition-all"
                                value={formData.firstName} onChange={e => setFormData({ ...formData, firstName: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Last Name</label>
                            <input required className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-slate-900 transition-all"
                                value={formData.lastName} onChange={e => setFormData({ ...formData, lastName: e.target.value })} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Age</label>
                            <input required type="number" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-slate-900 transition-all"
                                value={formData.age} onChange={e => setFormData({ ...formData, age: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Gender</label>
                            <select className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-slate-900 transition-all"
                                value={formData.gender} onChange={e => setFormData({ ...formData, gender: e.target.value })}>
                                <option>Male</option>
                                <option>Female</option>
                                <option>Other</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 flex items-center gap-2"><Phone size={12} /> Phone Number</label>
                        <input required type="tel" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-slate-900 transition-all"
                            value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 flex items-center gap-2"><MapPin size={12} /> Address</label>
                        <input className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-slate-900 transition-all"
                            placeholder="Optional"
                            value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 flex items-center gap-2"><Activity size={12} /> Reason for Visit</label>
                        <textarea required rows={2} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-medium outline-none resize-none focus:ring-2 focus:ring-slate-900 transition-all"
                            value={formData.reason} onChange={e => setFormData({ ...formData, reason: e.target.value })} />
                    </div>

                    <button type="submit" disabled={loading} className="w-full py-5 bg-slate-900 text-white rounded-[24px] font-black text-sm uppercase tracking-[0.2em] shadow-xl hover:bg-slate-800 transition-all active:scale-[0.98] disabled:opacity-70">
                        {loading ? "Registering..." : "Submit Registration"}
                    </button>
                </form>
            </div>

            <p className="mt-8 text-[10px] font-bold text-slate-400 text-center max-w-xs leading-relaxed uppercase">
                By submitting, you agree to the Hospital's data processing policies.
            </p>
        </div>
    );
}
