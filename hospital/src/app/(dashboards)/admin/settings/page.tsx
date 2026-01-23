"use client";

import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
    Settings,
    Shield,
    Bell,
    Globe,
    Lock,
    Save,
    ToggleLeft,
    ToggleRight,
    Building2,
    Mail
} from "lucide-react";

export default function AdminSettingsPage() {
    const [hospitalName, setHospitalName] = useState("Medicore Enterprise Hospital");
    const [mfaEnabled, setMfaEnabled] = useState(true);
    const [auditLogging, setAuditLogging] = useState(true);
    const [maintenanceMode, setMaintenanceMode] = useState(false);

    return (
        <DashboardLayout>
            <div className="space-y-10 max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">System Configuration</h2>
                        <p className="text-slate-500 text-sm font-medium mt-1 uppercase tracking-widest">GLOBAL PREFERENCES • SECURITY POLICIES</p>
                    </div>
                    <button className="flex items-center gap-2 px-6 py-3 bg-olive-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-olive-600/20 hover:bg-olive-800 transition-all">
                        <Save size={16} /> Save Changes
                    </button>
                </div>

                {/* Profile Section */}
                <div className="bg-white rounded-[40px] border border-slate-100 p-8 shadow-sm">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center">
                            <Building2 size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-slate-900 tracking-tight">Hospital Profile</h3>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Public Facing Information</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Institution Name</label>
                            <input
                                value={hospitalName}
                                onChange={(e) => setHospitalName(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 font-bold text-slate-900 focus:outline-none focus:border-olive-400 transition-colors"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Contact Email</label>
                            <input
                                defaultValue="admin@medicore.global"
                                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 font-bold text-slate-900 focus:outline-none focus:border-olive-400 transition-colors"
                            />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Address</label>
                            <input
                                defaultValue="124 Medical Center Dr, New York, NY 10001"
                                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 font-bold text-slate-900 focus:outline-none focus:border-olive-400 transition-colors"
                            />
                        </div>
                    </div>
                </div>

                {/* Security Section */}
                <div className="bg-white rounded-[40px] border border-slate-100 p-8 shadow-sm">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center">
                            <Shield size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-slate-900 tracking-tight">Security Protocols</h3>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Access Control & Compliance</p>
                        </div>
                    </div>
                    <div className="space-y-6">
                        <ToggleItem
                            label="Enforce Multi-Factor Authentication (MFA)"
                            desc="Require all staff to verify identity via 2FA app."
                            active={mfaEnabled}
                            onClick={() => setMfaEnabled(!mfaEnabled)}
                        />
                        <ToggleItem
                            label="Strict Audit Logging"
                            desc="Log every read/write action to immutable ledger."
                            active={auditLogging}
                            onClick={() => setAuditLogging(!auditLogging)}
                        />
                        <ToggleItem
                            label="Emergency Maintenance Mode"
                            desc="Lockdown system access for non-admins."
                            active={maintenanceMode}
                            onClick={() => setMaintenanceMode(!maintenanceMode)}
                            danger
                        />
                    </div>
                </div>

                {/* Feature Flags */}
                <div className="bg-white rounded-[40px] border border-slate-100 p-8 shadow-sm">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-purple-50 text-purple-500 rounded-2xl flex items-center justify-center">
                            <Globe size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-slate-900 tracking-tight">Feature Flags</h3>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Module Availability</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FlagItem label="Patient Portal Access" active />
                        <FlagItem label="Telemedicine Module" active={false} />
                        <FlagItem label="AI Diagnostics Beta" active={false} />
                        <FlagItem label="External API Access" active />
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

function ToggleItem({ label, desc, active, onClick, danger }: any) {
    return (
        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div>
                <p className={`font-black text-sm tracking-tight ${danger ? 'text-red-600' : 'text-slate-900'}`}>{label}</p>
                <p className="text-xs font-medium text-slate-400 mt-1">{desc}</p>
            </div>
            <button onClick={onClick} className={`transition-colors ${active ? 'text-olive-600' : 'text-slate-300'}`}>
                {active ? <ToggleRight size={40} fill="currentColor" className="text-olive-100" /> : <ToggleLeft size={40} />}
            </button>
        </div>
    );
}

function FlagItem({ label, active }: any) {
    return (
        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 opacity-80 hover:opacity-100 transition-opacity">
            <span className="font-bold text-sm text-slate-700">{label}</span>
            <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-500'}`}>
                {active ? 'Active' : 'Disabled'}
            </div>
        </div>
    )
}
