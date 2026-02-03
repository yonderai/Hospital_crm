
"use client";

import DashboardLayout from "@/components/DashboardLayout";
import {
    FileText,
    Beaker,
    Camera,
    Activity,
    Search,
    Download,
    Eye,
    ChevronRight,
    Calendar,
    Stethoscope,
    Scissors
} from "lucide-react";
import { useState, useEffect } from "react";

export default function PatientRecords() {
    const [filter, setFilter] = useState("all");
    const [records, setRecords] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchRecords = async () => {
            try {
                const res = await fetch('/api/patient/labs');
                if (res.ok) {
                    const json = await res.json();
                    setRecords(json.data || []);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchRecords();
    }, []);

    const filteredRecords = records.filter(r => {
        const matchesFilter = filter === "all" || r.type === filter;
        const matchesSearch = r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.provider.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    return (
        <DashboardLayout>
            <div className="space-y-10">
                {/* Header Section */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight italic uppercase">Clinical Archive</h2>
                        <p className="text-olive-600 text-[10px] font-black mt-1 uppercase tracking-[0.3em] flex items-center gap-2">
                            <Activity size={12} className="animate-pulse" /> Live Unified Health Repository
                        </p>
                    </div>
                    <div className="flex gap-4 bg-white p-1 rounded-2xl border border-slate-100 shadow-sm">
                        {["All", "Lab", "Imaging", "Encounter"].map(t => (
                            <button
                                key={t}
                                onClick={() => setFilter(t.toLowerCase())}
                                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === t.toLowerCase() ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Search Bar */}
                <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-center gap-4 group focus-within:border-olive-400 transition-all">
                    <Search className="text-slate-400 group-focus-within:text-olive-500" size={20} />
                    <input
                        type="text"
                        placeholder="Search records by title, provider, or date..."
                        className="flex-1 outline-none text-sm font-bold placeholder:text-slate-300"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Records List */}
                <div className="space-y-6">
                    {loading ? (
                        <div className="space-y-6">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-32 bg-slate-50 rounded-[40px] animate-pulse"></div>
                            ))}
                        </div>
                    ) : (
                        filteredRecords.map((rec) => (
                            <div key={rec.id} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm hover:border-olive-400 hover:shadow-xl hover:shadow-olive-600/5 transition-all group flex items-center justify-between">
                                <div className="flex gap-8 items-center text-left">
                                    <div className={`w-16 h-16 rounded-3xl flex items-center justify-center ${rec.type === 'lab' ? 'bg-blue-50 text-blue-600' :
                                        rec.type === 'imaging' ? 'bg-purple-50 text-purple-600' :
                                            rec.type === 'surgery' ? 'bg-olive-50 text-olive-600' :
                                                'bg-indigo-50 text-indigo-600'
                                        }`}>
                                        {rec.type === 'lab' ? <Beaker size={28} /> :
                                            rec.type === 'imaging' ? <Camera size={28} /> :
                                                rec.type === 'surgery' ? <Scissors size={28} /> :
                                                    <Stethoscope size={28} />}
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-3">
                                            <h4 className="text-xl font-black text-slate-900 leading-none">{rec.title}</h4>
                                            {rec.abnormal && (
                                                <span className="text-[9px] font-black bg-red-50 text-red-500 px-2 py-0.5 rounded border border-red-100 uppercase tracking-widest">CRITICAL</span>
                                            )}
                                            <span className="text-[9px] font-black bg-slate-50 text-slate-400 px-2 py-0.5 rounded border border-slate-100 uppercase tracking-widest">{rec.status}</span>
                                        </div>
                                        <div className="flex gap-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] pt-1">
                                            <span className="flex items-center gap-2"><Calendar size={12} /> {rec.date}</span>
                                            <span className="flex items-center gap-2"><Activity size={12} /> {rec.provider}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-all scale-95 group-hover:scale-100">
                                    <button className="p-4 bg-slate-50 text-slate-500 hover:bg-slate-900 hover:text-white rounded-2xl transition-all border border-slate-100">
                                        <Eye size={18} />
                                    </button>
                                    <button className="p-4 bg-olive-50 text-olive-600 hover:bg-olive-600 hover:text-white rounded-2xl transition-all border border-olive-100">
                                        <Download size={18} />
                                    </button>
                                    <button className="p-4 bg-white border border-slate-100 text-slate-900 rounded-2xl flex items-center gap-2 font-black text-[10px] uppercase tracking-widest hover:bg-slate-50">
                                        Details <ChevronRight size={14} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Empty State */}
                {!loading && filteredRecords.length === 0 && (
                    <div className="py-20 text-center space-y-4">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
                            <FileText size={40} />
                        </div>
                        <div>
                            <p className="text-xl font-black text-slate-900">No records found</p>
                            <p className="text-sm font-bold text-slate-400">Your clinical history is empty or filtered out</p>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}

