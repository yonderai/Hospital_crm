
"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import ClinicalProfile from "@/components/doctor/ClinicalProfile";
import {
    Users,
    Calendar,
    Beaker,
    AlertTriangle,
    Plus,
    Activity,
    Search,
    Stethoscope,
    Pill,
    FileText
} from "lucide-react";

const ICON_MAP: Record<string, any> = {
    Calendar,
    Users,
    Beaker,
    AlertTriangle
};

interface Patient {
    _id: string;
    firstName: string;
    lastName: string;
    mrn: string;
    dob: string;
    gender: string;
    contact: { phone: string };
    bloodType: string;
    allergies: string[];
    chronicConditions: string[];
}

export default function DoctorDashboard() {
    const [stats, setStats] = useState<any[]>([]);
    const [patients, setPatients] = useState<Patient[]>([]);
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch stats and Patients
                const [statsRes, patientsRes] = await Promise.all([
                    fetch('/api/doctor/stats'),
                    fetch('/api/doctor/patients')
                ]);

                const statsData = await statsRes.ok ? await statsRes.json() : { stats: [] };

                if (patientsRes.ok) {
                    const patData = await patientsRes.json();
                    setPatients(patData);
                }

                setStats(statsData.stats || []);
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // If a patient is selected, show Clinical Profile
    if (selectedPatient) {
        return (
            <DashboardLayout>
                <ClinicalProfile
                    patient={selectedPatient}
                    onBack={() => setSelectedPatient(null)}
                />
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="space-y-10">
                {/* Header Section */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Physician Workstation</h2>
                        <p className="text-slate-500 text-sm font-medium mt-1 uppercase tracking-widest">DR. GREGORY HOUSE • DIAGNOSTIC MEDICINE</p>
                    </div>
                    <div className="flex gap-4">
                        <button className="flex items-center gap-2 px-6 py-3 bg-olive-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-olive-600/20 hover:bg-olive-800 transition-all">
                            <Plus size={16} /> New Ad-hoc Visit
                        </button>
                    </div>
                </div>

                {/* Main Content Split */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Left Box: Patient List */}
                    <div className="lg:col-span-2 bg-white rounded-[40px] border border-slate-100 shadow-sm flex flex-col h-full overflow-hidden min-h-[600px]">
                        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                            <div>
                                <h3 className="text-xl font-black text-slate-900 tracking-tight">My Patients</h3>
                                <p className="text-xs text-slate-500 font-medium mt-1">Assigned for Rounds/Consultation</p>
                            </div>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                <input placeholder="Search MRN or Name..." className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-olive-500" />
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                            {loading ? (
                                <div className="p-8 space-y-4">
                                    {[...Array(5)].map((_, i) => (
                                        <div key={i} className="h-12 bg-slate-50 rounded-xl animate-pulse"></div>
                                    ))}
                                </div>
                            ) : patients.length === 0 ? (
                                <div className="p-12 text-center">
                                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                                        <Users size={32} />
                                    </div>
                                    <h4 className="text-lg font-bold text-slate-900">No assigned patients</h4>
                                    <p className="text-slate-500 text-sm mt-1">You currently have no patients assigned.</p>
                                </div>
                            ) : (
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                                            <th className="px-8 py-4">Patient</th>
                                            <th className="px-8 py-4">MRN</th>
                                            <th className="px-8 py-4">Age/Gender</th>
                                            <th className="px-8 py-4">Condition</th>
                                            <th className="px-8 py-4 text-right pr-12">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {patients.map((p) => (
                                            <tr key={p._id} className="hover:bg-slate-50/50 transition-colors group cursor-pointer" onClick={() => setSelectedPatient(p)}>
                                                <td className="px-8 py-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-olive-100 flex items-center justify-center text-olive-700 font-black text-xs uppercase border-2 border-white shadow-sm">
                                                            {p.firstName[0]}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-slate-900 leading-tight">
                                                                {p.firstName} {p.lastName}
                                                            </p>
                                                            <p className="text-[10px] text-slate-400 font-medium">{p.contact?.phone || "No phone"}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-5">
                                                    <span className="font-mono text-xs text-slate-600 bg-slate-100 px-2 py-1 rounded">{p.mrn}</span>
                                                </td>
                                                <td className="px-8 py-5">
                                                    <span className="text-xs font-semibold text-slate-700">
                                                        {new Date().getFullYear() - new Date(p.dob).getFullYear()} Y / {p.gender}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-5">
                                                    {p.chronicConditions.length > 0 ? (
                                                        <span className="text-[10px] bg-red-50 text-red-600 px-2 py-1 rounded-full font-bold uppercase tracking-wide">
                                                            {p.chronicConditions[0]}
                                                        </span>
                                                    ) : (
                                                        <span className="text-[10px] bg-green-50 text-green-600 px-2 py-1 rounded-full font-bold uppercase tracking-wide">
                                                            Healthy
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-8 py-5 text-right pr-6">
                                                    <button className="text-olive-600 hover:text-olive-800 font-bold text-xs uppercase flex items-center justify-end gap-1">
                                                        Open <Stethoscope size={14} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>

                    {/* Right Box: Quick Actions */}
                    <div className="flex flex-col gap-8">
                        <div className="bg-[#0F172A] rounded-[40px] p-8 text-white relative overflow-hidden shadow-2xl">
                            <div className="relative z-10 space-y-6">
                                <h4 className="text-xl font-black tracking-tight leading-tight">Doctor's Note</h4>
                                <p className="text-sm text-slate-400">
                                    Remember to review pending lab results for yesterday's admissions before rounds.
                                </p>
                            </div>
                            <Activity className="absolute bottom-[-10%] right-[-10%] text-white/5" size={200} />
                        </div>

                        <div className="bg-white rounded-[40px] border border-slate-100 p-8 shadow-sm">
                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Quick Directives</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <QuickAction icon={Pill} label="Medication" color="bg-orange-50 text-orange-600" />
                                <QuickAction icon={Beaker} label="Lab Request" color="bg-olive-100 text-olive-700" />
                                <QuickAction icon={Users} label="Consult" color="bg-olive-50 text-olive-600" />
                                <QuickAction icon={Calendar} label="Schedule" color="bg-olive-50 text-olive-500" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

function QuickAction({ icon: Icon, label, color }: any) {
    return (
        <button className="flex flex-col items-center gap-3 p-6 bg-slate-50/50 rounded-3xl border border-slate-100 hover:shadow-lg hover:border-olive-200 transition-all font-sans group">
            <div className={`p-4 rounded-2xl ${color} shadow-sm group-hover:scale-110 transition-transform`}>
                <Icon size={20} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">{label}</span>
        </button>
    );
}
