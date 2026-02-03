
"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
    Activity,
    Calendar,
    Clock,
    User,
    ChevronRight,
    FileText,
    Search,
    Scissors
} from "lucide-react";
import ReportModal from "@/components/doctor/ReportModal";
import { format } from "date-fns";

export default function PatientSurgeryPage() {
    const [surgeries, setSurgeries] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedReport, setSelectedReport] = useState<any | null>(null);

    useEffect(() => {
        const fetchSurgeries = async () => {
            try {
                const res = await fetch("/api/patient/surgery");
                if (res.ok) {
                    const data = await res.json();
                    setSurgeries(data);
                }
            } catch (err) {
                console.error("Failed to fetch surgeries:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchSurgeries();
    }, []);

    const filteredSurgeries = surgeries.filter(s =>
        s.procedureName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.surgeonId?.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.surgeonId?.lastName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <DashboardLayout>
            <div className="space-y-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-2 text-olive-700 font-black uppercase tracking-[0.2em] text-[10px] mb-2">
                            <Scissors size={14} /> Clinical Services
                        </div>
                        <h2 className="text-4xl font-black text-slate-900 tracking-tight italic uppercase">Surgical Portal</h2>
                        <p className="text-slate-500 font-medium mt-2">View your scheduled procedures and access official post-operative reports.</p>
                    </div>

                    <div className="flex items-center gap-4 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm focus-within:ring-2 ring-olive-100 transition-all">
                        <Search className="text-slate-400 ml-2" size={20} />
                        <input
                            type="text"
                            placeholder="Search procedures..."
                            className="outline-none text-sm font-medium p-2 w-64"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Main Content */}
                <div className="bg-white rounded-[48px] border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-10 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-olive-100 text-olive-700 rounded-2xl flex items-center justify-center">
                                <Activity size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 uppercase italic">Procedure History</h3>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Verified Hospital Records</p>
                            </div>
                        </div>
                    </div>

                    <div className="divide-y divide-slate-50">
                        {loading ? (
                            Array(3).fill(0).map((_, i) => (
                                <div key={i} className="p-10 animate-pulse flex items-center gap-8">
                                    <div className="w-16 h-16 bg-slate-100 rounded-3xl" />
                                    <div className="flex-1 space-y-3">
                                        <div className="h-6 bg-slate-100 rounded-lg w-1/4" />
                                        <div className="h-4 bg-slate-100 rounded-lg w-1/3" />
                                    </div>
                                </div>
                            ))
                        ) : filteredSurgeries.length === 0 ? (
                            <div className="p-24 text-center space-y-6">
                                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-200">
                                    <Scissors size={48} />
                                </div>
                                <div>
                                    <p className="text-2xl font-black text-slate-900 uppercase italic">No procedures logged</p>
                                    <p className="text-sm font-bold text-slate-400 max-w-sm mx-auto mt-2">Your surgical history is currently empty. If you believe this is an error, please contact the hospital administration.</p>
                                </div>
                            </div>
                        ) : (
                            filteredSurgeries.map((s) => (
                                <div key={s._id} className="p-10 flex flex-col md:flex-row md:items-center justify-between hover:bg-slate-50/50 transition-all group gap-8">
                                    <div className="flex items-center gap-8">
                                        <div className={`w-16 h-16 rounded-[28px] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform ${s.status === 'completed' ? 'bg-gradient-to-br from-olive-500 to-olive-700' : 'bg-gradient-to-br from-blue-500 to-indigo-600'}`}>
                                            <Activity className="text-white" size={28} />
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-3">
                                                <h4 className="text-2xl font-black text-slate-900 leading-none">{s.procedureName}</h4>
                                                <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${s.status === 'completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                                                    {s.status}
                                                </span>
                                            </div>
                                            <div className="flex flex-wrap gap-x-8 gap-y-2 text-[10px] font-black text-slate-400 uppercase tracking-widest pt-2">
                                                <span className="flex items-center gap-2"><Calendar size={12} className="text-olive-500" /> {format(new Date(s.scheduledDate), "MMMM dd, yyyy")}</span>
                                                <span className="flex items-center gap-2"><Clock size={12} className="text-olive-500" /> {s.startTime || "TBD"}</span>
                                                <span className="flex items-center gap-2"><User size={12} className="text-olive-500" /> Surgeon: {s.surgeonId ? `Dr. ${s.surgeonId.firstName} ${s.surgeonId.lastName}` : "Pending Assignment"}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {s.status === 'completed' ? (
                                        <button
                                            onClick={() => {
                                                if (!s.surgeryReport) {
                                                    alert("Report is finalized but data is syncing. Please refresh.");
                                                    console.log("Missing report data:", s);
                                                    return;
                                                }
                                                setSelectedReport({
                                                    title: `Surgical Report: ${s.procedureName}`,
                                                    data: {
                                                        type: 'surgery',
                                                        patientName: "My Record",
                                                        mrn: "SELF-VIEW",
                                                        date: format(new Date(s.surgeryReport.reportDate || s.updatedAt), "MMM dd, yyyy HH:mm"),
                                                        testName: s.procedureName,
                                                        surgery: {
                                                            preOpDiagnosis: s.surgeryReport.preOpDiagnosis,
                                                            postOpDiagnosis: s.surgeryReport.postOpDiagnosis,
                                                            findings: s.surgeryReport.findings,
                                                            procedureDetails: s.surgeryReport.procedureDetails,
                                                            postOpInstructions: s.surgeryReport.postOpInstructions,
                                                            surgeonName: s.surgeonId ? `Dr. ${s.surgeonId.firstName} ${s.surgeonId.lastName}` : "Unknown Surgeon"
                                                        }
                                                    }
                                                });
                                            }}
                                            className="flex items-center gap-3 px-8 py-4 bg-white border-2 border-slate-100 rounded-2xl text-slate-900 font-black text-[10px] uppercase tracking-[0.2em] shadow-sm hover:border-olive-500 hover:text-olive-700 transition-all group/btn"
                                        >
                                            View Report
                                            <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                                        </button>
                                    ) : (
                                        <div className="flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-4 py-2 rounded-xl border border-blue-100">
                                            <Clock size={14} /> Scheduled
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Info Card */}
                <div className="bg-[#0F172A] p-12 rounded-[48px] text-white relative overflow-hidden shadow-2xl">
                    <div className="relative z-10 max-w-xl space-y-6">
                        <h3 className="text-3xl font-black tracking-tight italic uppercase decoration-teal-400 underline underline-offset-8">Perioperative Care</h3>
                        <p className="text-slate-400 text-lg leading-relaxed font-medium">
                            Our surgical teams follow strict international protocols for patient safety. Post-operative reports are typically available within 24 hours of completion.
                        </p>
                    </div>
                    <Scissors className="absolute bottom-[-10%] right-[-5%] text-white/5 pointer-events-none" size={320} />
                </div>

                {/* Report Viewer Modal */}
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
