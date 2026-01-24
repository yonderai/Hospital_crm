
"use client";

import DashboardLayout from "@/components/DashboardLayout";
import {
    Beaker,
    Search,
    Filter,
    Activity,
    ChevronRight,
    Clock,
    CheckCircle,
    AlertTriangle,
    Database
} from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function LaboratoryPage() {
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchLabs = async () => {
            try {
                const res = await fetch('/api/lab/results');
                if (res.ok) setResults(await res.json());
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchLabs();
    }, []);

    const filteredResults = results.filter(r =>
        r.patientId?.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.patientId?.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.testType?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <DashboardLayout>
            <div className="space-y-10">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight italic uppercase">Clinical Laboratory Hub</h2>
                        <p className="text-slate-500 text-[10px] font-black mt-1 uppercase tracking-[0.4em]">Real-time Diagnostic Stream • Central Node</p>
                    </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[
                        { label: 'Total Analyzed', value: results.length, icon: Database, color: 'text-blue-600', bg: 'bg-blue-50' },
                        { label: 'Abnormalities', value: results.filter(r => r.abnormalFlag).length, icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
                        { label: 'Processing', value: results.filter(r => r.status === 'pending').length, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
                        { label: 'Validated', value: results.filter(r => r.status === 'completed' || r.status === 'final').length, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-center gap-5 hover:scale-105 transition-transform cursor-default">
                            <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center shadow-inner`}>
                                <stat.icon size={28} />
                            </div>
                            <div>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                                <p className="text-2xl font-black text-slate-900 tracking-tighter">{stat.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Filter / Search Bar */}
                <div className="bg-[#0F172A] rounded-[40px] p-8 text-white relative overflow-hidden shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="relative z-10">
                        <h4 className="text-xl font-black tracking-tight italic uppercase">Diagnostic Master Archive</h4>
                        <p className="text-slate-400 text-xs mt-1">Filtering entire historical record database</p>
                    </div>
                    <div className="relative z-10 flex gap-4 w-full md:w-auto">
                        <div className="relative flex-1 md:w-96">
                            <Search size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" />
                            <input
                                type="text"
                                placeholder="Search by patient or test type..."
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-sm font-bold outline-none focus:bg-white/10 transition-all text-white"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                    <Activity className="absolute bottom-[-10%] right-[-10%] text-white/5 rotate-12" size={240} />
                </div>

                {/* Results Table */}
                <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                                    <th className="px-10 py-6">Status</th>
                                    <th className="px-10 py-6">Patient Subject</th>
                                    <th className="px-10 py-6">Test Identifier</th>
                                    <th className="px-10 py-6">Clinical Result</th>
                                    <th className="px-10 py-6 text-right pr-14">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {loading ? (
                                    <tr><td colSpan={5} className="p-20 text-center text-slate-400 font-black animate-pulse uppercase tracking-[0.3em]">Querying Database...</td></tr>
                                ) : filteredResults.length === 0 ? (
                                    <tr><td colSpan={5} className="p-20 text-center text-slate-300 font-black uppercase tracking-[0.3em]">No records found for current filter</td></tr>
                                ) : (
                                    filteredResults.map((lab, i) => (
                                        <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="px-10 py-8">
                                                <span className={`text-[8px] font-black px-3 py-1 rounded-full border uppercase tracking-widest ${lab.status === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-100 animate-pulse' :
                                                        lab.status === 'completed' || lab.status === 'final' ? 'bg-green-50 text-green-600 border-green-100' :
                                                            'bg-slate-50 text-slate-400 border-slate-100'
                                                    }`}>
                                                    {lab.status}
                                                </span>
                                            </td>
                                            <td className="px-10 py-8">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-300 font-black text-[10px] border border-slate-100 group-hover:bg-blue-50 group-hover:text-blue-600 group-hover:border-blue-100 transition-all">
                                                        {lab.patientId?.firstName?.[0]}{lab.patientId?.lastName?.[0]}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-black text-slate-900 leading-tight italic">{lab.patientId?.firstName} {lab.patientId?.lastName}</p>
                                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">MRN: {lab.patientId?.mrn}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8">
                                                <p className="text-xs font-black text-slate-900 uppercase tracking-tight">{lab.testType}</p>
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">{new Date(lab.createdAt).toLocaleDateString()}</p>
                                            </td>
                                            <td className="px-10 py-8">
                                                <div className="flex items-center gap-3">
                                                    <p className={`text-xl font-black italic tracking-tighter ${lab.abnormalFlag ? 'text-red-500 animate-pulse' : 'text-slate-900'}`}>{lab.resultValue}</p>
                                                    <span className="text-[10px] font-black text-slate-400 uppercase">{lab.unit}</span>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8 text-right pr-10">
                                                <Link
                                                    href={`/doctor/patients/${lab.patientId?._id}`}
                                                    className="inline-flex items-center justify-center p-3 text-slate-400 hover:bg-white hover:text-blue-600 hover:shadow-md rounded-2xl border border-transparent hover:border-blue-100 transition-all"
                                                >
                                                    <ChevronRight size={20} />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
