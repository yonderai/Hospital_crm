"use client";

import DashboardLayout from "@/components/DashboardLayout";
import {
    Shield,
    AlertCircle,
    CheckCircle,
    Clock,
    Activity,
    Search,
    Filter,
    Download,
    ChevronRight,
    MoreVertical,
    ArrowUpRight,
    ArrowDownRight,
    Users,
    User,
    Award,
    Eye,
    Edit3,
    Check,
    AlertTriangle
} from "lucide-react";
import { useState, useEffect } from "react";

export default function ComplianceDirectory() {
    const [complianceData, setComplianceData] = useState<any[]>([]);
    const [stats, setStats] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("All");
    const [filterDept, setFilterDept] = useState("All");
    const [filterRisk, setFilterRisk] = useState("All");

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/hr/compliance');
                const data = await res.json();
                if (data.data) setComplianceData(data.data);
                if (data.stats) setStats(data.stats);
            } catch (error) {
                console.error("Failed to fetch compliance data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredData = complianceData.filter(item => {
        const name = item.name || "";
        const id = item.id || "";
        const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === "All" || item.status === filterStatus;
        const matchesDept = filterDept === "All" || item.department === filterDept;
        const matchesRisk = filterRisk === "All" || item.riskLevel === filterRisk;
        return matchesSearch && matchesStatus && matchesDept && matchesRisk;
    });

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const paginatedData = filteredData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, filterStatus, filterDept, filterRisk]);

    const departments = ["All", ...Array.from(new Set(complianceData.map(c => c.department)))];

    return (
        <DashboardLayout>
            <div className="space-y-10 pb-10 fade-in">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Staff Compliance</h2>
                        <p className="text-olive-600 text-[11px] font-black mt-1 uppercase tracking-[0.4em]">Governance • Risk • Registry</p>
                    </div>
                    <div className="flex gap-4">
                        <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">
                            <Download size={16} /> Generate Report
                        </button>
                    </div>
                </div>

                {/* Summary Cards */}
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
                                    <ComplianceStatIcon icon={stat.icon} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Directory Container */}
                <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden flex flex-col min-h-[600px]">
                    {/* Filters Header */}
                    <div className="p-8 border-b border-slate-50 flex flex-col gap-6 bg-slate-50/10">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                            <div className="flex items-center gap-6 w-full md:w-auto">
                                <h3 className="text-xl font-black text-slate-900 tracking-tight whitespace-nowrap">Compliance Registry</h3>
                                <div className="flex items-center gap-3 bg-white border border-slate-100 px-5 py-3 rounded-2xl w-full md:w-96 shadow-sm focus-within:border-olive-400 transition-all">
                                    <Search size={18} className="text-slate-400" />
                                    <input
                                        placeholder="Search Staff Name or ID..."
                                        className="bg-transparent border-none outline-none text-sm font-medium text-slate-900 w-full"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-3 w-full md:w-auto">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Filter by:</span>
                                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                                    <select
                                        className="bg-white border border-slate-100 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 focus:outline-none focus:border-olive-400"
                                        value={filterDept}
                                        onChange={(e) => setFilterDept(e.target.value)}
                                    >
                                        <option value="All">All Departments</option>
                                        {departments.filter(d => d !== "All").map(d => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                    <select
                                        className="bg-white border border-slate-100 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 focus:outline-none focus:border-olive-400"
                                        value={filterStatus}
                                        onChange={(e) => setFilterStatus(e.target.value)}
                                    >
                                        <option value="All">All Status</option>
                                        <option value="Compliant">Compliant</option>
                                        <option value="Pending">Pending</option>
                                        <option value="Overdue">Overdue</option>
                                        <option value="Under Review">Under Review</option>
                                    </select>
                                    <select
                                        className="bg-white border border-slate-100 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 focus:outline-none focus:border-olive-400"
                                        value={filterRisk}
                                        onChange={(e) => setFilterRisk(e.target.value)}
                                    >
                                        <option value="All">All Risk</option>
                                        <option value="Low">Low Risk</option>
                                        <option value="Medium">Medium Risk</option>
                                        <option value="High">High Risk</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Table Section */}
                    <div className="flex-1 overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="sticky top-0 bg-white z-10">
                                <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50">
                                    <th className="px-8 py-6">Compliance Node</th>
                                    <th className="px-8 py-6">Staff Member</th>
                                    <th className="px-8 py-6">Policy Type</th>
                                    <th className="px-8 py-6 text-center">Risk</th>
                                    <th className="px-8 py-6">Status</th>
                                    <th className="px-8 py-6">Next Review</th>
                                    <th className="px-8 py-6 text-right pr-12">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {loading ? [...Array(6)].map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={7} className="px-8 py-6 h-20 bg-slate-50/30"></td>
                                    </tr>
                                )) : paginatedData.map((item, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col">
                                                <span className="text-[11px] font-black text-slate-900 bg-slate-100 w-max px-2.5 py-1 rounded-lg mb-1">{item.id}</span>
                                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Reviewer: {item.assignedTo}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-white transition-colors">
                                                    <User size={18} />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-black text-slate-900 leading-none mb-1">{item.name}</span>
                                                    <span className="text-[10px] font-bold text-olive-600 uppercase tracking-tighter">{item.department}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-slate-600 mb-1">{item.complianceType}</span>
                                                <span className="text-[10px] text-slate-400 font-medium">Last: {item.lastReview}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex justify-center">
                                                <RiskIndicator level={item.riskLevel} />
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <StatusBadge status={item.status} />
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`text-[11px] font-black ${item.status === 'Overdue' ? 'text-red-500' : 'text-slate-600'}`}>
                                                {item.nextReview}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right pr-12">
                                            <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="p-2.5 hover:bg-white hover:shadow-sm text-slate-400 hover:text-olive-600 rounded-xl transition-all" title="View Details">
                                                    <Eye size={16} />
                                                </button>
                                                <button className="p-2.5 hover:bg-white hover:shadow-sm text-slate-400 hover:text-blue-600 rounded-xl transition-all" title="Edit">
                                                    <Edit3 size={16} />
                                                </button>
                                                <button className="p-2.5 hover:bg-white hover:shadow-sm text-slate-400 hover:text-green-600 rounded-xl transition-all" title="Approve">
                                                    <Check size={16} />
                                                </button>
                                                <button className="p-2.5 hover:bg-white hover:shadow-sm text-slate-400 hover:text-red-600 rounded-xl transition-all" title="Escalate">
                                                    <AlertTriangle size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {!loading && filteredData.length === 0 && (
                            <div className="py-20 text-center">
                                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No compliance records found</p>
                            </div>
                        )}
                    </div>

                    {/* Pagination Footer */}
                    <div className="p-8 bg-slate-50/10 border-t border-slate-50 flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-widest">
                        <span>Showing {Math.min(filteredData.length, (currentPage - 1) * itemsPerPage + 1)}-{Math.min(filteredData.length, currentPage * itemsPerPage)} of {filteredData.length} Records</span>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                                className="hover:text-olive-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
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
                                className="hover:text-olive-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .fade-in { animation: fadeIn 0.6s ease-out; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </DashboardLayout>
    );
}

function ComplianceStatIcon({ icon }: { icon: string }) {
    if (icon === "Users") return <Users size={20} />;
    if (icon === "CheckCircle") return <CheckCircle size={20} />;
    if (icon === "Clock") return <Clock size={20} />;
    if (icon === "AlertCircle") return <AlertCircle size={20} />;
    if (icon === "Activity") return <Activity size={20} />;
    return <Shield size={20} />;
}

function StatusBadge({ status }: { status: string }) {
    const styles: any = {
        'Compliant': 'bg-green-100 text-green-700 border-green-200',
        'Pending': 'bg-orange-100 text-orange-700 border-orange-200',
        'Overdue': 'bg-red-100 text-red-700 border-red-200',
        'Under Review': 'bg-blue-100 text-blue-700 border-blue-200'
    };
    return (
        <span className={`text-[9px] font-black px-3 py-1.5 rounded-full border uppercase tracking-wider ${styles[status]}`}>
            {status}
        </span>
    );
}

function RiskIndicator({ level }: { level: string }) {
    const styles: any = {
        'Low': 'bg-green-500',
        'Medium': 'bg-orange-500',
        'High': 'bg-red-500'
    };
    return (
        <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${styles[level]}`}></div>
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-tighter">{level}</span>
        </div>
    );
}
