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
    X,
    CheckCircle2
} from "lucide-react";

export default function PatientRegistration() {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        dob: "",
        gender: "Male",
        contact: { phone: "", email: "", address: "" },
        emergencyContact: { name: "", phone: "", relation: "" },
        insuranceInfo: { provider: "", policyNumber: "", groupNumber: "" },
        bloodType: "O+",
        mrn: "MRN" + Math.floor(10000 + Math.random() * 90000) // Auto-gen for now
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, section?: string, field?: string) => {
        const value = e.target.value;
        if (section && field) {
            setFormData(prev => ({
                ...prev,
                [section]: {
                    ...(prev as any)[section],
                    [field]: value
                }
            }));
        } else {
            setFormData(prev => ({ ...prev, [e.target.name]: value }));
        }
    };

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
                // Optional: reset form or keep it for next entry?
                // setFormData({ ...initialState, mrn: newMRN });
                setTimeout(() => setSuccess(false), 3000);
            } else {
                const err = await res.json();
                alert("Error: " + err.error);
            }
        } catch (err) {
            console.error(err);
            alert("Failed to register patient");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="max-w-4xl mx-auto p-8 bg-white rounded-3xl shadow-xl border border-green-100 flex flex-col items-center justify-center py-20">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-6">
                    <CheckCircle2 size={40} />
                </div>
                <h2 className="text-2xl font-black text-slate-900">Registration Successful</h2>
                <p className="text-slate-500 mt-2 text-center">Patient MRN: <span className="font-bold text-slate-900">{formData.mrn}</span></p>
                <button onClick={() => { setSuccess(false); setFormData(prev => ({ ...prev, mrn: "MRN" + Math.floor(10000 + Math.random() * 90000) })); }} className="mt-8 px-8 py-3 bg-slate-900 text-white rounded-xl font-bold uppercase tracking-widest text-xs">
                    Register Another
                </button>
            </div>
        )
    }

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
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">MRN (Auto)</label>
                            <input disabled value={formData.mrn} className="w-full bg-slate-100 border border-slate-200 p-3 rounded-xl text-slate-500 font-medium cursor-not-allowed" />
                        </div>
                        <div className="col-span-1 space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">First Name</label>
                            <input required name="firstName" value={formData.firstName} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:ring-4 focus:ring-olive-600/5 focus:border-olive-600 outline-none transition-all text-sm font-medium" />
                        </div>
                        <div className="col-span-1 space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Last Name</label>
                            <input required name="lastName" value={formData.lastName} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:ring-4 focus:ring-olive-600/5 focus:border-olive-600 outline-none transition-all text-sm font-medium" />
                        </div>
                        <div className="col-span-1 space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Date of Birth</label>
                            <input required type="date" name="dob" value={formData.dob} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:ring-4 focus:ring-olive-600/5 focus:border-olive-600 outline-none transition-all text-sm font-medium" />
                        </div>
                        <div className="col-span-1 space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Gender</label>
                            <select name="gender" value={formData.gender} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:ring-4 focus:ring-olive-600/5 focus:border-olive-600 outline-none transition-all text-sm font-medium">
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
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
                                <input required value={formData.contact.phone} onChange={(e) => handleChange(e, 'contact', 'phone')} className="w-full bg-slate-50 border border-slate-200 p-3 pl-10 rounded-xl outline-none text-sm font-medium" placeholder="+1 (555) 000-0000" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Email Node</label>
                            <div className="relative">
                                <Mail size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input required type="email" value={formData.contact.email} onChange={(e) => handleChange(e, 'contact', 'email')} className="w-full bg-slate-50 border border-slate-200 p-3 pl-10 rounded-xl outline-none text-sm font-medium" placeholder="patient@client.net" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Physical Address</label>
                            <input required value={formData.contact.address} onChange={(e) => handleChange(e, 'contact', 'address')} className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl outline-none text-sm font-medium" placeholder="Street, City, State, ZIP" />
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
                            <input value={formData.insuranceInfo.provider} onChange={(e) => handleChange(e, 'insuranceInfo', 'provider')} className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl outline-none text-sm font-medium" placeholder="e.g. Blue Cross" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Policy Number</label>
                            <input value={formData.insuranceInfo.policyNumber} onChange={(e) => handleChange(e, 'insuranceInfo', 'policyNumber')} className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl outline-none text-sm font-medium" placeholder="POL-XXX-XXXX" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Blood Type</label>
                            <select name="bloodType" value={formData.bloodType} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl outline-none text-sm font-medium">
                                <option value="O+">O+</option><option value="O-">O-</option>
                                <option value="A+">A+</option><option value="A-">A-</option>
                                <option value="B+">B+</option><option value="B-">B-</option>
                                <option value="AB+">AB+</option><option value="AB-">AB-</option>
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
