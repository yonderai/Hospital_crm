"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Scan, Calendar, FileText, ChevronDown, ChevronUp, Clock, CheckCircle2, AlertCircle, Aperture, User as UserIcon } from "lucide-react";

interface RadiologyResult {
    _id: string;
    patientId: string;
    orderedBy: {
        firstName: string;
        lastName: string;
        department: string;
    };
    imagingType: string;
    bodyPart: string;
    reasonForStudy: string;
    status: "ordered" | "scheduled" | "completed" | "cancelled";
    completedAt?: string;
    createdAt: string;
    report?: {
        findings: string;
        impression: string;
        recommendations?: string;
        status: string;
        interpretedBy: {
            firstName: string;
            lastName: string;
        };
        signedAt?: string;
    };
}

export default function PatientRadiologyReportsPage() {
    const [results, setResults] = useState<RadiologyResult[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedReport, setSelectedReport] = useState<RadiologyResult | null>(null);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const res = await fetch("/api/patient/radiology-reports");
                if (res.ok) {
                    const data = await res.json();
                    setResults(data);
                }
            } catch (error) {
                console.error("Failed to fetch radiology reports:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, []);

    const getStatusConfig = (status: string) => {
        switch (status) {
            case "completed":
                return { label: "Finalized", color: "text-blue-600 bg-blue-50", icon: CheckCircle2 };
            case "cancelled":
                return { label: "Cancelled", color: "text-red-600 bg-red-50", icon: AlertCircle };
            case "ordered":
                return { label: "Ordered", color: "text-slate-600 bg-slate-50", icon: Aperture };
            default:
                return { label: "Processing", color: "text-yellow-600 bg-yellow-50", icon: Clock };
        }
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="p-10 text-slate-400 font-bold animate-pulse">Accessing imaging database...</div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="space-y-8">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Radiology Studies</h1>
                    <p className="text-blue-600 text-sm font-bold mt-2">View imaging prescriptions and expert interpretations</p>
                </div>

                {results.length === 0 ? (
                    <div className="bg-white rounded-[40px] p-20 text-center border border-slate-100 shadow-sm">
                        <Scan size={64} className="mx-auto text-slate-200 mb-4" />
                        <p className="text-slate-400 font-black uppercase tracking-widest">No imaging records found</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {results.map((result) => {
                            const status = getStatusConfig(result.status);
                            const Icon = status.icon;

                            return (
                                <div
                                    key={result._id}
                                    onClick={() => result.report && setSelectedReport(result)}
                                    className={`bg-white rounded-[40px] p-8 border border-slate-100 transition-all ${result.report
                                        ? 'cursor-pointer hover:shadow-2xl hover:border-blue-200 group'
                                        : 'opacity-80'
                                        }`}
                                >
                                    <div className="flex flex-col h-full space-y-6">
                                        <div className="flex items-start justify-between">
                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${status.color}`}>
                                                <Icon size={28} />
                                            </div>
                                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${status.color}`}>
                                                {status.label}
                                            </span>
                                        </div>

                                        <div>
                                            <h3 className="text-2xl font-black text-slate-900 leading-tight">
                                                {result.imagingType}
                                            </h3>
                                            <p className="text-sm font-bold text-slate-500 mt-1 uppercase tracking-tighter">{result.bodyPart}</p>
                                        </div>

                                        <div className="pt-6 border-t border-slate-50 mt-auto">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Prescribed By</p>
                                            <p className="text-sm font-bold text-slate-900">Dr. {result.orderedBy?.firstName} {result.orderedBy?.lastName}</p>
                                            <p className="text-xs text-slate-500">{result.orderedBy?.department}</p>
                                        </div>

                                        {result.report ? (
                                            <div className="pt-4 flex items-center justify-between text-blue-600 group-hover:translate-x-1 transition-transform">
                                                <span className="text-xs font-black uppercase tracking-widest">Explore Interpretation</span>
                                                <FileText size={20} />
                                            </div>
                                        ) : (
                                            <div className="pt-4 flex items-center gap-2 text-slate-400">
                                                <Clock size={16} />
                                                <span className="text-xs font-bold italic">Awaiting technical review</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Radiology Report Modal */}
                {selectedReport && selectedReport.report && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xl animate-in fade-in duration-300">
                        <div className="bg-white w-full max-w-5xl rounded-[60px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
                            {/* Modal Header */}
                            <div className="p-12 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
                                <div className="flex items-center gap-6">
                                    <div className="w-20 h-20 bg-blue-600 text-white rounded-3xl flex items-center justify-center shadow-lg shadow-blue-600/30">
                                        <Scan size={40} />
                                    </div>
                                    <div>
                                        <h2 className="text-4xl font-black text-slate-900 tracking-tight">Radiology Interpretation</h2>
                                        <div className="flex items-center gap-3 mt-2">
                                            <span className="px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-[10px] font-black uppercase tracking-widest">
                                                {selectedReport.imagingType}
                                            </span>
                                            <span className="text-slate-400 font-bold text-xs uppercase tracking-widest">• ID: {selectedReport._id.slice(-8).toUpperCase()}</span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedReport(null)}
                                    className="w-16 h-16 flex items-center justify-center bg-white hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-[32px] transition-all border border-slate-100 shadow-sm"
                                >
                                    ✕
                                </button>
                            </div>

                            {/* Modal Content */}
                            <div className="flex-1 overflow-y-auto p-12 space-y-12">
                                {/* Study Info */}
                                <div className="grid grid-cols-2 gap-12">
                                    <div className="space-y-6">
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3">Clinical Indication</p>
                                            <div className="p-8 bg-slate-50 rounded-[32px] border border-slate-100">
                                                <p className="text-sm font-medium text-slate-700 leading-relaxed italic">
                                                    “{selectedReport.reasonForStudy}”
                                                </p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-6">
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Body Region</p>
                                                <p className="text-sm font-black text-slate-900 tracking-tight">{selectedReport.bodyPart}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Acquisition Date</p>
                                                <p className="text-sm font-black text-slate-900">
                                                    {selectedReport.completedAt ? new Date(selectedReport.completedAt).toLocaleDateString() : 'Pending'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-8">
                                        <div className="p-8 bg-blue-50/50 rounded-[40px] border border-blue-100">
                                            <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] mb-4">Final Impression</p>
                                            <p className="text-xl font-black text-blue-900 leading-tight">
                                                {selectedReport.report.impression}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-4 px-6 py-4 bg-slate-50 rounded-2xl border border-slate-100">
                                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-slate-200">
                                                <UserIcon size={18} className="text-slate-400" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Interpreted By</p>
                                                <p className="text-sm font-bold text-slate-900">Dr. {selectedReport.report.interpretedBy.firstName} {selectedReport.report.interpretedBy.lastName}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Findings */}
                                <div className="space-y-6">
                                    <h4 className="text-xl font-black text-slate-900 uppercase tracking-widest border-l-4 border-blue-600 pl-4">Radiological Findings</h4>
                                    <div className="p-10 bg-white border border-slate-100 rounded-[48px] shadow-sm">
                                        <p className="text-base text-slate-700 leading-[1.8] font-medium whitespace-pre-wrap">
                                            {selectedReport.report.findings}
                                        </p>
                                    </div>
                                </div>

                                {/* Recommendations */}
                                {selectedReport.report.recommendations && (
                                    <div className="space-y-6">
                                        <h4 className="text-xl font-black text-slate-900 uppercase tracking-widest border-l-4 border-yellow-500 pl-4">Recommendations</h4>
                                        <div className="p-10 bg-yellow-50/30 border border-yellow-100 rounded-[48px]">
                                            <p className="text-base text-slate-800 leading-relaxed font-bold">
                                                {selectedReport.report.recommendations}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Modal Footer */}
                            <div className="p-12 border-t border-slate-50 bg-slate-50/30 flex justify-between items-center mt-auto">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em]">Electronically Validated Report</p>
                                <div className="flex items-center gap-2 px-6 py-3 bg-white rounded-full shadow-sm border border-slate-100">
                                    <CheckCircle2 size={16} className="text-blue-600" />
                                    <span className="text-[10px] font-black text-blue-900 uppercase tracking-widest">Verified Signature Locked</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
