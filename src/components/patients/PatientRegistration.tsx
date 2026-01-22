"use client";

import { useState } from "react";
import {
    UserPlus,
    MapPin,
    Phone,
    Mail,
    Calendar,
    Shield,
    AlertCircle,
    Save,
    X
} from "lucide-react";

export default function PatientRegistration() {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        dob: "",
        gender: "male",
        contact: { phone: "", email: "", address: "" },
        emergencyContact: { name: "", phone: "", relation: "" },
        insuranceInfo: { provider: "", policyNumber: "", groupNumber: "" },
        bloodType: "O+",
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch("/api/patients", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            if (res.ok) {
                setSuccess(true);
                // Reset form or redirect
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-8 bg-white rounded-3xl shadow-xl border border-slate-100 font-sans">
            <div className="flex items-center justify-between mb-10 pb-6 border-b border-slate-100">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-olive-600 rounded-2xl text-white shadow-lg shadow-olive-600/20">
                        <UserPlus size={28} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Patient Intake</h1>
                        <p className="text-slate-500 text-sm font-medium uppercase tracking-[0.2em] mt-1">New Registration Node</p>
                    </div>
                </div>
                <button className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                    <X size={24} />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-12">
                {/* Basic Demographics */}
                <section className="space-y-6">
                    <div className="flex items-center gap-2 text-olive-800">
                        <Calendar size={18} />
                        <h2 className="text-xs font-black uppercase tracking-widest">Basic Demographics</h2>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="col-span-1 space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">First Name</label>
                            <input required className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:ring-4 focus:ring-olive-600/5 focus:border-olive-600 outline-none transition-all text-sm font-medium" />
                        </div>
                        <div className="col-span-1 space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Last Name</label>
                            <input required className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:ring-4 focus:ring-olive-600/5 focus:border-olive-600 outline-none transition-all text-sm font-medium" />
                        </div>
                        <div className="col-span-1 space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Date of Birth</label>
                            <input required type="date" className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:ring-4 focus:ring-olive-600/5 focus:border-olive-600 outline-none transition-all text-sm font-medium" />
                        </div>
                        <div className="col-span-1 space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Gender</label>
                            <select className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:ring-4 focus:ring-olive-600/5 focus:border-olive-600 outline-none transition-all text-sm font-medium">
                                <option>Male</option>
                                <option>Female</option>
                                <option>Other</option>
                            </select>
                        </div>
                    </div>
                </section>

                {/* Contact Intelligence */}
                <section className="space-y-6">
                    <div className="flex items-center gap-2 text-olive-800">
                        <MapPin size={18} />
                        <h2 className="text-xs font-black uppercase tracking-widest">Contact Intelligence</h2>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Primary Phone</label>
                            <div className="relative">
                                <Phone size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input required className="w-full bg-slate-50 border border-slate-200 p-3 pl-10 rounded-xl outline-none text-sm font-medium" placeholder="+1 (555) 000-0000" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Email Node</label>
                            <div className="relative">
                                <Mail size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input required type="email" className="w-full bg-slate-50 border border-slate-200 p-3 pl-10 rounded-xl outline-none text-sm font-medium" placeholder="patient@client.net" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Physical Address</label>
                            <input required className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl outline-none text-sm font-medium" placeholder="Street, City, State, ZIP" />
                        </div>
                    </div>
                </section>

                {/* Payer Information */}
                <section className="space-y-6">
                    <div className="flex items-center gap-2 text-olive-800">
                        <Shield size={18} />
                        <h2 className="text-xs font-black uppercase tracking-widest">Payer & Claims Data</h2>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Insurance Provider</label>
                            <input className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl outline-none text-sm font-medium" placeholder="e.g. Blue Cross" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Policy Number</label>
                            <input className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl outline-none text-sm font-medium" placeholder="POL-XXX-XXXX" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Blood Type</label>
                            <select className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl outline-none text-sm font-medium">
                                <option>O+</option><option>O-</option><option>A+</option><option>A-</option>
                                <option>B+</option><option>B-</option><option>AB+</option><option>AB-</option>
                            </select>
                        </div>
                    </div>
                </section>

                {/* Action Controls */}
                <div className="pt-8 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-red-500 bg-red-50 px-4 py-2 rounded-xl border border-red-100 animate-pulse">
                        <AlertCircle size={14} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Verify ID Mandatory</span>
                    </div>
                    <div className="flex gap-4">
                        <button type="button" className="px-6 py-3 bg-slate-100 text-slate-600 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all">
                            Reset Form
                        </button>
                        <button type="submit" disabled={loading} className="px-10 py-3 bg-olive-700 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-olive-600/20 hover:bg-olive-800 flex items-center gap-2 transition-all">
                            {loading ? "Processing..." : <><Save size={16} /> Finalize registration</>}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
