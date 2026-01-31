"use client";
import { X, Download, Printer, ZoomIn, ZoomOut } from "lucide-react";


interface ReportModalProps {
    imageUrl?: string;
    title: string;
    onClose: () => void;
    data?: {
        type: "lab" | "radiology";
        patientName: string;
        mrn: string;
        date: string;
        results?: {
            testName: string;
            value: string;
            unit: string;
            referenceRange: string;
            abnormalFlag: boolean;
        }[];
        radiology?: {
            findings: string;
            impression: string;
            recommendations?: string;
        };
    };
}

export default function ReportModal({ imageUrl, title, onClose, data }: ReportModalProps) {
    const handlePrint = () => {
        window.print();
    };

    const handleDownload = () => {
        // In a real app, this might trigger a PDF download.
        // For now, we'll suggest printing to PDF.
        alert("Preparing document for download. Please select 'Save as PDF' in the print dialog.");
        window.print();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/90 backdrop-blur-sm p-0 md:p-10 no-print">
            <div className="relative w-full max-w-5xl h-full flex flex-col bg-white rounded-none md:rounded-[40px] shadow-2xl overflow-hidden border border-white/20 print:shadow-none print:border-none print:rounded-none">

                {/* Modal Header - Hidden on Print */}
                <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50 no-print">
                    <div>
                        <h3 className="text-xl font-black text-slate-900 tracking-tight">{title}</h3>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Official Medical Record • Non-Transferable</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={handlePrint}
                            className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-slate-900 transition-colors shadow-sm"
                            title="Print Report"
                        >
                            <Printer size={18} />
                        </button>
                        <button
                            onClick={handleDownload}
                            className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-slate-900 transition-colors shadow-sm"
                            title="Download PDF"
                        >
                            <Download size={18} />
                        </button>
                        <button
                            onClick={onClose}
                            className="p-3 bg-slate-900 text-white rounded-2xl hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 overflow-auto bg-slate-100/50 p-4 md:p-12 print:p-0 print:bg-white">
                    <div className="mx-auto bg-white p-8 md:p-12 shadow-2xl rounded-lg border border-slate-200 print:shadow-none print:border-none print:p-0 w-full max-w-4xl min-h-full">

                        {/* Medical Record Header - Visible on Print */}
                        <div className="flex justify-between items-start border-b-2 border-slate-900 pb-8 mb-8">
                            <div>
                                <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">MEDICORE <span className="text-olive-600">ENTERPRISE</span></h1>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em] mt-1 italic">Clinical Diagnostics Division</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Medical Record Number</p>
                                <p className="text-xl font-mono font-bold text-slate-900">{data?.mrn || "N/A"}</p>
                            </div>
                        </div>

                        {/* Patient & Report Info */}
                        <div className="grid grid-cols-2 gap-8 mb-12">
                            <div>
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Patient Name</h4>
                                <p className="text-lg font-black text-slate-900 uppercase italic">{data?.patientName || "John Doe"}</p>
                            </div>
                            <div className="text-right">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Date of Report</h4>
                                <p className="text-lg font-black text-slate-900 italic">{data?.date || new Date().toLocaleDateString()}</p>
                            </div>
                        </div>

                        <div className="mb-12">
                            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight italic border-b border-slate-100 pb-2 mb-6">{title}</h2>

                            {/* RESULTS SECTION */}
                            {data?.type === 'lab' && data.results && (
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b-2 border-slate-100">
                                            <th className="py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Test Description</th>
                                            <th className="py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Result</th>
                                            <th className="py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Units</th>
                                            <th className="py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Reference Range</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {data.results.map((res, idx) => (
                                            <tr key={idx} className={res.abnormalFlag ? "bg-red-50/50" : ""}>
                                                <td className="py-5 text-sm font-bold text-slate-900 uppercase tracking-tight">{res.testName}</td>
                                                <td className={`py-5 text-lg font-black italic tracking-tighter ${res.abnormalFlag ? "text-red-600" : "text-slate-900"}`}>
                                                    {res.value}
                                                    {res.abnormalFlag && <span className="text-[10px] font-black ml-2 animate-pulse font-sans not-italic uppercase">[Critical]</span>}
                                                </td>
                                                <td className="py-5 text-xs text-slate-500 font-bold uppercase">{res.unit}</td>
                                                <td className="py-5 text-xs text-slate-500 font-medium font-mono">{res.referenceRange}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}

                            {data?.type === 'radiology' && data.radiology && (
                                <div className="space-y-8">
                                    <div>
                                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Clinical Findings</h4>
                                        <p className="text-sm font-medium text-slate-800 leading-relaxed italic bg-slate-50 p-6 rounded-2xl border border-slate-100">{data.radiology.findings}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 text-olive-600">Impression</h4>
                                        <p className="text-md font-black text-slate-900 leading-relaxed italic border-l-4 border-olive-500 pl-6">{data.radiology.impression}</p>
                                    </div>
                                    {data.radiology.recommendations && (
                                        <div>
                                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Recommendations</h4>
                                            <p className="text-sm font-medium text-slate-600 leading-relaxed">{data.radiology.recommendations}</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Fallback to Image if no structured data provided */}
                            {!data && imageUrl && (
                                <div className="relative w-full shadow-lg rounded-lg overflow-hidden border border-slate-100 mt-8">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={imageUrl} alt={title} className="w-full h-auto" />
                                </div>
                            )}
                        </div>

                        {/* Footer & Signature */}
                        <div className="mt-20 flex justify-between items-end border-t border-slate-100 pt-8">
                            <div className="max-w-xs">
                                <p className="text-[8px] text-slate-400 leading-relaxed">
                                    This report is generated electronically. Results should be interpreted in the context of clinical findings.
                                    Confidential Medical Information intended for the designated recipient.
                                </p>
                            </div>
                            <div className="text-right">
                                <div className="h-12 w-48 border-b border-slate-300 mb-2 font-black text-slate-300 italic flex items-end justify-center pb-1 text-sm tracking-widest uppercase">Digital Signature</div>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Authorized Clinical Pathologist</p>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Footer / Controls - Hidden on Print */}
                <div className="p-6 bg-slate-50/80 border-t border-slate-100 flex justify-center gap-6 no-print">
                    <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all">
                        <ZoomOut size={14} /> Zoom Out
                    </button>
                    <div className="h-4 w-px bg-slate-200 self-center" />
                    <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all">
                        <ZoomIn size={14} /> Zoom In
                    </button>
                    <div className="h-4 w-px bg-slate-200 self-center" />
                    <p className="text-[9px] self-center font-bold text-slate-400 uppercase tracking-widest">Page 1 of 1</p>
                </div>
            </div>

            {/* Print Styles */}
            <style jsx global>{`
                @media print {
                    .no-print { display: none !important; }
                    body { background: white !important; margin: 0 !important; padding: 0 !important; }
                    .print-content { width: 100% !important; margin: 0 !important; }
                }
            `}</style>
        </div>
    );
}
