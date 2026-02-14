"use client";

import DashboardLayout from "@/components/DashboardLayout";
import {
    AlertCircle,
    Clock,
    CheckCircle,
    Activity,
    Calendar,
    Search,
    Filter,
    MoreVertical,
    Download,
    ChevronRight,
    ArrowUpRight,
    ArrowDownRight,
    User
} from "lucide-react";
import { useState, useEffect } from "react";

export default function ComplaintsPortal() {
    const [complaints, setComplaints] = useState<any[]>([]);
    const [stats, setStats] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("All");

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        const fetchComplaints = async () => {
            try {
                const res = await fetch('/api/hr/complaints');
                const data = await res.json();
                if (data.data) setComplaints(data.data);
                if (data.stats) setStats(data.stats);
            } catch (error) {
                console.error("Failed to fetch complaints", error);
            } finally {
                setLoading(false);
            }
        };
        fetchComplaints();
    }, []);

    // Reset to page 1 on search or filter change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, filterStatus]);

    const filteredComplaints = complaints.filter(c => {
        const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === "All" || c.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    // Pagination Logic
    const totalPages = Math.ceil(filteredComplaints.length / itemsPerPage);
    const paginatedComplaints = filteredComplaints.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <DashboardLayout>
            <div className="space-y-10 pb-10 fade-in">
                {/* Header Section remains same */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Complaints Portal</h2>
                        <p className="text-olive-600 text-[11px] font-black mt-1 uppercase tracking-[0.4em]">Governance • Risk • Compliance</p>
                    </div>
                    <div className="flex gap-4">
                        <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">
                            <Download size={16} /> Export PDF
                        </button>
                    </div>
                </div>

                {/* Summary Cards remain same */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                    {loading ? [...Array(5)].map((_, i) => (
                        <div key={i} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm animate-pulse h-32"></div>
                    )) : stats.map((stat, i) => (
                        <div key={i} className={`p-6 rounded-[32px] border border-slate-100 shadow-sm transition-all hover:scale-[1.02] cursor-default bg-white group hover:border-olive-400`}>
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                                    <p className="text-3xl font-black text-slate-900 tracking-tighter">{stat.value}</p>
                                    <div className="mt-2 flex items-center gap-1">
                                        {stat.change.startsWith('+') ?
                                            <ArrowUpRight size={12} className="text-olive-600" /> :
                                            <ArrowDownRight size={12} className="text-red-500" />
                                        }
                                        <span className={`text-[10px] font-bold ${stat.change.startsWith('+') ? 'text-olive-600' : 'text-red-500'}`}>
                                            {stat.change}
                                        </span>
                                    </div>
                                </div>
                                <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                                    <StatIcon label={stat.label} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Directory Section */}
                <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden min-h-[500px] flex flex-col">
                    <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6 bg-slate-50/20">
                        <div className="flex items-center gap-6 w-full md:w-auto">
                            <h3 className="text-xl font-black text-slate-900 tracking-tight whitespace-nowrap">Complaints Directory</h3>
                            <div className="flex items-center gap-3 bg-white border border-slate-100 px-5 py-3 rounded-2xl w-full md:w-96 shadow-sm focus-within:border-olive-400 transition-all">
                                <Search size={18} className="text-slate-400" />
                                <input
                                    placeholder="Search Patient, Category, or ID..."
                                    className="bg-transparent border-none outline-none text-sm font-medium text-slate-900 w-full"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                            {["All", "Pending", "In Review", "Resolved", "Escalated"].map(status => (
                                <button
                                    key={status}
                                    onClick={() => setFilterStatus(status)}
                                    className={`px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${filterStatus === status ? 'bg-olive-700 text-white' : 'bg-white border border-slate-100 text-slate-400 hover:border-olive-200'}`}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="sticky top-0 bg-white z-10">
                                <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50">
                                    <th className="px-8 py-6">ID / Ticket</th>
                                    <th className="px-8 py-6">Stakeholder</th>
                                    <th className="px-8 py-6">Category</th>
                                    <th className="px-8 py-6">Priority</th>
                                    <th className="px-8 py-6">Status</th>
                                    <th className="px-8 py-6 text-right pr-12">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {loading ? [...Array(4)].map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={6} className="px-8 py-6 h-20 bg-slate-50/30"></td>
                                    </tr>
                                )) : paginatedComplaints.map((comp, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-8 py-6">
                                            <span className="text-xs font-black text-slate-900 bg-slate-100 px-3 py-1.5 rounded-lg">{comp.id}</span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                                                    <User size={20} />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-black text-slate-900 leading-none mb-1">{comp.name}</span>
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{comp.date}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-slate-600 mb-1">{comp.category}</span>
                                                <span className="text-[11px] text-slate-400 font-medium truncate max-w-[200px]">{comp.description}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <PriorityBadge priority={comp.priority} />
                                        </td>
                                        <td className="px-8 py-6">
                                            <StatusPill status={comp.status} />
                                        </td>
                                        <td className="px-8 py-6 text-right pr-12">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="p-2.5 hover:bg-olive-50 text-olive-600 rounded-xl transition-all" title="View Details">
                                                    <ChevronRight size={18} />
                                                </button>
                                                <button className="p-2.5 hover:bg-slate-100 text-slate-400 rounded-xl transition-all">
                                                    <MoreVertical size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {!loading && filteredComplaints.length === 0 && (
                            <div className="py-20 text-center">
                                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No records found matching your criteria</p>
                            </div>
                        )}
                    </div>

                    <div className="p-8 bg-slate-50/30 border-t border-slate-50 flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-widest">
                        <span>Showing {Math.min(filteredComplaints.length, (currentPage - 1) * itemsPerPage + 1)}-{Math.min(filteredComplaints.length, currentPage * itemsPerPage)} of {filteredComplaints.length} Records</span>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                                className={`hover:text-olive-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed`}
                            >
                                Previous
                            </button>
                            <div className="flex items-center gap-2">
                                {Array.from({ length: totalPages }).map((_, i) => (
                                    <button
                                        key={i + 1}
                                        onClick={() => setCurrentPage(i + 1)}
                                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${currentPage === i + 1 ? 'bg-olive-700 text-white shadow-lg' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                disabled={currentPage === totalPages || totalPages === 0}
                                className={`hover:text-olive-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed`}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .fade-in {
                    animation: fadeIn 0.6s ease-out;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </DashboardLayout>
    );
}

function DetailItem({ label, value }: { label: string, value: string }) {
    return (
        <div className="space-y-1">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
            <p className="text-base font-bold text-slate-900 leading-tight">{value}</p>
        </div>
    );
}

function StatIcon({ label }: { label: string }) {
    if (label.includes("Active")) return <AlertCircle size={20} />;
    if (label.includes("Pending")) return <Clock size={20} />;
    if (label.includes("Resolved")) return <CheckCircle size={20} />;
    if (label.includes("Escalated")) return <Activity size={20} />;
    return <Calendar size={20} />;
}

function PriorityBadge({ priority }: { priority: string }) {
    const styles: any = {
        Low: "bg-blue-50 text-blue-600 border-blue-100",
        Medium: "bg-green-50 text-green-600 border-green-100",
        High: "bg-orange-50 text-orange-600 border-orange-100",
        Critical: "bg-red-50 text-red-600 border-red-100 shadow-sm"
    };
    return (
        <span className={`text-[9px] font-black px-3 py-1.5 rounded-lg border uppercase tracking-wider ${styles[priority] || styles.Medium}`}>
            {priority}
        </span>
    );
}

function StatusPill({ status }: { status: string }) {
    const styles: any = {
        'Pending': 'bg-slate-100 text-slate-500',
        'In Review': 'bg-orange-100 text-orange-600',
        'Resolved': 'bg-olive-100 text-olive-700',
        'Escalated': 'bg-purple-100 text-purple-700'
    };
    return (
        <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${styles[status]?.replace('bg-', 'bg-').replace('text-', 'bg-') || 'bg-slate-400'}`}></div>
            <span className={`text-[10px] font-black uppercase tracking-widest ${styles[status] || styles.Pending} px-3 py-1 rounded-full`}>
                {status}
            </span>
        </div>
    );
}
