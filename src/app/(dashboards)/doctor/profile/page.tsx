"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
    User,
    Mail,
    Phone,
    Calendar,
    Briefcase,
    ShieldCheck,
    Award,
    Clock,
    Camera,
    Stethoscope,
    Building,
    Activity
} from "lucide-react";
import { format } from "date-fns";


export default function StaffProfilePage() {
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
                // Initialize edit form
                setEditForm({
                    firstName: data.firstName,
                    lastName: data.lastName,
                    mobile: data.details.mobile || "",
                    specialization: data.details.specialization || "",
                    department: data.details.department || ""
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
                await fetchProfile();
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
                        Authenticating Credentials...
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    if (!profile) {
        return (
            <DashboardLayout>
                <div className="p-12 text-center text-slate-500 font-bold">
                    Staff profile not found.
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
                    <div className="h-48 bg-slate-900 rounded-[40px] shadow-2xl overflow-hidden relative border-b-8 border-olive-500">
                        <div className="absolute inset-0 opacity-5 flex items-center justify-center">
                            <Stethoscope size={300} strokeWidth={1} />
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row items-end gap-8 px-12 -mt-16">
                        <div className="relative group">
                            <div className="w-40 h-40 rounded-[48px] bg-white p-2 shadow-2xl">
                                <div className="w-full h-full rounded-[40px] bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200">
                                    <span className="text-6xl font-black">{profile.firstName?.[0]}{profile.lastName?.[0]}</span>
                                </div>
                            </div>
                            <button className="absolute bottom-4 right-4 w-10 h-10 bg-olive-600 text-white rounded-2xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform border-4 border-white">
                                <Camera size={18} />
                            </button>
                        </div>

                        <div className="flex-1 pb-4">
                            <h2 className="text-4xl font-black text-slate-900 tracking-tight italic uppercase">{profile.name}</h2>
                            <div className="flex items-center gap-4 mt-2">
                                <span className="px-4 py-1.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg">
                                    {profile.role} • {details.department || 'General Medicine'}
                                </span>
                                <div className="flex items-center gap-2 text-slate-400 font-bold text-xs">
                                    <Award size={14} className="text-olive-600" />
                                    Employee ID: {details.employeeId || 'N/A'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Left Column: Stats & Shift */}
                    <div className="space-y-8">
                        {/* Status Card */}
                        <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-8 space-y-6">
                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 italic">Operation Meta</h4>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-olive-50 rounded-2xl border border-olive-100">
                                    <div className="flex items-center gap-3">
                                        <Clock size={18} className="text-olive-600" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-olive-900">Current Shift</span>
                                    </div>
                                    <span className="text-xs font-bold text-olive-700 italic">{details.shift || 'Morning'}</span>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <div className="flex items-center gap-3">
                                        <Building size={18} className="text-slate-400" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Facility Base</span>
                                    </div>
                                    <span className="text-xs font-bold text-slate-800 italic">Yonder General</span>
                                </div>
                            </div>
                        </div>

                        {/* Professional Credentials */}
                        <div className="bg-slate-900 rounded-[40px] p-8 text-white shadow-2xl">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-olive-400 mb-6 italic">Clinical Credentials</h4>
                            <div className="flex flex-wrap gap-2">
                                {details.credentials?.length > 0 ? details.credentials.map((cred: string, i: number) => (
                                    <span key={i} className="px-3 py-1 bg-white/10 rounded-lg text-[10px] font-bold uppercase tracking-widest italic">{cred}</span>
                                )) : (
                                    <span className="text-[10px] font-bold opacity-40 uppercase tracking-widest italic">No credentials listed</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Detailed Info */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Professional Info */}
                        <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden text-clip">
                            <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-900">
                                        <Briefcase size={20} />
                                    </div>
                                    <h3 className="text-xl font-black text-slate-900 tracking-tight italic uppercase">Professional profile</h3>
                                </div>
                                <button
                                    onClick={() => setIsEditModalOpen(true)}
                                    className="px-6 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-olive-600 transition-all shadow-lg"
                                >
                                    Correct registration data
                                </button>
                            </div>

                            <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <Stethoscope size={12} className="text-olive-600" />
                                        Specialization
                                    </p>
                                    <p className="text-lg font-bold text-slate-900 italic uppercase">
                                        {details.specialization || 'Consultant Physician'}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <Calendar size={12} className="text-olive-600" />
                                        Service Since
                                    </p>
                                    <p className="text-lg font-bold text-slate-900">
                                        {details.joiningDate ? format(new Date(details.joiningDate), 'MMMM dd, yyyy') : 'N/A'}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <Phone size={12} className="text-olive-600" />
                                        SECURE MOBILE LINE
                                    </p>
                                    <p className="text-lg font-bold text-slate-900 tracking-tight">{details.mobile || 'N/A'}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <Mail size={12} className="text-olive-600" />
                                        Internal Comms
                                    </p>
                                    <p className="text-lg font-bold text-slate-900 lowercase underline underline-offset-4 decoration-olive-200">{profile.email}</p>
                                </div>
                                <div className="md:col-span-2 space-y-1 pt-4 border-t border-slate-50">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <Clock size={12} className="text-olive-600" />
                                        Clinical hours
                                    </p>
                                    <p className="text-sm font-bold text-slate-600">
                                        {details.workingHours?.start} - {details.workingHours?.end} • Monday thru Friday
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Security */}
                        <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-8 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                                    <ShieldCheck size={24} />
                                </div>
                                <div>
                                    <h4 className="text-md font-black text-slate-900 uppercase italic leading-none">Access privileges</h4>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">SST encrypted clinical node enabled</p>
                                </div>
                            </div>
                            <div className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                                Fully Verified
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* EDIT PROFILE MODAL */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6 animate-in fade-in">
                    <div className="bg-white rounded-[40px] w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="bg-slate-900 p-8 flex justify-between items-center">
                            <div>
                                <h3 className="text-2xl font-black text-white italic uppercase leading-none">Correct registry data</h3>
                                <p className="text-[10px] font-black text-olive-400 uppercase tracking-[0.3em] mt-2">Update Staff Clinical Node</p>
                            </div>
                            <button
                                onClick={() => setIsEditModalOpen(false)}
                                className="w-10 h-10 bg-white/10 text-white rounded-2xl flex items-center justify-center hover:bg-white/20 transition-all"
                            >
                                <span className="text-2xl font-light">×</span>
                            </button>
                        </div>

                        <form onSubmit={handleUpdate} className="p-8 space-y-6">
                            {message.text && (
                                <div className={`p-4 rounded-2xl font-bold text-sm flex items-center gap-3 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'
                                    }`}>
                                    {message.type === 'success' ? <ShieldCheck size={18} /> : <Award size={18} />}
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
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-2">Mobile</label>
                                    <input
                                        type="text"
                                        value={editForm.mobile}
                                        onChange={(e) => setEditForm({ ...editForm, mobile: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-slate-900 font-bold outline-none focus:ring-2 focus:ring-olive-500 transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-2">Specialization</label>
                                    <input
                                        type="text"
                                        value={editForm.specialization}
                                        onChange={(e) => setEditForm({ ...editForm, specialization: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-slate-900 font-bold outline-none focus:ring-2 focus:ring-olive-500 transition-all"
                                    />
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-2">Department</label>
                                    <input
                                        type="text"
                                        value={editForm.department}
                                        onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-slate-900 font-bold outline-none focus:ring-2 focus:ring-olive-500 transition-all"
                                    />
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
