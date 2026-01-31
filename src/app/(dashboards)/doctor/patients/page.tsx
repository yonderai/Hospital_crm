"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
    Activity,
    FileText,
    Calendar,
    ChevronRight,
    UserPlus,
    Search,
    Filter,
    CheckCircle2
} from "lucide-react";
import Link from "next/link";

export default function DoctorPatients() {
    const [patients, setPatients] = useState<any[]>([]);
    const [filteredPatients, setFilteredPatients] = useState<any[]>([]);
    const [counts, setCounts] = useState({ all: 0, inPatient: 0, outPatient: 0, critical: 0, postOp: 0 });
    const [stats, setStats] = useState({ today: 0, yesterday: 0, outpatientCompleted: 0 });
    const [activeFilter, setActiveFilter] = useState('all');
    const [dateFilter, setDateFilter] = useState('all'); // 'all', 'today', 'yesterday'
    const [loading, setLoading] = useState(true);

    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    // Debounce effect
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchTerm);
        }, 300);
        return () => clearTimeout(handler);
    }, [searchTerm]);

    useEffect(() => {
        const fetchPatients = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams();
                if (debouncedSearch) params.append('search', debouncedSearch);
                if (dateFilter !== 'all') params.append('date', dateFilter);

                const res = await fetch(`/api/patients?${params.toString()}`);
                const data = await res.json();
                setPatients(data.patients || []);
                setCounts(data.counts || { all: 0, inPatient: 0, outPatient: 0, critical: 0, postOp: 0 });
                setStats(data.stats || { today: 0, yesterday: 0, outpatientCompleted: 0 });
            } catch (error) {
                console.error("Failed to fetch patients:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPatients();
    }, [debouncedSearch, dateFilter]);

    // Filter effect
    useEffect(() => {
        if (activeFilter === 'all') {
            setFilteredPatients(patients);
        } else {
            // The API now handles category mapping: 
            // 'inpatient' = Pending/Awaiting Tx
            // 'outpatient' = Treatment Done
            setFilteredPatients(patients.filter(p => p.category === activeFilter));
        }
    }, [activeFilter, patients]);

    return (
        <DashboardLayout>
            <div className="space-y-10">
                {/* Header */}
                <div className="flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Patient Directory</h2>
                            <p className="text-slate-500 text-sm font-medium mt-1 uppercase tracking-widest">ACTIVE CLINICAL RECORDS • Q1 2026</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-3 bg-white border border-slate-100 px-4 py-3 rounded-2xl w-80 shadow-sm">
                                <Search size={18} className="text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search by name, MRN, or condition..."
                                    className="bg-transparent border-none outline-none text-sm font-medium text-slate-900 w-full placeholder:text-slate-400"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Stats Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <StatCard
                            title="Total Scheduled Today"
                            value={stats.today}
                            icon={<Calendar className="text-olive-600" />}
                            active={dateFilter === 'today'}
                            onClick={() => setDateFilter(dateFilter === 'today' ? 'all' : 'today')}
                        />
                        <StatCard
                            title="Total Scheduled Yesterday"
                            value={stats.yesterday}
                            icon={<Calendar className="text-slate-400" />}
                            active={dateFilter === 'yesterday'}
                            onClick={() => setDateFilter(dateFilter === 'yesterday' ? 'all' : 'yesterday')}
                        />
                        <StatCard
                            title="Out-Patient Completed"
                            value={stats.outpatientCompleted}
                            icon={<CheckCircle2 className="text-emerald-600" />}
                            highlight
                        />
                        <StatCard
                            title="Total Patients"
                            value={counts.all}
                            icon={<UserPlus className="text-blue-600" />}
                            onClick={() => setDateFilter('all')}
                        />
                    </div>
                </div>

                {/* Filters */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-4 overflow-x-auto noscrollbar">
                        <FilterButton label="All Patients" active={activeFilter === 'all'} count={counts.all} onClick={() => setActiveFilter('all')} />
                        <FilterButton label="In-Patient (Cure Pending)" active={activeFilter === 'inpatient'} count={counts.inPatient} onClick={() => setActiveFilter('inpatient')} />
                        <FilterButton label="Out-Patient (Rx Done)" active={activeFilter === 'outpatient'} count={counts.outPatient} onClick={() => setActiveFilter('outpatient')} />
                        <FilterButton label="Critical Care" active={activeFilter === 'critical'} count={counts.critical} onClick={() => setActiveFilter('critical')} />
                        <FilterButton label="Post-Op" active={activeFilter === 'post-op'} count={counts.postOp} onClick={() => setActiveFilter('post-op')} />
                    </div>
                </div>

                {/* Patient List Table */}
                <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 bg-slate-50/50">
                                <th className="px-8 py-6">Patient Identifier</th>
                                <th className="px-8 py-6">Status</th>
                                <th className="px-8 py-6">Last Activity</th>
                                <th className="px-8 py-6">Primary Condition</th>
                                <th className="px-8 py-6 text-right pr-12">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                [...Array(5)].map((_, i) => (
                                    <tr key={i}>
                                        <td colSpan={5} className="px-8 py-8 animate-pulse bg-slate-50/20">
                                            <div className="h-10 bg-slate-100 rounded-xl w-full" />
                                        </td>
                                    </tr>
                                ))
                            ) : filteredPatients.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center text-slate-400 font-bold italic">
                                        No patients found for this selection.
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
                                            <div className="flex items-center gap-2">
                                                <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest border ${p.status === 'Treatment Done' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                        p.status === 'Awaiting Tx' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                                                            p.status === 'Admitted' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                                                'bg-slate-50 text-slate-600 border-slate-100'
                                                    }`}>
                                                    {p.status}
                                                </span>
                                                {p.hasPrescription && (
                                                    <span className="text-[8px] font-black px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase tracking-tighter">Rx Done</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                                                <Calendar size={14} className="text-slate-400" />
                                                {p.lastVisit}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                                                <div className={`w-1.5 h-1.5 rounded-full ${p.severity === 'High' ? 'bg-red-500' : 'bg-olive-500'}`} />
                                                {p.condition}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right pr-8">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                                <Link href={`/doctor/patients/${p._id}`} className="p-2.5 bg-white border border-slate-100 text-slate-400 hover:text-olive-600 rounded-xl shadow-sm transition-all" title="View Details">
                                                    <FileText size={18} />
                                                </Link>
                                                <Link href={`/doctor/patients/${p._id}/clinical`} className="p-2.5 bg-white border border-slate-100 text-slate-400 hover:text-olive-600 rounded-xl shadow-sm transition-all" title="Clinical Summary">
                                                    <Activity size={18} />
                                                </Link>
                                                <Link href={`/doctor/patients/${p._id}/chart`} className="p-2.5 bg-olive-700 text-white rounded-xl shadow-lg shadow-olive-600/20 hover:bg-olive-800 transition-all ml-2" title="Full Chart">
                                                    <ChevronRight size={18} />
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

function StatCard({ title, value, icon, active, highlight, onClick }: any) {
    return (
        <button
            onClick={onClick}
            className={`p-6 rounded-[32px] border transition-all text-left flex flex-col justify-between h-32 ${active
                ? 'bg-olive-700 border-transparent text-white shadow-xl shadow-olive-600/20 ring-4 ring-olive-600/10'
                : highlight
                    ? 'bg-emerald-50 border-emerald-100 text-emerald-900 shadow-sm'
                    : 'bg-white border-slate-100 text-slate-900 shadow-sm hover:border-slate-300'
                } ${onClick ? 'cursor-pointer active:scale-95' : 'cursor-default'}`}>
            <div className="flex items-center justify-between">
                <p className={`text-[10px] font-black uppercase tracking-widest ${active ? 'text-white/60' : 'text-slate-400'}`}>{title}</p>
                <div className={`p-2 rounded-xl ${active ? 'bg-white/10' : 'bg-slate-50'}`}>
                    {icon}
                </div>
            </div>
            <p className="text-3xl font-black tracking-tight">{value}</p>
        </button>
    );
}

function FilterButton({ label, active = false, count = 0, onClick }: any) {
    return (
        <button onClick={onClick} className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all whitespace-nowrap border ${active
            ? 'bg-olive-700 text-white border-transparent shadow-lg shadow-olive-600/20'
            : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'
            }`}>
            {label}
            {count > 0 && <span className={`px-2 py-0.5 rounded-lg ${active ? 'bg-white/20 text-white' : 'bg-slate-50 text-slate-400'}`}>{count}</span>}
        </button>
    );
}

