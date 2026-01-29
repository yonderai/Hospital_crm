"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
    FileText,
    User,
    Calendar,
    Stethoscope,
    ArrowRight,
    Search,
    Filter,
    Activity,
    ClipboardList,
    Clock
} from "lucide-react";
import { useSession } from "next-auth/react";

export default function ClinicalUpdatesPage() {
    const { data: session } = useSession();
    const [updates, setUpdates] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchUpdates = async () => {
        try {
            // Fetch encounters from clinical API (or doctor API as it contains SOAP notes)
            const res = await fetch("/api/doctor/consultations");
            const data = await res.json();

            // Map encounters to a clinical update timeline
            const notes = data.map((e: any) => ({
                id: e._id,
                patient: `${e.patientId?.firstName} ${e.patientId?.lastName}`,
                doctor: `Dr. ${e.providerId?.lastName}`,
                time: new Date(e.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                date: new Date(e.createdAt).toLocaleDateString(),
                assessment: e.soapNotes?.assessment || "No assessment recorded.",
                plan: e.soapNotes?.plan || "Continuing current observation.",
                type: e.type.toUpperCase(),
                chiefComplaint: e.chiefComplaint
            }));

            setUpdates(notes);
        } catch (error) {
            console.error("Clinical Updates Error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUpdates();
    }, []);

    const filteredUpdates = updates.filter(u =>
        u.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.assessment.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const nurseName = session?.user?.name || "Sarah Connor";

    return (
        <DashboardLayout>
            <div className="space-y-10">
                {/* Header Section */}
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight italic uppercase italic">Clinical Dispatch</h2>
                        <p className="text-slate-500 text-[10px] font-black mt-1 uppercase tracking-[0.3em]">
                            MD-NURSE SYNCHRO • {nurseName} • SOAP NOTES STREAM
                        </p>
                    </div>
                    <div className="flex items-center gap-4 bg-white border border-slate-100 px-6 py-3 rounded-[24px] w-96 shadow-sm focus-within:border-olive-400 transition-all">
                        <Search size={18} className="text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search Patients or Notes..."
                            className="bg-transparent border-none outline-none text-sm font-bold text-slate-900 w-full placeholder:text-slate-300"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Timeline Stream */}
                    <div className="lg:col-span-2 space-y-8">
                        {loading ? (
                            [...Array(3)].map((_, i) => (
                                <div key={i} className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm animate-pulse h-64" />
                            ))
                        ) : filteredUpdates.length === 0 ? (
                            <div className="py-20 text-center text-slate-400 font-bold italic border-2 border-dashed border-slate-100 rounded-[48px] bg-white">
                                All clinical nodes synchronized. No new updates.
                            </div>
                        ) : (
                            filteredUpdates.map((update, i) => (
                                <div key={i} className="bg-white rounded-[48px] border border-slate-100 shadow-sm overflow-hidden group hover:border-olive-400 transition-all">
                                    <div className="p-8 md:p-10 flex flex-col md:flex-row gap-8">
                                        <div className="md:w-48 shrink-0 space-y-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-olive-50 text-olive-600 rounded-xl flex items-center justify-center">
                                                    <Clock size={18} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-slate-900">{update.time}</p>
                                                    <p className="text-[9px] text-slate-400 font-bold uppercase">{update.date}</p>
                                                </div>
                                            </div>
                                            <div className="inline-flex px-3 py-1 bg-slate-900 text-white text-[8px] font-black uppercase tracking-widest rounded-lg">
                                                {update.type}
                                            </div>
                                        </div>

                                        <div className="flex-1 space-y-6">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tight group-hover:text-olive-700 transition-colors">{update.patient}</h3>
                                                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Provider: {update.doctor}</p>
                                                </div>
                                                <button className="p-3 bg-slate-50 text-slate-400 hover:text-olive-600 rounded-2xl transition-all">
                                                    <ClipboardList size={20} />
                                                </button>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-slate-50">
                                                <div className="space-y-2">
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Clinical Assessment</p>
                                                    <p className="text-xs text-slate-700 font-medium leading-relaxed italic">{update.assessment}</p>
                                                </div>
                                                <div className="space-y-2">
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Nursing Plan</p>
                                                    <p className="text-xs text-olive-700 font-bold leading-relaxed">{update.plan}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-slate-50 p-4 px-10 flex justify-between items-center group-hover:bg-olive-50 transition-colors">
                                        <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                            <Stethoscope size={14} /> Complaints: {update.chiefComplaint}
                                        </div>
                                        <button className="flex items-center gap-2 text-olive-700 text-[10px] font-black uppercase tracking-widest group-hover:translate-x-2 transition-transform">
                                            Acknowledge <ArrowRight size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Sidebar: Clinical Stats */}
                    <div className="space-y-8">
                        <div className="bg-slate-900 rounded-[48px] p-10 text-white shadow-2xl relative overflow-hidden group">
                            <div className="relative z-10 space-y-6">
                                <h4 className="text-2xl font-black tracking-tight italic uppercase">Clinical Uptime</h4>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                                        <span>Notes Finalized</span>
                                        <span className="text-teal-400">28 Today</span>
                                    </div>
                                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-teal-500 w-[78%] rounded-full shadow-glow" />
                                    </div>
                                </div>
                                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest italic">
                                    "Sentinel-X synchronized with Medical Records Vault 7G."
                                </p>
                            </div>
                            <Activity className="absolute bottom-[-10%] right-[-10%] text-white/5 group-hover:scale-110 transition-transform duration-700" size={200} />
                        </div>

                        <div className="bg-white rounded-[40px] border border-slate-100 p-8 shadow-sm space-y-6">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Priority Surveillance</h4>
                            {[1, 2, 3].map((_, i) => (
                                <div key={i} className="flex gap-4 p-4 hover:bg-slate-50 rounded-2xl transition-colors cursor-pointer group">
                                    <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
                                        <Activity size={18} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-slate-900 uppercase italic">Stat Update Needed</p>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase">Room 40{i + 1}-Vitals Overdue</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
