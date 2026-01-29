"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
    Users,
    Search,
    Filter,
    Activity,
    Thermometer,
    Droplets,
    ChevronRight,
    MapPin,
    AlertCircle
} from "lucide-react";
import { useSession } from "next-auth/react";

export default function NursePatients() {
    const { data: session } = useSession();
    const [patients, setPatients] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchPatients = async () => {
        try {
            // We use the dashboard-data endpoint which already aggregates patient/encounter info
            const res = await fetch('/api/nurse/dashboard-data');
            const data = await res.json();

            // Map the vitals flow and encounters to a patient list
            const patientList = data.vitalsFlow?.map((vf: any, idx: number) => ({
                name: vf.patient,
                mrn: `MRN-${1000 + idx}`, // Mock MRN for now if not in the flow
                room: `Ward ${Math.floor(idx / 2) + 1}-${idx % 2 === 0 ? 'A' : 'B'}`,
                vitalsStatus: vf.status,
                lastSeen: "Today, " + (10 + idx) + ":45 AM",
                intervention: vf.status === 'Due Now' ? "Urgent Vitals" : "Observation"
            })) || [];

            setPatients(patientList);
        } catch (error) {
            console.error("Failed to fetch patients:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPatients();
    }, []);

    const nurseName = session?.user?.name || "Sarah Connor";
    const sector = (session?.user as any)?.department || "Sector 7G";

    const filteredPatients = patients.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <DashboardLayout>
            <div className="space-y-10">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight italic uppercase">Ward Population</h2>
                        <p className="text-slate-500 text-[10px] font-black mt-1 uppercase tracking-[0.3em]">
                            NURSE {nurseName} • {sector}
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <div className="flex items-center gap-4 bg-white border border-slate-100 px-6 py-3 rounded-[24px] w-96 shadow-sm focus-within:border-olive-400 transition-all">
                            <Search size={18} className="text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search Patients by Name..."
                                className="bg-transparent border-none outline-none text-sm font-bold text-slate-900 w-full placeholder:text-slate-300"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Patient Cards/List */}
                <div className="bg-white rounded-[48px] border border-slate-100 shadow-sm overflow-hidden min-h-[500px]">
                    <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                        <h3 className="text-xl font-black text-slate-900 tracking-tight italic uppercase">Active Bed Occupancy</h3>
                        <span className="px-4 py-1.5 bg-white border border-slate-200 rounded-xl text-[10px] font-black text-slate-500 uppercase tracking-widest">
                            {filteredPatients.length} Patients Active
                        </span>
                    </div>

                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] border-b border-slate-50">
                                <th className="px-10 py-6">Patient / Clinical Node</th>
                                <th className="px-10 py-6">Location</th>
                                <th className="px-10 py-6 text-center">Vitals Sentinel</th>
                                <th className="px-10 py-6">Last Check</th>
                                <th className="px-10 py-6 text-right pr-16">Interventions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-10 py-32 text-center">
                                        <div className="flex flex-col items-center gap-4 animate-pulse">
                                            <Activity size={48} className="text-slate-200" />
                                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Syncing Ward Data...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredPatients.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-10 py-32 text-center text-slate-400 font-bold italic">
                                        No active patients recorded in {sector}.
                                    </td>
                                </tr>
                            ) : (
                                filteredPatients.map((p, idx) => (
                                    <tr key={idx} className="group hover:bg-slate-50/50 transition-colors">
                                        <td className="px-10 py-8">
                                            <p className="text-sm font-black text-slate-900 tracking-tight group-hover:text-olive-700 transition-all uppercase italic">{p.name}</p>
                                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{p.mrn}</p>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-3 text-xs font-black text-olive-800 uppercase italic">
                                                <MapPin size={16} className="text-olive-400" />
                                                {p.room}
                                            </div>
                                        </td>
                                        <td className="px-10 py-8 text-center">
                                            <span className={`text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border shadow-sm ${p.vitalsStatus === 'Due Now'
                                                    ? 'bg-red-50 text-red-600 border-red-100 animate-pulse'
                                                    : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                                }`}>
                                                {p.vitalsStatus}
                                            </span>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-2">
                                                <Clock size={14} className="text-slate-300" />
                                                <p className="text-[10px] text-slate-500 font-black uppercase tracking-tight">{p.lastSeen}</p>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8 text-right pr-12">
                                            <div className="flex items-center justify-end gap-3">
                                                <button className="p-3 bg-white border border-slate-100 text-slate-400 hover:text-olive-600 hover:border-olive-200 rounded-2xl transition-all shadow-sm">
                                                    <Thermometer size={18} />
                                                </button>
                                                <button className="p-3 bg-white border border-slate-100 text-slate-400 hover:text-olive-600 hover:border-olive-200 rounded-2xl transition-all shadow-sm">
                                                    <Droplets size={18} />
                                                </button>
                                                <button className="flex items-center gap-2 px-6 py-3 bg-olive-700 text-white rounded-[20px] font-black text-[10px] uppercase tracking-widest shadow-xl shadow-olive-600/20 hover:bg-olive-800 transition-all active:scale-95 ml-4">
                                                    Details <ChevronRight size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
}
