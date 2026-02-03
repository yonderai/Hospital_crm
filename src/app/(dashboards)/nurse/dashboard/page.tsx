"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
    Users,
    Droplets,
    Activity,
    CheckCircle2,
    Plus,
    Clock,
    Thermometer,
    ClipboardList,
    FileText,
    RefreshCw
} from "lucide-react";
import { useSession } from "next-auth/react";

import { useRouter } from "next/navigation";

export default function NurseDashboard() {
    const { data: session } = useSession();
    const router = useRouter();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const fetchDashboardData = async () => {
        try {
            const res = await fetch("/api/nurse/dashboard-data");
            if (res.ok) {
                const json = await res.json();
                setData(json);
            }
        } catch (error) {
            console.error("Error fetching nurse dashboard:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
        const interval = setInterval(fetchDashboardData, 30000); // Poll every 30s
        return () => clearInterval(interval);
    }, []);

    const nurseName = session?.user?.name || "Sarah Connor";
    const sector = (session?.user as any)?.department || "Sector 7G";

    const statsConfig = [
        { title: "Patients Under Care", value: data?.stats?.patientsUnderCare || "0", icon: Users, color: "text-olive-600", bg: "bg-olive-50" },
        { title: "Medications Due", value: data?.stats?.medicationsDue || "0", icon: Droplets, color: "text-olive-500", bg: "bg-olive-50" },
        { title: "Vital Signs Pending", value: data?.stats?.vitalsPending || "0", icon: Activity, color: "text-olive-400", bg: "bg-olive-50/50" },
        { title: "Tasks Completed", value: data?.stats?.tasksCompleted || "0%", icon: CheckCircle2, color: "text-olive-600", bg: "bg-olive-50" },
    ];

    return (
        <DashboardLayout>
            <div className="space-y-10">
                {/* Header Section */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight italic uppercase">Nursing Station</h2>
                        <p className="text-slate-500 text-[10px] font-black mt-1 uppercase tracking-[0.3em]">
                            NURSE {nurseName} • {sector}
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={() => router.push('/nurse/clinical-updates')}
                            className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm"
                        >
                            Handover Notes
                        </button>
                        <button
                            onClick={() => router.push('/nurse/clinical')}
                            className="flex items-center gap-2 px-6 py-3 bg-olive-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-olive-600/20 hover:bg-olive-800 transition-all active:scale-95"
                        >
                            <Plus size={16} /> New Record
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statsConfig.map((s, i) => (
                        <div key={i} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex items-center justify-between group hover:border-olive-400 transition-all">
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{s.title}</p>
                                <p className="text-4xl font-black text-slate-900 tracking-tighter">
                                    {loading ? <span className="animate-pulse text-slate-200">...</span> : s.value}
                                </p>
                            </div>
                            <div className={`p-4 ${s.bg} ${s.color} rounded-2xl group-hover:scale-110 transition-transform`}>
                                <s.icon size={24} />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Med Schedule */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white rounded-[48px] border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
                            <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                                <div>
                                    <h3 className="text-2xl font-black text-slate-900 tracking-tight italic uppercase">Medication Schedule</h3>
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Live Dispense Queue</p>
                                </div>
                                <div className="flex items-center gap-2 text-slate-400 animate-spin-slow">
                                    <Clock size={20} />
                                </div>
                            </div>

                            <div className="p-0">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50">
                                            <th className="px-10 py-6">Patient / Room</th>
                                            <th className="px-10 py-6">Medication / Dose</th>
                                            <th className="px-10 py-6">Dispense Time</th>
                                            <th className="px-10 py-6 text-right pr-12">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {loading ? (
                                            <tr>
                                                <td colSpan={4} className="px-10 py-20 text-center text-slate-300 font-bold uppercase tracking-widest text-xs">
                                                    Fetching Patient Data...
                                                </td>
                                            </tr>
                                        ) : !data?.medicationSchedule?.length ? (
                                            <tr>
                                                <td colSpan={4} className="px-10 py-20 text-center text-slate-400 font-bold italic">
                                                    No medications scheduled for the current round.
                                                </td>
                                            </tr>
                                        ) : data.medicationSchedule.map((m: any, idx: number) => (
                                            <tr key={idx} className="group hover:bg-slate-50/50 transition-colors">
                                                <td className="px-10 py-6">
                                                    <p className="text-sm font-black text-slate-900 uppercase tracking-tight group-hover:text-olive-700 transition-colors">{m.patientName}</p>
                                                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{m.room}</p>
                                                </td>
                                                <td className="px-10 py-6">
                                                    <span className="text-xs font-black text-olive-800 uppercase tracking-tighter">
                                                        {m.medication}
                                                    </span>
                                                    <p className="text-[10px] text-slate-500 font-bold">Qty: {m.dose}</p>
                                                </td>
                                                <td className="px-10 py-6 text-xs text-slate-400">
                                                    <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[9px] font-black uppercase tracking-widest border border-slate-200">
                                                        {m.time}
                                                    </span>
                                                </td>
                                                <td className="px-10 py-6 text-right pr-8">
                                                    <button className="px-5 py-2.5 bg-olive-700 text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-olive-600/10 hover:bg-olive-800 transition-all active:scale-95">
                                                        Finalize
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="bg-white rounded-[48px] border border-slate-100 p-10 shadow-sm relative overflow-hidden">
                            <h3 className="text-2xl font-black text-slate-900 tracking-tight italic uppercase mb-8">Patient Vitals Flow</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                                {(data?.vitalsFlow || []).length > 0 ? (
                                    data.vitalsFlow.map((v: any, i: number) => (
                                        <VitalsControl key={i} {...v} />
                                    ))
                                ) : (
                                    <div className="col-span-2 text-slate-400 text-xs font-bold uppercase tracking-widest text-center py-10">
                                        No pending vital checks.
                                    </div>
                                )}
                            </div>
                            <Activity className="absolute bottom-[-10%] left-[-5%] text-slate-50/50 -rotate-12" size={240} />
                        </div>
                    </div>

                    {/* Sidebar: Tasks & Procedures */}
                    <div className="space-y-10">
                        <div className="bg-slate-900 rounded-[48px] p-10 text-white shadow-2xl relative overflow-hidden group">
                            <div className="relative z-10 space-y-6">
                                <h4 className="text-2xl font-black tracking-tight italic uppercase">Nurse-X Terminal</h4>
                                <div className="space-y-2">
                                    <p className="text-[10px] text-olive-400 font-black uppercase tracking-[0.4em] leading-none">Status: Primary Care</p>
                                    <div className="h-1 w-20 bg-olive-500 rounded-full" />
                                </div>
                                <div className="space-y-4">
                                    <div className="flex gap-4 p-5 bg-white/5 rounded-[24px] border border-white/10 hover:bg-white/10 transition-colors">
                                        <ClipboardList className="text-olive-400" size={20} />
                                        <div className="text-sm font-bold uppercase tracking-tight">Active Handover Cycle</div>
                                    </div>
                                </div>
                            </div>
                            <Activity className="absolute bottom-[-10%] right-[-10%] text-white/5 group-hover:scale-110 transition-transform duration-700" size={200} />
                        </div>

                        <div className="bg-white rounded-[48px] border border-slate-100 p-10 shadow-sm space-y-4">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Protocol Shortcuts</h4>
                            <NurseAction icon={Activity} label="Record Vitals" href="/nurse/icu-monitor" />
                            <NurseAction icon={Droplets} label="Administer Med" href="/nurse/clinical" />
                            <NurseAction icon={FileText} label="Clinical Note" href="/nurse/clinical-updates" />
                            <NurseAction icon={Thermometer} label="Update Chart" href="/nurse/assigned-patients" />
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

function NurseAction({ icon: Icon, label, href }: any) {
    const router = useRouter();
    return (
        <button
            onClick={() => router.push(href)}
            className="w-full flex items-center gap-4 p-5 bg-slate-50/50 rounded-3xl border border-slate-100 hover:border-olive-400 hover:bg-white transition-all group shadow-sm active:scale-98"
        >
            <div className="p-3 bg-white rounded-xl text-olive-600 shadow-sm border border-slate-100 group-hover:bg-olive-600 group-hover:text-white transition-all">
                <Icon size={18} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-slate-900">{label}</span>
        </button>
    );
}

function VitalsControl({ label, patient, status, color }: any) {
    return (
        <div className={`p-6 rounded-[32px] border bg-slate-50/30 flex items-center justify-between transition-all hover:bg-white shadow-sm hover:shadow-lg hover:shadow-slate-200/50 ${color}`}>
            <div className="flex gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400">
                    <Activity size={20} />
                </div>
                <div>
                    <p className="text-xs font-black text-slate-900 uppercase tracking-tight">{patient}</p>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
                </div>
            </div>
            <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${status === 'Due Now' ? 'bg-red-50 text-red-500' : 'bg-olive-50 text-olive-600'}`}>
                {status}
            </span>
        </div>
    );
}
