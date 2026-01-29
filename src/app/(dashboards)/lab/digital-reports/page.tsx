"use client";

import { useEffect, useState, useRef } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
    FileText,
    Search,
    Download,
    Eye,
    Calendar,
    User,
    Clock,
    AlertCircle,
    CheckCircle2,
    ArrowLeft,
    Printer
} from "lucide-react";

interface LabOrder {
    _id: string;
    orderId: string;
    patientId: {
        _id: string;
        firstName: string;
        lastName: string;
        mrn: string;
        gender: string;
        dob: string;
        contact: { phone: string; email: string };
    };
    orderingProviderId?: {
        firstName: string;
        lastName: string;
        department: string;
    };
    tests: string[];
    priority: string;
    status: string;
    createdAt: string;
    resultDate: string;
    reviewedBy?: {
        firstName: string;
        lastName: string;
    };
    results: {
        testName: string;
        value: string;
        unit: string;
        referenceRange: string;
        abnormalFlag: boolean;
        notes?: string;
    }[];
}

export default function DigitalReportsPage() {
    const [reports, setReports] = useState<LabOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedReport, setSelectedReport] = useState<LabOrder | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const reportRef = useRef<HTMLDivElement>(null);

    const fetchReports = async () => {
        try {
            const res = await fetch("/api/lab/completed-reports");
            if (res.ok) {
                const data = await res.json();
                setReports(data);
            }
        } catch (error) {
            console.error("Failed to fetch reports:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    const filteredReports = reports.filter(r =>
        `${r.patientId?.firstName} ${r.patientId?.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.patientId?.mrn.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handlePrint = () => {
        window.print();
    };

    if (selectedReport) {
        return (
            <DashboardLayout>
                <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <button
                        onClick={() => setSelectedReport(null)}
                        className="flex items-center gap-2 text-slate-500 hover:text-olive-600 font-black text-[10px] uppercase tracking-[0.2em] transition-all group"
                    >
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to All Reports
                    </button>

                    <div className="flex justify-between items-end">
                        <div>
                            <h2 className="text-4xl font-black text-slate-900 tracking-tight italic uppercase">Diagnostic Report</h2>
                            <p className="text-olive-600 text-sm font-bold mt-2 uppercase tracking-widest">ORDER #{selectedReport.orderId} • VERIFIED</p>
                        </div>
                        <div className="flex gap-4 print:hidden">
                            <button
                                onClick={handlePrint}
                                className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm"
                            >
                                <Printer size={18} /> Print
                            </button>
                            <button
                                onClick={handlePrint}
                                className="flex items-center gap-2 px-8 py-4 bg-slate-900 text-teal-300 rounded-[24px] font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-slate-900/20 hover:scale-105 active:scale-95 transition-all"
                            >
                                <Download size={18} /> Download PDF
                            </button>
                        </div>
                    </div>

                    <div ref={reportRef} className="bg-white rounded-[48px] border border-slate-100 shadow-2xl overflow-hidden p-16 space-y-12 print-container print:shadow-none print:border-none print:p-0 print:m-0">
                        {/* Report Header */}
                        <div className="flex justify-between items-start border-b border-slate-100 pb-12">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-olive-600 rounded-2xl flex items-center justify-center">
                                    <FileText className="text-white" size={32} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-olive-900 tracking-tighter uppercase leading-none">Medicore Diagnostics</h3>
                                    <p className="text-[10px] font-bold text-olive-600 tracking-[0.4em] uppercase mt-1">ISO 9001:2015 CERTIFIED</p>
                                </div>
                            </div>
                            <div className="text-right space-y-1">
                                <p className="text-sm font-black text-slate-900">Hospital Node 42</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Medical Center Blvd, Suite 100</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">+1 (800) 555-0199 • support@medicore.com</p>
                            </div>
                        </div>

                        {/* Patient & Order Info */}
                        <div className="grid grid-cols-2 gap-16">
                            <div className="space-y-6">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-2">Patient Information</h4>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-black text-slate-400 uppercase">Current Patient</span>
                                        <span className="text-sm font-black text-slate-900 uppercase"> {selectedReport.patientId?.firstName} {selectedReport.patientId?.lastName}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-black text-slate-400 uppercase">Patient MRN</span>
                                        <span className="text-sm font-bold text-slate-700">{selectedReport.patientId?.mrn}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-black text-slate-400 uppercase">Age / Gender</span>
                                        <span className="text-sm font-bold text-slate-700 uppercase">{selectedReport.patientId?.gender}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-6">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-2">Analysis Details</h4>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-black text-slate-400 uppercase">Ordering Physician</span>
                                        <span className="text-sm font-black text-slate-900 italic uppercase">
                                            {selectedReport.orderingProviderId ? `Dr. ${selectedReport.orderingProviderId.firstName} ${selectedReport.orderingProviderId.lastName}` : 'Walk-in'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-black text-slate-400 uppercase">Collection Date</span>
                                        <span className="text-sm font-bold text-slate-700">{new Date(selectedReport.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-black text-slate-400 uppercase">Reporting Date</span>
                                        <span className="text-sm font-bold text-slate-700">{new Date(selectedReport.resultDate).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Test Results Table */}
                        <div className="space-y-6">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-2">Clinical Findings</h4>
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">
                                        <th className="py-4 px-2">Test Name</th>
                                        <th className="py-4 px-2 text-center">Result</th>
                                        <th className="py-4 px-2 text-center">Unit</th>
                                        <th className="py-4 px-2 text-center">Reference Range</th>
                                        <th className="py-4 px-2 text-right">Flag</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {selectedReport.results.map((res, i) => (
                                        <tr key={i} className={`group ${res.abnormalFlag ? 'bg-red-50/30' : ''}`}>
                                            <td className="py-6 px-2">
                                                <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{res.testName}</p>
                                                {res.notes && <p className="text-[10px] text-slate-400 mt-1 italic">{res.notes}</p>}
                                            </td>
                                            <td className={`py-6 px-2 text-center text-sm font-black ${res.abnormalFlag ? 'text-red-600' : 'text-slate-900'}`}>
                                                {res.value}
                                            </td>
                                            <td className="py-6 px-2 text-center text-xs font-bold text-slate-500">{res.unit}</td>
                                            <td className="py-6 px-2 text-center text-xs font-bold text-slate-500">{res.referenceRange}</td>
                                            <td className="py-6 px-2 text-right">
                                                {res.abnormalFlag ? (
                                                    <span className="px-3 py-1 bg-red-600 text-white rounded-lg text-[8px] font-black uppercase tracking-widest shadow-lg shadow-red-200">Abnormal</span>
                                                ) : (
                                                    <span className="px-3 py-1 bg-olive-100 text-olive-700 rounded-lg text-[8px] font-black uppercase tracking-widest">Normal</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Report Footer */}
                        <div className="pt-12 border-t border-slate-100 flex justify-between items-end">
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 size={16} className="text-olive-600" />
                                    <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest italic">Report Electronically Verified</p>
                                </div>
                                <div className="flex gap-4 opacity-50">
                                    <p className="text-[8px] font-medium max-w-xs leading-relaxed text-slate-400 uppercase tracking-tighter">
                                        This is a computer generated diagnostic report and does not require a physical signature.
                                        Clinical correlation is advised for final diagnosis.
                                    </p>
                                </div>
                            </div>
                            <div className="text-center group">
                                <div className="h-20 w-48 border-b-2 border-slate-100 mb-2 flex items-center justify-center italic text-olive-600/30 font-serif text-2xl group-hover:text-olive-600 transition-colors">
                                    {selectedReport.reviewedBy?.firstName} {selectedReport.reviewedBy?.lastName}
                                </div>
                                <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">
                                    {selectedReport.reviewedBy ? `Verified By: ${selectedReport.reviewedBy.firstName} ${selectedReport.reviewedBy.lastName}` : 'Verified by Sentinel-X'}
                                </p>
                                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Consultant Pathologist</p>
                            </div>
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="space-y-10">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight italic uppercase">Digital Report Archive</h2>
                        <p className="text-slate-500 text-[10px] font-black mt-1 uppercase tracking-[0.3em]">Sentinel-X Secure Storage • {reports.length} Records</p>
                    </div>
                    <div className="flex items-center gap-4 bg-white border border-slate-100 px-6 py-3 rounded-2xl w-96 shadow-sm focus-within:border-olive-400 transition-all">
                        <Search size={18} className="text-slate-400" />
                        <input
                            type="text"
                            placeholder="Find Report by Name, MRN or ID..."
                            className="bg-transparent border-none outline-none text-sm font-bold text-slate-900 w-full placeholder:text-slate-300"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Reports List */}
                <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden min-h-[600px] flex flex-col">
                    <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                        <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                            <FileText size={20} className="text-olive-600" />
                            Completed Reports
                        </h3>
                    </div>

                    <div className="flex-1 overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] border-b border-slate-50">
                                    <th className="px-10 py-6">Patient & Record ID</th>
                                    <th className="px-10 py-6">Analyses Performed</th>
                                    <th className="px-10 py-6">Verification Date</th>
                                    <th className="px-10 py-6">Clinical Status</th>
                                    <th className="px-10 py-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {loading ? (
                                    <tr>
                                        <td colSpan={5} className="px-10 py-40 text-center">
                                            <div className="animate-pulse flex flex-col items-center gap-4">
                                                <Clock className="text-olive-200" size={48} />
                                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Accessing Cryptographic Vault...</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredReports.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-10 py-40 text-center">
                                            <p className="text-slate-400 font-bold italic tracking-tighter">No laboratory reports found matching your criteria.</p>
                                        </td>
                                    </tr>
                                ) : filteredReports.map((report) => (
                                    <tr key={report._id} className="group hover:bg-slate-50/50 transition-all">
                                        <td className="px-10 py-6">
                                            <p className="text-sm font-black text-slate-900 uppercase tracking-tight group-hover:text-olive-700 transition-colors">
                                                {report.patientId?.firstName} {report.patientId?.lastName}
                                            </p>
                                            <div className="flex items-center gap-3 mt-1">
                                                <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">MRN: {report.patientId?.mrn}</p>
                                                <div className="w-1 h-1 bg-slate-200 rounded-full" />
                                                <p className="text-[9px] text-olive-600 font-black uppercase tracking-widest italic">ID: {report.orderId}</p>
                                            </div>
                                        </td>
                                        <td className="px-10 py-6">
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider">{report.tests.join(", ")}</p>
                                            <p className="text-[9px] text-slate-400 mt-0.5 line-clamp-1 italic">{report.results.length} parameters analyzed</p>
                                        </td>
                                        <td className="px-10 py-6">
                                            <div className="flex items-center gap-2">
                                                <Calendar size={12} className="text-slate-300" />
                                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{new Date(report.resultDate).toLocaleDateString()}</p>
                                            </div>
                                            <p className="text-[9px] text-slate-400 mt-0.5 uppercase tracking-tighter pl-5 font-bold">Time: {new Date(report.resultDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                        </td>
                                        <td className="px-10 py-6">
                                            {report.results.some(r => r.abnormalFlag) ? (
                                                <span className="flex items-center gap-2 text-red-600">
                                                    <AlertCircle size={14} />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">Abnormal Findings</span>
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-2 text-olive-600">
                                                    <CheckCircle2 size={14} />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">Normal Range</span>
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-10 py-6 text-right">
                                            <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => setSelectedReport(report)}
                                                    className="p-3 bg-white border border-slate-100 text-slate-600 rounded-xl hover:text-olive-600 hover:shadow-lg transition-all"
                                                    title="View Report"
                                                >
                                                    <Eye size={18} />
                                                </button>
                                                <button
                                                    onClick={() => setSelectedReport(report)}
                                                    className="p-3 bg-slate-900 text-teal-300 rounded-xl hover:bg-olive-700 hover:text-white hover:shadow-lg transition-all"
                                                    title="Download Report"
                                                >
                                                    <Download size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <style jsx global>{`
                    @media print {
                        body * {
                            visibility: hidden;
                        }
                        .print-container, .print-container * {
                            visibility: visible;
                        }
                        .print-container {
                            position: absolute;
                            left: 0;
                            top: 0;
                            width: 100%;
                            padding: 0 !important;
                            margin: 0 !important;
                        }
                        header, aside, footer, .print\\:hidden, button {
                            display: none !important;
                        }
                    }
                `}</style>
            </div>
        </DashboardLayout>
    );
}
