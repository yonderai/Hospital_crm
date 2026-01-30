"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { Activity, LayoutGrid, Search, Filter, Plus, ArrowUpRight, DollarSign, Users, Calendar, Beaker, FileText, CheckCircle, Package, AlertCircle, Ticket } from "lucide-react";
import { useState, useEffect } from "react";

interface ModulePageProps {
    title: string;
    subtitle: string;
    description: string;
    icon: any;
    dataEndpoint?: string; // URL to fetch data from
    disableLayout?: boolean; // Optional: Disable DashboardLayout wrapper
}

export default function GenericModulePage({ title, subtitle, description, icon: Icon, dataEndpoint, disableLayout }: ModulePageProps) {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any[]>([]);
    const [stats, setStats] = useState<any[]>([
        { label: "Active Requests", value: "24", change: "+12.5%", icon: Activity, color: "text-olive-600", bg: "bg-olive-50" },
        { label: "Pending Review", value: "08", change: "-3", icon: FileText, color: "text-orange-600", bg: "bg-orange-50" },
        { label: "Completion Rate", value: "98.2%", change: "+5.2%", icon: Activity, color: "text-blue-600", bg: "bg-blue-50" },
        { label: "System Load", value: "Optimal", change: "1.2%", icon: LayoutGrid, color: "text-green-600", bg: "bg-green-50" },
    ]);

    useEffect(() => {
        if (dataEndpoint) {
            setLoading(true);
            fetch(dataEndpoint)
                .then(res => res.json())
                .then(json => {
                    if (json.data) setData(json.data);
                    if (json.stats) setStats(json.stats);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Failed to fetch module data", err);
                    setLoading(false);
                });
        } else {
            // Mock Fallback
            const timer = setTimeout(() => {
                setData([
                    { id: "REQ-001", name: "Standard Protocol V3", status: "Active", date: "2024-01-20", value: "₹12,400" },
                    { id: "REQ-002", name: "Inventory Audit Alpha", status: "Pending", date: "2024-01-21", value: "₹8,200" },
                ]);
                setLoading(false);
            }, 600);
            return () => clearTimeout(timer);
        }
    }, [dataEndpoint]);

    // Search Filtering
    const [searchTerm, setSearchTerm] = useState("");

    // Normalize string: remove special chars, lowercase
    const normalize = (text: any) => {
        if (!text) return "";
        return text.toString().toLowerCase().replace(/[^a-z0-9]/g, "");
    };

    // Filter Logic
    const [showFilter, setShowFilter] = useState(false);
    const [filterStatus, setFilterStatus] = useState("All");

    const displayData = data.filter(item => {
        const search = normalize(searchTerm);
        const matchesSearch = !search || (
            normalize(item.name).includes(search) ||
            normalize(item.id).includes(search) ||
            normalize(item.status).includes(search) ||
            normalize(item.date).includes(search) ||
            normalize(item.value).includes(search)
        );

        const matchesFilter = filterStatus === "All" || normalize(item.status) === normalize(filterStatus);

        return matchesSearch && matchesFilter;
    });

    // Extract unique statuses for filter dropdown
    const uniqueStatuses = ["All", ...Array.from(new Set(data.map(item => item.status || "Unknown")))];

    // Icon mapping request
    const getIcon = (iconName: string) => {
        if (iconName === 'Users') return Users;
        if (iconName === 'FileText') return FileText;
        if (iconName === 'CheckCircle') return CheckCircle;
        if (iconName === 'LayoutGrid') return LayoutGrid;
        if (iconName === 'Package') return Package;
        if (iconName === 'DollarSign') return DollarSign;
        if (iconName === 'AlertCircle') return AlertCircle;
        if (iconName === 'Ticket') return Ticket;
        return Activity;
    };

    if (disableLayout) {
        return (
            <div className="space-y-10">
                {/* Header Section */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">{title}</h2>
                        <p className="text-olive-600 text-[10px] font-black mt-1 uppercase tracking-[0.3em]">{subtitle}</p>
                    </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {loading ? [...Array(4)].map((_, i) => (
                        <div key={i} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm animate-pulse h-24"></div>
                    )) : stats.map((s, i) => {
                        const IconComponent = typeof s.icon === 'string' ? getIcon(s.icon) : s.icon;
                        return (
                            <div key={i} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-center justify-between group hover:border-olive-400 transition-all cursor-default relative overflow-hidden">
                                <div className="relative z-10">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{s.label}</p>
                                    <p className="text-3xl font-black text-slate-900 tracking-tighter">{s.value}</p>
                                    <div className="mt-2 flex items-center gap-1">
                                        <span className={`text-[10px] font-bold ${s.change?.startsWith('+') ? 'text-olive-600' : 'text-red-500'}`}>{s.change}</span>
                                        <ArrowUpRight size={10} className={s.change?.startsWith('+') ? 'text-olive-600' : 'text-red-500'} />
                                    </div>
                                </div>
                                <div className={`p-4 ${s.bg || 'bg-slate-50'} ${s.color || 'text-slate-600'} rounded-2xl relative z-10`}>
                                    <IconComponent size={24} />
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Main Content Area */}
                <div className="w-full bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                        <div>
                            <h3 className="text-xl font-black text-slate-900 tracking-tight">{title} Directory</h3>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Records</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input
                                    type="text"
                                    placeholder="Search records..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-500/10 w-64 transition-all"
                                />
                            </div>
                            <div className="relative">
                                <button
                                    onClick={() => setShowFilter(!showFilter)}
                                    className={`px-4 py-2.5 border rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${showFilter || filterStatus !== 'All' ? 'bg-olive-50 border-olive-200 text-olive-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                                >
                                    <Filter size={16} />
                                    <span>{filterStatus === 'All' ? 'Filter' : filterStatus}</span>
                                </button>

                                {showFilter && (
                                    <div className="absolute right-0 top-12 w-48 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden">
                                        <div className="p-2 space-y-1">
                                            {uniqueStatuses.map(status => (
                                                <button
                                                    key={status}
                                                    onClick={() => {
                                                        setFilterStatus(status);
                                                        setShowFilter(false);
                                                    }}
                                                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all ${filterStatus === status ? 'bg-olive-50 text-olive-700' : 'text-slate-600 hover:bg-slate-50'}`}
                                                >
                                                    {status}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 overflow-x-auto">
                        {loading ? (
                            <div className="p-8 space-y-4">
                                {[...Array(5)].map((_, i) => <div key={i} className="h-12 bg-slate-50 rounded-xl animate-pulse"></div>)}
                            </div>
                        ) : (
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                                        <th className="px-8 py-6">ID / MRN</th>
                                        <th className="px-8 py-6">Name / Description</th>
                                        <th className="px-8 py-6">Status</th>
                                        <th className="px-8 py-6">Date</th>
                                        <th className="px-8 py-6 text-right pr-12">Details</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {displayData.map((item, idx) => (
                                        <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="px-8 py-6">
                                                <span className="text-sm font-black text-slate-900">{item.id}</span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-slate-700">{item.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest border ${item.status === 'Active' || item.status === 'Admitted' || item.status === 'Completed' ? 'bg-olive-50 text-olive-600 border-olive-100' :
                                                    'bg-slate-50 text-slate-400 border-slate-100'
                                                    }`}>
                                                    {item.status}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-xs font-bold text-slate-500">{item.date}</td>
                                            <td className="px-8 py-6 text-right pr-12">
                                                <span className="text-sm font-black text-slate-900">{item.value}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                    <div className="p-6 bg-slate-50/30 border-t border-slate-50 text-center">
                        <button className="text-xs font-black text-olive-700 uppercase tracking-widest hover:underline">Load More Records</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <DashboardLayout>
            <div className="space-y-10">
                {/* Header Section */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">{title}</h2>
                        <p className="text-olive-600 text-[10px] font-black mt-1 uppercase tracking-[0.3em]">{subtitle}</p>
                    </div>
                    {/* ... (buttons remain same) ... */}
                    <div className="flex gap-4">
                        <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all">
                            Generate Report
                        </button>
                    </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {loading ? [...Array(4)].map((_, i) => (
                        <div key={i} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm animate-pulse h-24"></div>
                    )) : stats.map((s, i) => {
                        const IconComponent = typeof s.icon === 'string' ? getIcon(s.icon) : s.icon;
                        return (
                            <div key={i} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-center justify-between group hover:border-olive-400 transition-all cursor-default relative overflow-hidden">
                                <div className="relative z-10">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{s.label}</p>
                                    <p className="text-3xl font-black text-slate-900 tracking-tighter">{s.value}</p>
                                    <div className="mt-2 flex items-center gap-1">
                                        <span className={`text-[10px] font-bold ${s.change?.startsWith('+') ? 'text-olive-600' : 'text-red-500'}`}>{s.change}</span>
                                        <ArrowUpRight size={10} className={s.change?.startsWith('+') ? 'text-olive-600' : 'text-red-500'} />
                                    </div>
                                </div>
                                <div className={`p-4 ${s.bg || 'bg-slate-50'} ${s.color || 'text-slate-600'} rounded-2xl relative z-10`}>
                                    <IconComponent size={24} />
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Main Content Area */}
                {/* Main Content Area */}
                <div className="w-full bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                        <div>
                            <h3 className="text-xl font-black text-slate-900 tracking-tight">{title} Directory</h3>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Records</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input
                                    type="text"
                                    placeholder="Search records..."
                                    className="pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-slate-500/10 w-64 transition-all"
                                />
                            </div>
                            <button className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 font-bold text-xs flex items-center gap-2 hover:bg-slate-50 hover:border-slate-300 transition-all">
                                <Filter size={16} />
                                <span>Filter</span>
                            </button>
                        </div>
                    </div>
                    <div className="flex-1 overflow-x-auto">
                        {loading ? (
                            <div className="p-8 space-y-4">
                                {[...Array(5)].map((_, i) => <div key={i} className="h-12 bg-slate-50 rounded-xl animate-pulse"></div>)}
                            </div>
                        ) : (
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                                        <th className="px-8 py-6">ID / MRN</th>
                                        <th className="px-8 py-6">Name / Description</th>
                                        <th className="px-8 py-6">Status</th>
                                        <th className="px-8 py-6">Date</th>
                                        <th className="px-8 py-6 text-right pr-12">Details</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {displayData.map((item, idx) => (
                                        <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="px-8 py-6">
                                                <span className="text-sm font-black text-slate-900">{item.id}</span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-slate-700">{item.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest border ${item.status === 'Active' || item.status === 'Admitted' || item.status === 'Completed' ? 'bg-olive-50 text-olive-600 border-olive-100' :
                                                    'bg-slate-50 text-slate-400 border-slate-100'
                                                    }`}>
                                                    {item.status}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-xs font-bold text-slate-500">{item.date}</td>
                                            <td className="px-8 py-6 text-right pr-12">
                                                <span className="text-sm font-black text-slate-900">{item.value}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                    <div className="p-6 bg-slate-50/30 border-t border-slate-50 text-center">
                        <button className="text-xs font-black text-olive-700 uppercase tracking-widest hover:underline">Load More Records</button>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

function QuickFeature({ label }: { label: string }) {
    return (
        <div className="px-4 py-3 bg-slate-50 rounded-2xl border border-slate-100 text-[10px] font-black text-slate-600 uppercase tracking-widest text-center hover:bg-olive-50 hover:border-olive-200 transition-all cursor-default">
            {label}
        </div>
    );
}
