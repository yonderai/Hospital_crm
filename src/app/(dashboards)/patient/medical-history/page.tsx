"use client";

import { useState, useEffect } from "react";
import {
    FileText,
    Upload,
    Search,
    Calendar,
    Eye,
    Clock,
    CheckCircle,
    XCircle,
    Plus,
    Paperclip,
    FlaskConical
} from "lucide-react";
import ReportModal from "@/components/doctor/ReportModal";
import { format } from "date-fns";

export default function MedicalHistoryPage() {
    const [activeTab, setActiveTab] = useState("results");
    const [documents, setDocuments] = useState<any[]>([]);
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [previewDoc, setPreviewDoc] = useState<any | null>(null);
    const [selectedReport, setSelectedReport] = useState<any | null>(null);

    // Upload States
    const [file, setFile] = useState<File | null>(null);
    const [docType, setDocType] = useState("other");
    const [notes, setNotes] = useState("");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [docsRes, resultsRes] = await Promise.all([
                fetch("/api/patient/documents"),
                fetch("/api/patient/results")
            ]);

            const docsData = await docsRes.json();
            const resultsData = await resultsRes.json();

            if (docsData.documents) setDocuments(docsData.documents);
            if (resultsData.results) setResults(resultsData.results);

        } catch (err) {
            console.error("Failed to fetch data", err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);
        formData.append("documentType", docType);
        formData.append("notes", notes);

        try {
            const res = await fetch("/api/patient/documents", {
                method: "POST",
                body: formData,
            });

            if (res.ok) {
                setFile(null);
                setNotes("");
                setDocType("other");
                fetchData();
                alert("Document uploaded successfully!");
            } else {
                const error = await res.json();
                alert(error.error || "Upload failed");
            }
        } catch (err) {
            console.error("Upload error", err);
            alert("Something went wrong");
        } finally {
            setUploading(false);
        }
    };

    const filteredDocs = documents.filter(doc =>
        doc.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.documentType.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredResults = results.filter(res =>
        res.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        res.summary.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Medical History</h2>
                    <p className="text-slate-500 font-medium mt-1">Access your clinical results and manage uploaded records.</p>
                </div>

                <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
                    <Search className="text-slate-400 ml-2" size={18} />
                    <input
                        type="text"
                        placeholder="Search records..."
                        className="outline-none text-sm font-medium p-2 w-64"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Tabs */}
            <div className="flex space-x-8 border-b border-slate-200">
                <button
                    onClick={() => setActiveTab("results")}
                    className={`pb-4 text-sm font-black uppercase tracking-widest border-b-4 transition-all ${activeTab === "results"
                        ? "border-olive-600 text-olive-600"
                        : "border-transparent text-slate-400 hover:text-slate-600"
                        }`}
                >
                    Clinical Results
                </button>
                <button
                    onClick={() => setActiveTab("uploads")}
                    className={`pb-4 text-sm font-black uppercase tracking-widest border-b-4 transition-all ${activeTab === "uploads"
                        ? "border-olive-600 text-olive-600"
                        : "border-transparent text-slate-400 hover:text-slate-600"
                        }`}
                >
                    Uploaded Records
                </button>
            </div>

            {/* Content Area */}
            {activeTab === "results" && (
                <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                        <h3 className="text-xl font-bold text-slate-900">Lab & Radiology Results</h3>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-[.2em]">{filteredResults.length} Reports Found</div>
                    </div>

                    <div className="divide-y divide-slate-50">
                        {loading ? (
                            Array(3).fill(0).map((_, i) => (
                                <div key={i} className="p-8 animate-pulse flex items-center gap-6">
                                    <div className="w-14 h-14 bg-slate-100 rounded-2xl" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 bg-slate-100 rounded-lg w-1/3" />
                                        <div className="h-3 bg-slate-100 rounded-lg w-1/4" />
                                    </div>
                                </div>
                            ))
                        ) : filteredResults.length === 0 ? (
                            <div className="p-20 text-center space-y-4">
                                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-200">
                                    <FlaskConical size={32} />
                                </div>
                                <div className="space-y-1">
                                    <p className="font-bold text-slate-900 text-lg">No clinical results found</p>
                                    <p className="text-slate-400 text-xs">Your test results will appear here once finalized.</p>
                                </div>
                            </div>
                        ) : (
                            filteredResults.map((item) => (
                                <div key={item.id} className="p-8 flex items-center justify-between hover:bg-slate-50/50 transition-all group">
                                    <div className="flex items-center gap-6">
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm
                                            ${item.type === 'lab' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'}
                                        `}>
                                            {item.type === 'lab' ? <FlaskConical size={24} /> : <Eye size={24} />}
                                        </div>

                                        <div>
                                            <div className="flex items-center gap-3">
                                                <p className="font-bold text-slate-900 text-lg">{item.title}</p>
                                                <span className="text-[9px] font-black uppercase tracking-widest px-2 py-1 bg-slate-100 text-slate-500 rounded-lg">
                                                    {item.status}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-4 mt-2">
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1">
                                                    <Calendar size={12} />
                                                    {format(new Date(item.date), "MMM dd, yyyy HH:mm")}
                                                </p>
                                                <p className="text-xs text-slate-600 font-medium italic">
                                                    "{item.summary}"
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => setSelectedReport({
                                            title: item.type === 'lab' ? `Lab Report: ${item.title}` : `Imaging Report: ${item.title}`,
                                            data: {
                                                type: item.type,
                                                patientName: "My Record", // Ideally fetch from user context
                                                mrn: "SELF-VIEW",
                                                date: format(new Date(item.date), "MMM dd, yyyy HH:mm"),
                                                results: item.type === 'lab' ? item.details.results : undefined,
                                                radiology: item.type === 'radiology' ? {
                                                    findings: item.details.report?.findings,
                                                    impression: item.details.report?.impression,
                                                    recommendations: item.details.report?.recommendations
                                                } : undefined
                                            }
                                        })}
                                        className="px-6 py-3 rounded-2xl bg-white border border-slate-200 text-slate-600 font-bold text-xs uppercase tracking-widest hover:text-white hover:bg-slate-900 hover:border-slate-900 transition-all shadow-sm flex items-center gap-2"
                                    >
                                        View Report <Eye size={14} />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {activeTab === "uploads" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Upload Form Column */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-8 space-y-6 sticky top-8">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 bg-olive-100 rounded-xl flex items-center justify-center text-olive-600">
                                    <Upload size={20} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900">Upload New File</h3>
                            </div>

                            <form onSubmit={handleUpload} className="space-y-5">
                                <div
                                    className={`border-2 border-dashed rounded-[32px] p-10 text-center transition-all cursor-pointer bg-slate-50/50 hover:bg-slate-50
                       ${file ? 'border-olive-500 bg-olive-50/30' : 'border-slate-200'}
                     `}
                                    onClick={() => document.getElementById('fileInput')?.click()}
                                >
                                    <input
                                        id="fileInput"
                                        type="file"
                                        className="hidden"
                                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                                        accept=".pdf,.jpg,.png"
                                    />
                                    {file ? (
                                        <div className="space-y-2">
                                            <FileText className="mx-auto text-olive-600" size={40} />
                                            <p className="text-sm font-bold text-olive-900 truncate px-4">{file.name}</p>
                                            <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            <Upload className="mx-auto text-slate-300" size={40} />
                                            <p className="text-sm font-bold text-slate-600">Drop files here or click to browse</p>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">PDF, JPG, PNG (Max 5MB)</p>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Document Type</label>
                                    <select
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold text-slate-900 outline-none focus:ring-2 ring-olive-100 transition-all appearance-none cursor-pointer"
                                        value={docType}
                                        onChange={(e) => setDocType(e.target.value)}
                                    >
                                        <option value="prescription">Prescription</option>
                                        <option value="lab_report">Lab Report</option>
                                        <option value="discharge_summary">Discharge Summary</option>
                                        <option value="insurance_claim">Insurance Document</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Notes (Optional)</label>
                                    <textarea
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-medium text-slate-900 outline-none focus:ring-2 ring-olive-100 transition-all min-h-[100px]"
                                        placeholder="Enter any additional details..."
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={!file || uploading}
                                    className={`w-full py-4 rounded-2xl font-bold text-sm transition-all shadow-lg
                       ${file && !uploading
                                            ? 'bg-olive-600 text-white shadow-olive-600/20 hover:bg-olive-700'
                                            : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'}
                     `}
                                >
                                    {uploading ? "Uploading..." : "Save Document"}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* List Column */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
                            <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                                <h3 className="text-xl font-bold text-slate-900">Your Records Timeline</h3>
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-[.2em]">{filteredDocs.length} Total Files</div>
                            </div>

                            <div className="divide-y divide-slate-50">
                                {loading ? (
                                    Array(3).fill(0).map((_, i) => (
                                        <div key={i} className="p-8 animate-pulse flex items-center gap-6">
                                            <div className="w-14 h-14 bg-slate-100 rounded-2xl" />
                                            <div className="flex-1 space-y-2">
                                                <div className="h-4 bg-slate-100 rounded-lg w-1/3" />
                                                <div className="h-3 bg-slate-100 rounded-lg w-1/4" />
                                            </div>
                                        </div>
                                    ))
                                ) : filteredDocs.length === 0 ? (
                                    <div className="p-20 text-center space-y-4">
                                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-200">
                                            <Paperclip size={32} />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="font-bold text-slate-900 text-lg">No documents found</p>
                                            <p className="text-slate-400 text-xs">Start by uploading your first medical record</p>
                                        </div>
                                    </div>
                                ) : (
                                    filteredDocs.map((doc) => (
                                        <div key={doc._id} className="p-8 flex items-center justify-between hover:bg-slate-50/50 transition-all group">
                                            <div className="flex items-center gap-6">
                                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm
                            ${doc.documentType === 'prescription' ? 'bg-blue-50 text-blue-600' :
                                                        doc.documentType === 'lab_report' ? 'bg-purple-50 text-purple-600' :
                                                            'bg-slate-100 text-slate-500'}
                          `}>
                                                    <FileText size={24} />
                                                </div>

                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <p className="font-bold text-slate-900">{doc.fileName}</p>
                                                    </div>
                                                    <div className="flex items-center gap-4 mt-1">
                                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1">
                                                            <Calendar size={12} />
                                                            {format(new Date(doc.createdAt), "MMM dd, yyyy HH:mm")}
                                                        </p>
                                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1">
                                                            <Paperclip size={12} />
                                                            {doc.documentType.replace('_', ' ')}
                                                        </p>
                                                    </div>
                                                    {doc.notes && <p className="text-xs text-slate-500 mt-2 font-medium bg-slate-50/50 p-2 rounded-lg border border-slate-100">{doc.notes}</p>}
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => setPreviewDoc(doc)}
                                                className="p-4 rounded-2xl bg-white border border-slate-100 text-slate-400 hover:text-olive-600 hover:border-olive-200 hover:shadow-md transition-all shadow-sm"
                                            >
                                                <Eye size={20} />
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* DOCUMENT PREVIEW MODAL */}
            {previewDoc && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-5xl h-[90vh] rounded-[48px] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
                        {/* Modal Header */}
                        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-olive-50 rounded-2xl flex items-center justify-center text-olive-600">
                                    <FileText size={24} />
                                </div>
                                <div>
                                    <h4 className="text-xl font-black text-slate-900 tracking-tight italic uppercase">{previewDoc.fileName}</h4>
                                    <p className="text-[10px] text-olive-600 font-black uppercase tracking-widest mt-1">
                                        {previewDoc.documentType.replace('_', ' ')} • Uploaded on {format(new Date(previewDoc.createdAt), "MMM dd, yyyy HH:mm")}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <a
                                    href={previewDoc.fileUrl}
                                    download
                                    className="flex items-center gap-2 px-6 py-3 bg-slate-50 text-slate-600 hover:bg-slate-100 rounded-2xl font-bold text-xs uppercase transition-all"
                                >
                                    Download File
                                </a>
                                <button
                                    onClick={() => setPreviewDoc(null)}
                                    className="w-12 h-12 flex items-center justify-center bg-red-50 text-red-500 hover:bg-red-100 rounded-2xl transition-all"
                                >
                                    <Plus size={24} className="rotate-45" />
                                </button>
                            </div>
                        </div>

                        {/* Modal Body (Iframe for PDF / Img for Images) */}
                        <div className="flex-1 bg-slate-50 p-8 overflow-hidden">
                            <div className="w-full h-full rounded-[32px] border border-slate-200 bg-white overflow-hidden shadow-inner flex items-center justify-center">
                                {previewDoc.mimeType === 'application/pdf' ? (
                                    <iframe
                                        src={`${previewDoc.fileUrl}#toolbar=0`}
                                        className="w-full h-full border-none"
                                    />
                                ) : (
                                    <img
                                        src={previewDoc.fileUrl}
                                        alt={previewDoc.fileName}
                                        className="max-w-full max-h-full object-contain"
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* GENERATED REPORT MODAL */}
            {selectedReport && (
                <ReportModal
                    title={selectedReport.title}
                    data={selectedReport.data}
                    onClose={() => setSelectedReport(null)}
                />
            )}
        </div>
    );
}
