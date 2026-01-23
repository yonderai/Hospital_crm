"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
    Users,
    Search,
    Filter,
    MoreVertical,
    Activity,
    FileText,
    Calendar,
    ChevronRight,
    UserPlus,
    XCircle
} from "lucide-react";
import Link from "next/link";

export default function DoctorPatients() {
    const [patients, setPatients] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const res = await fetch('/api/patients');
                const data = await res.json();
                if (data.patients) setPatients(data.patients);
            } catch (error) {
                console.error("Failed to fetch patients:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPatients();
    }, []);

    // Search Logic
    const filteredPatients = patients.filter(p => {
        const query = searchQuery.toLowerCase();
        const fullName = `${p.firstName} ${p.lastName}`.toLowerCase();
        const mrn = (p.mrn || "").toLowerCase();
        const condition = (p.condition || "").toLowerCase();

        return fullName.includes(query) || mrn.includes(query) || condition.includes(query);
    });

    return (
        <DashboardLayout>
            <div className="space-y-10">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Patient Directory</h2>
                        <p className="text-slate-500 text-sm font-medium mt-1 uppercase tracking-widest">ACTIVE CLINICAL RECORDS • Q1 2026</p>
                    </div>
                    {/* Register Button REMOVED for Doctor Role */}
                    <div className="flex gap-4">
                        <div className="flex items-center gap-3 bg-white border border-slate-100 px-4 py-3 rounded-2xl w-96 shadow-sm focus-within:border-olive-400 focus-within:ring-4 focus-within:ring-olive-500/10 transition-all">
                            <Search size={18} className="text-slate-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by name, MRN, or condition..."
                                className="bg-transparent border-none outline-none text-sm font-medium text-slate-900 w-full placeholder:text-slate-400"
                            />
                            {searchQuery && (
                                <button onClick={() => setSearchQuery("")} className="text-slate-400 hover:text-red-500 transition-colors">
                                    <XCircle size={16} fill="currentColor" className="opacity-20 hover:opacity-100" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex items-center gap-6 overflow-x-auto pb-2 noscrollbar">
                    <FilterButton label="All Patients" active count={filteredPatients.length} />
                    <FilterButton label="In-Patient" count={Math.floor(filteredPatients.length * 0.3)} />
                    <FilterButton label="Out-Patient" count={Math.floor(filteredPatients.length * 0.6)} />
                    <FilterButton label="Critical Care" count={Math.floor(filteredPatients.length * 0.1)} />
                </div>

                {/* Patient List Table */}
                <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                                <th className="px-8 py-6">Patient Identifier</th>
                                <th className="px-8 py-6">Status</th>
                                <th className="px-8 py-6">Last Visit</th>
                                <th className="px-8 py-6">Primary Condition</th>
                                <th className="px-8 py-6 text-right pr-12">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                [...Array(5)].map((_, i) => (
                                    <tr key={i}>
                                        <td colSpan={5} className="px-8 py-8 animate-pulse bg-slate-50/20" />
                                    </tr>
                                ))
                            ) : filteredPatients.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center justify-center opacity-50">
                                            <Search size={48} className="text-slate-300 mb-4" />
                                            <p className="text-slate-900 font-bold text-lg">No patients found</p>
                                            <p className="text-slate-500 text-sm">We couldn't find any matches for "{searchQuery}"</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredPatients.map((p, idx) => (
                                    <tr key={idx} className="group hover:bg-slate-50/50 transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500 font-black text-xs border border-slate-200 group-hover:bg-white group-hover:border-olive-200 transition-all">
                                                    {(p.firstName?.[0] || "")}{(p.lastName?.[0] || "")}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-slate-900 tracking-tight">{p.firstName} {p.lastName}</p>
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">MRN-{p.mrn}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest border ${p.status === 'Admitted' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-olive-50 text-olive-600 border-olive-100'
                                                }`}>
                                                {p.status || 'Active'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                                                <Calendar size={14} className="text-slate-400" />
                                                {p.lastVisit || "N/A"}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                                                <div className={`w-1.5 h-1.5 rounded-full ${p.severity === 'High' ? 'bg-red-500' : 'bg-olive-500'}`} />
                                                {p.condition || "General"}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right pr-8">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                                <button className="p-2.5 bg-white border border-slate-100 text-slate-400 hover:text-olive-600 rounded-xl shadow-sm transition-all">
                                                    <FileText size={18} />
                                                </button>
                                                <button className="p-2.5 bg-white border border-slate-100 text-slate-400 hover:text-olive-600 rounded-xl shadow-sm transition-all">
                                                    <Activity size={18} />
                                                </button>
                                                <Link href={`/doctor/patients/${p._id}`} className="w-full">
                                                    <button className="w-full py-3 bg-olive-700 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-olive-600/20 hover:bg-olive-800 transition-all flex items-center justify-center gap-2">
                                                        <ChevronRight size={18} />
                                                    </button>
                                                </Link>
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

function FilterButton({ label, active = false, count = 0 }: any) {
    return (
        <button className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all whitespace-nowrap border ${active
            ? 'bg-olive-700 text-white border-transparent shadow-lg shadow-olive-600/20'
            : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'
            }`}>
            {label}
            {count > 0 && <span className={`px-2 py-0.5 rounded-lg ${active ? 'bg-white/20 text-white' : 'bg-slate-50 text-slate-400'}`}>{count}</span>}
        </button>
    );
}
