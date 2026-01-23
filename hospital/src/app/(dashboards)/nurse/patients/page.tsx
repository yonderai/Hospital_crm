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
    MapPin
} from "lucide-react";

export default function NursePatients() {
    const [patients, setPatients] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const res = await fetch('/api/patients');
                const data = await res.json();
                // Map to nurse specific fields
                setPatients(data.patients.map((p: any, idx: number) => ({
                    ...p,
                    room: `Ward ${Math.floor(idx / 2) + 1}-${idx % 2 === 0 ? 'A' : 'B'}`,
                    vitalsStatus: idx % 3 === 0 ? 'Due Now' : 'Stable'
                })));
            } catch (error) {
                console.error("Failed to fetch patients:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPatients();
    }, []);

    return (
        <DashboardLayout>
            <div className="space-y-10">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Ward Management</h2>
                        <p className="text-slate-500 text-sm font-medium mt-1 uppercase tracking-widest">NURSE SARAH CONNOR • SECTOR 7G</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="flex items-center gap-3 bg-white border border-slate-100 px-4 py-2 rounded-2xl w-80 shadow-sm">
                            <Search size={18} className="text-slate-400" />
                            <input type="text" placeholder="Search by Room or MRN..." className="bg-transparent border-none outline-none text-sm font-medium text-slate-900 w-full" />
                        </div>
                    </div>
                </div>

                {/* Patient Cards/List */}
                <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                                <th className="px-8 py-6">Patient / MRN</th>
                                <th className="px-8 py-6">Current Location</th>
                                <th className="px-8 py-6">Vitals Status</th>
                                <th className="px-8 py-6">Last Intervention</th>
                                <th className="px-8 py-6 text-right pr-12">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                [...Array(5)].map((_, i) => <tr key={i}><td colSpan={5} className="h-16 animate-pulse bg-slate-50/50" /></tr>)
                            ) : (
                                patients.map((p, idx) => (
                                    <tr key={idx} className="group hover:bg-slate-50/50 transition-colors">
                                        <td className="px-8 py-6">
                                            <p className="text-sm font-black text-slate-900 tracking-tight">{p.firstName} {p.lastName}</p>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">MRN-{p.mrn}</p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2 text-xs font-bold text-olive-700">
                                                <MapPin size={14} className="text-olive-400" />
                                                {p.room}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest border ${p.vitalsStatus === 'Due Now' ? 'bg-red-50 text-red-600 border-red-100 animate-pulse' : 'bg-green-50 text-green-600 border-green-100'
                                                }`}>
                                                {p.vitalsStatus}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-xs text-slate-500 font-medium">10:45 AM (Vitals)</td>
                                        <td className="px-8 py-6 text-right pr-8">
                                            <div className="flex items-center justify-end gap-2">
                                                <button className="p-2.5 bg-slate-50 text-slate-400 hover:text-olive-600 rounded-xl transition-all">
                                                    <Thermometer size={18} />
                                                </button>
                                                <button className="p-2.5 bg-slate-50 text-slate-400 hover:text-olive-600 rounded-xl transition-all">
                                                    <Droplets size={18} />
                                                </button>
                                                <button className="p-2.5 bg-olive-700 text-white rounded-xl shadow-lg shadow-olive-600/20 ml-2">
                                                    <ChevronRight size={18} />
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
