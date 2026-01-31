"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
    FileText,
    Search,
    Calendar,
    Eye,
    Plus,
    FlaskConical,
    Activity,
    ChevronRight,
    Beaker,
    Aperture
} from "lucide-react";
import ReportModal from "@/components/doctor/ReportModal";
import { format } from "date-fns";

export default function PatientReportsPage() {
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedReport, setSelectedReport] = useState<any | null>(null);
    const [activeFilter, setActiveFilter] = useState<"all" | "lab" | "radiology">("all");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/patient/results");
            const data = await res.json();
            if (data.results) setResults(data.results);
        } catch (err) {
            console.error("Failed to fetch reports", err);
        } finally {
            setLoading(false);
        }
    };

    const filteredResults = results.filter(res => {
        const matchesSearch = res.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            res.summary.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = activeFilter === "all" || res.type === activeFilter;
        return matchesSearch && matchesFilter;
    });

    return (
        <DashboardLayout>
            <div className="space-y-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h2 className="text-4xl font-black text-slate-900 tracking-tight">Report Viewer</h2>
                        <p className="text-slate-500 font-medium mt-2">Access your official lab results and radiology findings.</p>
                    </div>

                    <div className="flex items-center gap-4 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
                        <Search className="text-slate-400 ml-2" size={20} />
                        <input
                            type="text"
                            placeholder="Search reports..."
                            className="outline-none text-sm font-medium p-2 w-64"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setActiveFilter("all")}
                        className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeFilter === "all"
                                ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20"
                                : "bg-white text-slate-500 border border-slate-200 hover:border-slate-300"
                            }`}
                    >
                        All Reports
                    </button>
                    <button
                        onClick={() => setActiveFilter("lab")}
                        className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeFilter === "lab"
                                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                                : "bg-white text-slate-500 border border-slate-200 hover:border-slate-300"
                            }`}
                    >
                        <Beaker size={14} />
                        Lab Results
                    </button>
                    <button
                        onClick={() => setActiveFilter("radiology")}
                        className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeFilter === "radiology"
                                ? "bg-purple-600 text-white shadow-lg shadow-purple-600/20"
                                : "bg-white text-slate-500 border border-slate-200 hover:border-slate-300"
                            }`}
                    >
                        <Aperture size={14} />
                        Radiology
                    </button>
                </div>

                {/* Reports Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                        Array(6).fill(0).map((_, i) => (
                            <div key={i} className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm animate-pulse space-y-4">
                                <div className="w-12 h-12 bg-slate-100 rounded-2xl" />
                                <div className="space-y-2">
                                    <div className="h-6 bg-slate-100 rounded w-3/4" />
                                    <div className="h-4 bg-slate-100 rounded w-1/2" />
                                </div>
                                <div className="pt-4 flex justify-between">
                                    <div className="h-10 bg-slate-100 rounded w-24" />
                                    <div className="h-10 bg-slate-100 rounded w-10" />
                                </div>
                            </div>
                        ))
                    ) : filteredResults.length === 0 ? (
                        <div className="col-span-full py-24 text-center bg-slate-50 rounded-[40px] border border-slate-100 border-dashed">
                            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                                <FileText className="text-slate-200" size={32} />
                            </div>
                            <h3 className="text-xl font-black text-slate-900 leading-tight">No reports found</h3>
                            <p className="text-slate-500 font-medium text-sm mt-2">Adjust your filters or check back later.</p>
                        </div>
                    ) : (
                        filteredResults.map((item) => (
                            <div
                                key={item.id}
                                className="group bg-white rounded-[40px] border border-slate-100 shadow-sm hover:shadow-2xl hover:border-olive-200 transition-all p-8 flex flex-col justify-between"
                            >
                                <div>
                                    <div className="flex justify-between items-start mb-6">
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform ${item.type === 'lab'
                                                ? 'bg-gradient-to-br from-blue-500 to-indigo-600'
                                                : 'bg-gradient-to-br from-purple-500 to-pink-600'
                                            }`}>
                                            {item.type === 'lab' ? <Beaker className="text-white" size={24} /> : <Aperture className="text-white" size={24} />}
                                        </div>
                                        <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${item.status === 'final' || item.status === 'completed'
                                                ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                                : 'bg-amber-50 text-amber-600 border border-amber-100'
                                            }`}>
                                            {item.status}
                                        </span>
                                    </div>

                                    <h4 className="text-xl font-black text-slate-900 leading-tight mb-2 group-hover:text-olive-700 transition-colors">{item.title}</h4>
                                    <p className="text-sm font-medium text-slate-500 line-clamp-2 mb-4 italic">{item.summary}</p>

                                    <div className="flex items-center gap-3 text-xs font-bold text-slate-400 capitalize">
                                        <Calendar size={14} className="text-slate-300" />
                                        {format(new Date(item.date), "MMM dd, yyyy • HH:mm")}
                                    </div>
                                </div>

                                <div className="mt-8">
                                    <button
                                        onClick={() => setSelectedReport({
                                            title: item.type === 'lab' ? `Lab Report: ${item.title}` : `Imaging Report: ${item.title}`,
                                            data: {
                                                type: item.type,
                                                patientName: "My Record",
                                                mrn: "SELF-VIEW",
                                                date: format(new Date(item.date), "MMM dd, yyyy HH:mm"),
                                                testName: item.title,
                                                results: item.type === 'lab' ? (item.details.results || [{
                                                    testName: item.details.testType || item.title,
                                                    value: item.details.resultValue || 'N/A',
                                                    unit: item.details.unit || '',
                                                    referenceRange: item.details.referenceRange || 'N/A',
                                                    abnormalFlag: item.details.abnormalFlag || false
                                                }]) : undefined,
                                                radiology: item.type === 'radiology' ? {
                                                    findings: item.details.report?.findings || 'No findings available',
                                                    impression: item.details.report?.impression || item.details.report?.interpretation || 'No impression available',
                                                    recommendations: item.details.report?.recommendations
                                                } : undefined
                                            }
                                        })}
                                        className="w-full bg-slate-50 group-hover:bg-olive-600 group-hover:text-white border border-slate-100 group-hover:border-olive-500 p-4 rounded-2xl flex items-center justify-between text-slate-600 font-black text-xs uppercase tracking-widest transition-all"
                                    >
                                        View Full Report
                                        <ChevronRight size={18} className="transition-transform group-hover:translate-x-1" />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Report Details Modal */}
                {selectedReport && (
                    <ReportModal
                        title={selectedReport.title}
                        data={selectedReport.data}
                        onClose={() => setSelectedReport(null)}
                    />
                )}
            </div>
        </DashboardLayout>
    );
}
