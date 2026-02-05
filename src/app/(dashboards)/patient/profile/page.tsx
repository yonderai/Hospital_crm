"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
    User,
    Mail,
    Phone,
    Calendar,
    MapPin,
    ShieldCheck,
    Fingerprint,
    Activity,
    Clock,
    Camera
} from "lucide-react";
import { format } from "date-fns";

export default function PatientProfilePage() {
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [editForm, setEditForm] = useState<any>({});
    const [message, setMessage] = useState({ text: "", type: "" });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/user/profile");
            const data = await res.json();
            if (data) {
                setProfile(data);
                // Initialize edit form with current data
                setEditForm({
                    firstName: data.firstName || "",
                    lastName: data.lastName || "",
                    dob: data.details.dob ? format(new Date(data.details.dob), 'yyyy-MM-dd') : "",
                    gender: data.details.gender || "",
                    bloodType: data.details.bloodType || "",
                    phone: data.details.phone || "",
                    address: {
                        street: data.details.address?.street || "",
                        city: data.details.address?.city || "",
                        state: data.details.address?.state || "",
                        zipCode: data.details.address?.zipCode || ""
                    }
                });
            }
        } catch (err) {
            console.error("Failed to fetch profile", err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsUpdating(true);
            setMessage({ text: "", type: "" });
            const res = await fetch("/api/user/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editForm)
            });
            const result = await res.json();
            if (res.ok) {
                setMessage({ text: "Profile updated successfully!", type: "success" });
                await fetchProfile(); // Refresh data
                setTimeout(() => setIsEditModalOpen(false), 2000);
            } else {
                setMessage({ text: result.error || "Update failed", type: "error" });
            }
        } catch (err) {
            setMessage({ text: "An unexpected error occurred", type: "error" });
        } finally {
            setIsUpdating(false);
        }
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-slate-300 font-black uppercase tracking-[0.3em] animate-pulse">
                        Synchronizing Profile...
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    if (!profile) {
        return (
            <DashboardLayout>
                <div className="p-12 text-center text-slate-500 font-bold">
                    Profile not found. Please contact support.
                </div>
            </DashboardLayout>
        );
    }

    const { details } = profile;

    return (
        <DashboardLayout>
            <div className="max-w-6xl mx-auto space-y-12">
                {/* Header Section */}
                <div className="relative">
                    <div className="h-48 bg-gradient-to-r from-olive-600 to-olive-400 rounded-[40px] shadow-2xl overflow-hidden relative">
                        <div className="absolute inset-0 opacity-10 flex items-center justify-center">
                            <Activity size={300} strokeWidth={1} />
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row items-end gap-8 px-12 -mt-16">
                        <div className="relative group">
                            <div className="w-40 h-40 rounded-[48px] bg-white p-2 shadow-2xl">
                                <div className="w-full h-full rounded-[40px] bg-olive-100 flex items-center justify-center text-olive-600 border border-olive-200">
                                    <span className="text-6xl font-black">{profile.firstName?.[0]}{profile.lastName?.[0]}</span>
                                </div>
                            </div>
                            <button className="absolute bottom-4 right-4 w-10 h-10 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform border-4 border-white">
                                <Camera size={18} />
                            </button>
                        </div>

                        <div className="flex-1 pb-4">
                            <h2 className="text-4xl font-black text-slate-900 tracking-tight italic uppercase">{profile.name}</h2>
                            <div className="flex items-center gap-4 mt-2">
                                <span className="px-4 py-1.5 bg-olive-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-olive-600/20">
                                    {profile.role}
                                </span>
                                <div className="flex items-center gap-2 text-slate-400 font-bold text-xs">
                                    <Clock size={14} />
                                    Account since {profile.createdAt ? format(new Date(profile.createdAt), 'MMMM yyyy') : 'N/A'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Left Column: Personal Stats */}
                    <div className="space-y-8">
                        {/* ID Card */}
                        <div className="bg-slate-900 rounded-[40px] p-8 text-white relative overflow-hidden shadow-2xl group">
                            <div className="relative z-10">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-olive-400 mb-6 italic">Patient Identification</h4>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">Medical Record Number</p>
                                        <p className="text-2xl font-black italic tracking-tighter">{details.mrn || 'N/A'}</p>
                                    </div>
                                    <div className="pt-4 flex items-center gap-3">
                                        <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                                            <Fingerprint size={16} className="text-olive-400" />
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest opacity-60 italic">Digitally Verified</span>
                                    </div>
                                </div>
                            </div>
                            <Activity size={120} className="absolute bottom-[-10%] right-[-10%] text-white/5 transition-transform group-hover:scale-110 duration-700" />
                        </div>

                        {/* Quick Stats */}
                        <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-8 space-y-6">
                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 italic">Physical Metadata</h4>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Blood Group</p>
                                    <p className="text-lg font-black text-slate-900 uppercase italic">{details.bloodType || 'N/A'}</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Gender</p>
                                    <p className="text-lg font-black text-slate-900 uppercase italic">{details.gender || 'N/A'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Detailed Info */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Personal Info */}
                        <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
                            <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-olive-100 rounded-xl flex items-center justify-center text-olive-600">
                                        <User size={20} />
                                    </div>
                                    <h3 className="text-xl font-black text-slate-900 tracking-tight italic uppercase">Personal Profile</h3>
                                </div>
                            </div>

                            <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <Calendar size={12} className="text-olive-600" />
                                        Date of Birth
                                    </p>
                                    <p className="text-lg font-bold text-slate-900">{details.dob ? format(new Date(details.dob), 'MMMM dd, yyyy') : 'N/A'}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <Activity size={12} className="text-olive-600" />
                                        Chronological Age
                                    </p>
                                    <p className="text-lg font-bold text-slate-900 underline decoration-olive-300 underline-offset-4 decoration-2">
                                        {profile.details.age || 'N/A'} Old
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <Phone size={12} className="text-olive-600" />
                                        Contact Primary
                                    </p>
                                    <p className="text-lg font-bold text-slate-900">{details.phone || 'N/A'}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <Mail size={12} className="text-olive-600" />
                                        Email Protocol
                                    </p>
                                    <p className="text-lg font-bold text-slate-900 lowercase">{profile.email}</p>
                                </div>
                                <div className="md:col-span-2 space-y-1">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <MapPin size={12} className="text-olive-600" />
                                        Residential Address
                                    </p>
                                    <p className="text-lg font-bold text-slate-900">
                                        {details.address
                                            ? `${details.address.street}, ${details.address.city}, ${details.address.state} ${details.address.zipCode}`
                                            : 'No address provided'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Professional/Edit CTA */}
                        <div className="flex justify-end gap-4">
                            <button className="px-8 py-3 bg-slate-100 text-slate-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all border border-slate-200">
                                Request Access Log
                            </button>
                            <button
                                onClick={() => setIsEditModalOpen(true)}
                                className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-olive-600 transition-all shadow-xl shadow-slate-900/20"
                            >
                                Correct Registry Data
                            </button>
                        </div>

                        {/* Security & Insurance */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-8">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 italic flex items-center gap-2">
                                    <ShieldCheck size={14} className="text-blue-500" />
                                    Active Insurance
                                </h4>
                                {details.insurance ? (
                                    <div className="space-y-2">
                                        <p className="text-sm font-black text-slate-900 italic uppercase">{details.insurance.provider}</p>
                                        <p className="text-xs font-bold text-slate-500">Policy: {details.insurance.policyNumber}</p>
                                    </div>
                                ) : (
                                    <p className="text-sm font-bold text-slate-300 italic">No insurance records active</p>
                                )}
                            </div>

                            <div className="bg-olive-50 rounded-[40px] border border-olive-100 shadow-sm p-8">
                                <h4 className="text-[10px] font-black text-olive-400 uppercase tracking-widest mb-6 italic flex items-center gap-2">
                                    <Fingerprint size={14} />
                                    Security Status
                                </h4>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-black text-olive-900 uppercase">Identity Verified</span>
                                    <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-lg shadow-emerald-500/50" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* EDIT PROFILE MODAL */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6 animate-in fade-in">
                    <div className="bg-white rounded-[40px] w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col">
                        <div className="bg-slate-900 p-8 flex justify-between items-center shrink-0">
                            <div>
                                <h3 className="text-2xl font-black text-white italic uppercase leading-none">Correct registry data</h3>
                                <p className="text-[10px] font-black text-olive-400 uppercase tracking-[0.3em] mt-2">Update Clinical Identity Node</p>
                            </div>
                            <button
                                onClick={() => setIsEditModalOpen(false)}
                                className="w-10 h-10 bg-white/10 text-white rounded-2xl flex items-center justify-center hover:bg-white/20 transition-all"
                            >
                                <span className="text-2xl font-light">×</span>
                            </button>
                        </div>

                        <form onSubmit={handleUpdate} className="p-8 space-y-6 overflow-y-auto custom-scrollbar">
                            {message.text && (
                                <div className={`p-4 rounded-2xl font-bold text-sm flex items-center gap-3 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'
                                    }`}>
                                    {message.type === 'success' ? <ShieldCheck size={18} /> : <Activity size={18} />}
                                    {message.text}
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-2">First Name</label>
                                    <input
                                        type="text"
                                        value={editForm.firstName}
                                        onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-slate-900 font-bold outline-none focus:ring-2 focus:ring-olive-500 transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-2">Last Name</label>
                                    <input
                                        type="text"
                                        value={editForm.lastName}
                                        onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-slate-900 font-bold outline-none focus:ring-2 focus:ring-olive-500 transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-2">Date of Birth</label>
                                    <input
                                        type="date"
                                        value={editForm.dob}
                                        onChange={(e) => setEditForm({ ...editForm, dob: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-slate-900 font-bold outline-none focus:ring-2 focus:ring-olive-500 transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-2">Phone</label>
                                    <input
                                        type="tel"
                                        maxLength={10}
                                        value={editForm.phone}
                                        onChange={(e) => {
                                            const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                                            setEditForm({ ...editForm, phone: val });
                                        }}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-slate-900 font-bold outline-none focus:ring-2 focus:ring-olive-500 transition-all font-mono tracking-widest"
                                        placeholder="XXXXXXXXXX"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-2">Gender</label>
                                    <select
                                        value={editForm.gender}
                                        onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-slate-900 font-bold outline-none focus:ring-2 focus:ring-olive-500 transition-all"
                                    >
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-2">Blood Type</label>
                                    <select
                                        value={editForm.bloodType}
                                        onChange={(e) => setEditForm({ ...editForm, bloodType: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-slate-900 font-bold outline-none focus:ring-2 focus:ring-olive-500 transition-all"
                                    >
                                        <option value="A+">A+</option>
                                        <option value="A-">A-</option>
                                        <option value="B+">B+</option>
                                        <option value="B-">B-</option>
                                        <option value="AB+">AB+</option>
                                        <option value="AB-">AB-</option>
                                        <option value="O+">O+</option>
                                        <option value="O-">O-</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-slate-100">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Residential Address</h4>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="col-span-2 space-y-2">
                                        <label className="text-[10px] font-bold text-slate-700 uppercase tracking-widest block ml-2">Street Address</label>
                                        <input
                                            type="text"
                                            value={editForm.address?.street || ""}
                                            onChange={(e) => setEditForm({ ...editForm, address: { ...editForm.address, street: e.target.value } })}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-slate-900 font-bold outline-none focus:ring-2 focus:ring-olive-500 transition-all"
                                            placeholder="123 Medicore Blvd"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-slate-700 uppercase tracking-widest block ml-2">City</label>
                                        <input
                                            type="text"
                                            value={editForm.address?.city || ""}
                                            onChange={(e) => setEditForm({ ...editForm, address: { ...editForm.address, city: e.target.value } })}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-slate-900 font-bold outline-none focus:ring-2 focus:ring-olive-500 transition-all"
                                            placeholder="Metropolis"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-slate-700 uppercase tracking-widest block ml-2">State</label>
                                        <input
                                            type="text"
                                            value={editForm.address?.state || ""}
                                            onChange={(e) => setEditForm({ ...editForm, address: { ...editForm.address, state: e.target.value } })}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-slate-900 font-bold outline-none focus:ring-2 focus:ring-olive-500 transition-all"
                                            placeholder="NY"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-slate-700 uppercase tracking-widest block ml-2">Zip Code</label>
                                        <input
                                            type="text"
                                            value={editForm.address?.zipCode || ""}
                                            onChange={(e) => setEditForm({ ...editForm, address: { ...editForm.address, zipCode: e.target.value } })}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-slate-900 font-bold outline-none focus:ring-2 focus:ring-olive-500 transition-all"
                                            placeholder="10001"
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isUpdating}
                                className="w-full py-5 bg-slate-900 text-white rounded-[24px] font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-olive-600 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                            >
                                {isUpdating ? 'Synchronizing State...' : 'Commit Registry Updates'}
                                <Activity size={18} className={isUpdating ? 'animate-spin' : ''} />
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
