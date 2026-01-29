"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
    Activity,
    Users,
    Search,
    ChevronRight,
    MapPin,
    AlertCircle,
    Thermometer,
    Droplets
} from "lucide-react";
import { useSession } from "next-auth/react";

export default function AssignedPatients() {
    const { data: session } = useSession();
    const [patients, setPatients] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAssigned = async () => {
            try {
                // In a real scenario, this would filter by the current nurse ID
                // For now, we show the active patient stream from the dashboard API
                const res = await fetch("/api/nurse/dashboard-data");
                if (res.ok) {
                    const json = await res.json();
                    const list = json.vitalsFlow?.map((vf: any, idx: number) => ({
                        name: vf.patient,
                        mrn: `MRN-${1000 + idx}`,
                        room: `Room 40${idx + 1}-A`,
                        vitalsStatus: vf.status,
                        priority: vf.status === 'Due Now' ? 'High' : 'Normal',
                        treatment: idx % 2 === 0 ? "Post-Op Recovery" : "Observation"
                    })) || [];
                    setPatients(list);
                }
            } catch (error) {
                console.error("Error fetching assigned patients:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAssigned();
    }, []);

    const nurseName = session?.user?.name || "Sarah Connor";
    const sector = (session?.user as any)?.department || "Sector 7G";

    return (
        <DashboardLayout>
            <div className="space-y-10">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight italic uppercase italic">Assigned Patients</h2>
                        <p className="text-slate-500 text-[10px] font-black mt-1 uppercase tracking-[0.3em]">
                            PRIMARY CARE ROSTER • {nurseName}
                        </p>
                    </div>
                </div>

                {/* Patient Roster */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {loading ? (
                        [...Array(3)].map((_, i) => (
                            <div key={i} className="bg-white p-8 rounded-[48px] border border-slate-100 shadow-sm animate-pulse h-64" />
                        ))
                    ) : patients.length === 0 ? (
                        <div className="col-span-3 py-20 text-center text-slate-400 font-bold italic border-2 border-dashed border-slate-100 rounded-[48px]">
                            No patients currently assigned to your roster.
                        </div>
                    ) : (
                        patients.map((p, i) => (
                            <div key={i} className="bg-white p-8 rounded-[48px] border border-slate-100 shadow-sm group hover:border-olive-400 transition-all hover:shadow-xl hover:shadow-slate-200/50">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{p.mrn}</p>
                                        <h4 className="text-xl font-black text-slate-900 uppercase italic tracking-tight group-hover:text-olive-700 transition-colors">{p.name}</h4>
                                    </div>
                                    <div className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${p.priority === 'High' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-slate-50 text-slate-500 border-slate-100'
                                        }`}>
                                        {p.priority} Priority
                                    </div>
                                </div>

                                <div className="space-y-4 mb-8">
                                    <div className="flex items-center gap-3 text-xs font-bold text-slate-600">
                                        <MapPin size={16} className="text-slate-300" />
                                        {p.room}
                                    </div>
                                    <div className="flex items-center gap-3 text-xs font-bold text-slate-600">
                                        <Activity size={16} className="text-slate-300" />
                                        {p.treatment}
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                                    <div className="flex gap-2">
                                        <button className="p-3 bg-slate-50 text-slate-400 hover:text-olive-600 rounded-2xl transition-all">
                                            <Thermometer size={18} />
                                        </button>
                                        <button className="p-3 bg-slate-50 text-slate-400 hover:text-olive-600 rounded-2xl transition-all">
                                            <Droplets size={18} />
                                        </button>
                                    </div>
                                    <button className="flex items-center gap-2 px-6 py-3 bg-olive-700 text-white rounded-[20px] font-black text-[10px] uppercase tracking-widest shadow-xl shadow-olive-600/20 hover:bg-olive-800 transition-all active:scale-95">
                                        Clinical Chart <ChevronRight size={14} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
