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
    Download,
    Eye,
    Settings
} from "lucide-react";

export default function AdminPatientsPage() {
    const [patients, setPatients] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulating data fetch for Admin view
        setTimeout(() => {
            setPatients([
                { id: "1", firstName: "Alice", lastName: "Cooper", mrn: "88234", status: "Admitted", lastVisit: "Jan 21, 2026", condition: "Post-Op Recovery", department: "Surgical", priority: "Routine" },
                { id: "2", firstName: "Jim", lastName: "Morrison", mrn: "44102", status: "Discharged", lastVisit: "Jan 20, 2026", condition: "Routine Checkup", department: "OPD", priority: "Low" },
                { id: "3", firstName: "Janis", lastName: "Joplin", mrn: "12903", status: "Emergency", lastVisit: "Jan 22, 2026", condition: "Acute Respiratory", department: "ER", priority: "Urgent" },
                { id: "4", firstName: "Kurt", lastName: "Cobain", mrn: "55812", status: "In-Patient", lastVisit: "Jan 18, 2026", condition: "Chronic Pain", department: "Oncology", priority: "Medium" },
                { id: "5", firstName: "Jimi", lastName: "Hendrix", mrn: "33941", status: "Admitted", lastVisit: "Jan 21, 2026", condition: "Cardiovascular", department: "Cardiology", priority: "High" },
            ]);
            setLoading(false);
        }, 800);
    }, []);

    return (
        <DashboardLayout>
            <div className="space-y-10">
                {/* Header Section */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Master Patient Index</h2>
                        <p className="text-slate-500 text-sm font-medium mt-1 uppercase tracking-widest">Enterprise Registry • Hospital-Wide Access</p>
                    </div>
                    <div className="flex gap-4">
                        <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-xs uppercase tracking-widest shadow-sm hover:bg-slate-50 transition-all">
                            <Download size={16} /> Export Records
                        </button>

                    </div>
                </div>

                {/* Top Insights */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <InsightCard label="Total Registered" value="12,482" detail="+124 this month" />
                    <InsightCard label="Active In-Patients" value="342" detail="86% occupancy" />
                    <InsightCard label="ER Admissions" value="18" detail="Last 24 hours" />
                    <InsightCard label="Archive Records" value="85k+" detail="FHIR Compliant" />
                </div>

                {/* Central Registry Table */}
                <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden min-h-[500px]">
                    <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/20">
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-3 bg-white border border-slate-100 px-4 py-2.5 rounded-2xl w-80 shadow-sm focus-within:border-olive-400 transition-all">
                                <Search size={18} className="text-slate-400" />
                                <input placeholder="Search MRN, Name, or ID..." className="bg-transparent border-none outline-none text-sm font-medium text-slate-900 w-full" />
                            </div>
                            <div className="flex gap-2">
                                <FilterBadge label="All Depts" active />
                                <FilterBadge label="Emergency" />
                                <FilterBadge label="Surgical" />
                            </div>
                        </div>
                        <Settings size={20} className="text-slate-300 cursor-pointer hover:text-slate-600" />
                    </div>

                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50">
                                <th className="px-8 py-6">Patient Identifier</th>
                                <th className="px-8 py-6">Classification</th>
                                <th className="px-8 py-6">Current Status</th>
                                <th className="px-8 py-6">Last Activity</th>
                                <th className="px-8 py-6 text-right pr-12">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                [...Array(5)].map((_, i) => <tr key={i}><td colSpan={5} className="h-20 animate-pulse bg-slate-50/30" /></tr>)
                            ) : (
                                patients.map((p, idx) => (
                                    <tr key={idx} className="group hover:bg-slate-50/50 transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 font-black text-[10px] border border-slate-200 group-hover:bg-white group-hover:border-olive-200 transition-all">
                                                    {p.firstName[0]}{p.lastName[0]}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-slate-900 tracking-tight">{p.firstName} {p.lastName}</p>
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">MRN-{p.mrn}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-xs font-bold text-slate-600">
                                            {p.department} Unit
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest border ${p.status === 'Emergency' ? 'bg-red-50 text-red-600 border-red-100' :
                                                p.status === 'Discharged' ? 'bg-slate-50 text-slate-400 border-slate-200' :
                                                    'bg-olive-50 text-olive-600 border-olive-100'
                                                }`}>
                                                {p.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-xs text-slate-500 font-medium">{p.lastVisit}</td>
                                        <td className="px-8 py-6 text-right pr-8">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                                <button className="p-2.5 bg-white border border-slate-100 text-slate-400 hover:text-olive-700 rounded-xl shadow-sm transition-all"><Eye size={16} /></button>
                                                <button className="p-2.5 bg-white border border-slate-100 text-slate-400 hover:text-olive-700 rounded-xl shadow-sm transition-all"><FileText size={16} /></button>
                                                <button className="p-2.5 bg-olive-700 text-white rounded-xl shadow-lg shadow-olive-600/20 hover:bg-olive-800 transition-all ml-2"><ChevronRight size={16} /></button>
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

function InsightCard({ label, value, detail }: any) {
    return (
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
            <p className="text-3xl font-black text-slate-900 tracking-tighter mb-1">{value}</p>
            <p className="text-[10px] font-bold text-olive-600 uppercase tracking-tight">{detail}</p>
        </div>
    );
}

function FilterBadge({ label, active = false }: any) {
    return (
        <span className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest cursor-pointer transition-all border ${active ? 'bg-olive-700 text-white border-transparent' : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'}`}>
            {label}
        </span>
    );
}
