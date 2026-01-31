
"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useParams, useRouter } from "next/navigation";
import {
    User, Phone, MapPin, Calendar, Activity,
    AlertCircle, FileText, Pill, Beaker, Plus, X, Check,
    History, Clipboard, ClipboardList, ChevronLeft, Clock, Eye
} from "lucide-react";
import Link from "next/link";

export default function PatientDetails() {
    const params = useParams();
    const router = useRouter();
    const [patient, setPatient] = useState<any>(null);
    const [prescriptions, setPrescriptions] = useState<any[]>([]);
    const [labs, setLabs] = useState<any[]>([]);
    const [documents, setDocuments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [previewDoc, setPreviewDoc] = useState<any | null>(null);

    // Modals
    const [showRxModal, setShowRxModal] = useState(false);
    const [showLabModal, setShowLabModal] = useState(false);

    // Form States
    const [rxData, setRxData] = useState({
        medications: [{ drugName: "", dosage: "", frequency: "", duration: "", route: "Oral", quantity: 1 }]
    });
    const [labData, setLabData] = useState({ testType: "", priority: "routine" });
    const [submitting, setSubmitting] = useState(false);

    const fetchData = async () => {
        if (!params.id) return;
        try {
            const [patientRes, rxRes, labRes] = await Promise.all([
                fetch(`/api/patients/${params.id}`),
                fetch(`/api/patients/${params.id}/prescriptions`),
                fetch(`/api/patients/${params.id}/labs`)
            ]);

            if (patientRes.ok) {
                const patientData = await patientRes.json();
                setPatient(patientData);
                // Fetch documents using the patient's ID
                const docRes = await fetch(`/api/patient/documents?patientId=${params.id}`);
                if (docRes.ok) {
                    const docData = await docRes.json();
                    setDocuments(docData.documents || []);
                }
            }
            if (rxRes.ok) setPrescriptions(await rxRes.json());
            if (labRes.ok) setLabs(await labRes.json());
        } catch (error) {
            console.error("Failed to fetch clinical data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [params.id]);

    const handleRxSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await fetch(`/api/patients/${params.id}/prescriptions`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(rxData)
            });
            if (res.ok) {
                setShowRxModal(false);
                setRxData({ medications: [{ drugName: "", dosage: "", frequency: "", duration: "", route: "Oral", quantity: 1 }] });
                fetchData();
            }
        } catch (error) { console.error(error); } finally { setSubmitting(false); }
    };

    const handleLabSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await fetch(`/api/patients/${params.id}/labs`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(labData)
            });
            if (res.ok) {
                setShowLabModal(false);
                setLabData({ testType: "", priority: "routine" });
                fetchData();
            }
        } catch (error) { console.error(error); } finally { setSubmitting(false); }
    };

    if (loading) return <DashboardLayout><div className="p-10 text-slate-400 font-bold animate-pulse">Synchronizing Clinical Records...</div></DashboardLayout>;
    if (!patient) return <DashboardLayout><div className="p-10 text-red-500 font-bold">Error: Clinical Subject Not Found</div></DashboardLayout>;

    return (
        <DashboardLayout>
            <div className="space-y-10 pb-20">
                {/* Top Action Bar */}
                <div className="flex items-center justify-between">
                    <Link href="/doctor/patients" className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-olive-700 transition-all">
                        <ChevronLeft size={16} /> Patient Master List
                    </Link>
                    <div className="flex gap-4">
                        <button
                            onClick={() => setShowRxModal(true)}
                            className="flex items-center gap-2 px-6 py-3 bg-olive-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-olive-600/20 hover:bg-olive-800 transition-all active:scale-95"
                        >
                            <Pill size={16} /> New E-Prescription
                        </button>
                        <button
                            onClick={() => setShowLabModal(true)}
                            className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-600/20 hover:bg-slate-800 transition-all active:scale-95"
                        >
                            <Beaker size={16} /> Order Diagnostics
                        </button>
                    </div>
                </div>

                {/* Profile Header Card */}
                <div className="bg-white rounded-[48px] p-10 border border-slate-100 shadow-sm flex flex-col md:flex-row gap-12 items-start relative overflow-hidden group">
                    <div className="w-32 h-32 bg-slate-50 rounded-[40px] flex items-center justify-center text-slate-300 border-4 border-white shadow-inner flex-shrink-0 group-hover:scale-105 transition-transform duration-500">
                        <User size={64} />
                    </div>
                    <div className="flex-1 space-y-6">
                        <div className="space-y-1">
                            <div className="flex items-center gap-4">
                                <h1 className="text-5xl font-black text-slate-900 tracking-tight italic">{patient.firstName} {patient.lastName}</h1>
                                <span className="bg-slate-50 text-slate-400 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border border-slate-100">MRN: {patient.mrn}</span>
                            </div>
                            <p className="text-olive-600 text-xs font-black uppercase tracking-[0.3em]">{patient.contact?.email} • {patient.contact?.phone}</p>
                        </div>
                        <div className="flex flex-wrap gap-8 pt-2">
                            <div className="space-y-1 text-left">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Date of Birth</p>
                                <p className="text-sm font-bold text-slate-900">{new Date(patient.dob).toLocaleDateString()}</p>
                            </div>
                            <div className="space-y-1 text-left">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Gender / Blood</p>
                                <p className="text-sm font-bold text-slate-900 uppercase">{patient.gender || 'N/A'} • {patient.bloodType || '--'}</p>
                            </div>
                        </div>
                    </div>
                    <Activity size={240} className="absolute bottom-[-30%] right-[-10%] text-slate-50 group-hover:text-olive-50 transition-colors duration-500" />
                </div>

                {/* Navigation Tabs */}
                <div className="flex gap-8 border-b border-slate-100 px-4">
                    {[
                        { id: 'overview', label: 'Clinical Overview', icon: Clipboard },
                        { id: 'prescriptions', label: 'E-Prescriptions', icon: Pill },
                        { id: 'labs', label: 'Diagnostics & Labs', icon: Beaker },
                        { id: 'documents', label: 'Historical Records', icon: History }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-3 pb-6 px-2 text-xs font-black uppercase tracking-widest transition-all relative ${activeTab === tab.id ? 'text-olive-700' : 'text-slate-400 hover:text-slate-600'
                                }`}
                        >
                            <tab.icon size={16} />
                            {tab.label}
                            {activeTab === tab.id && <div className="absolute bottom-0 left-0 w-full h-1 bg-olive-700 rounded-full" />}
                        </button>
                    ))}
                </div>

                {/* Dynamic Content Area */}
                <div className="grid grid-cols-1 gap-10">
                    {activeTab === 'overview' && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
                            <div className="lg:col-span-2 space-y-10">
                                <div className="bg-white rounded-[40px] p-10 border border-slate-100 shadow-sm space-y-8">
                                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
                                        <History size={24} className="text-olive-600" /> Medical History
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <div className="space-y-4">
                                            <p className="text-[10px] font-black text-red-500 uppercase tracking-widest bg-red-50 px-3 py-1 rounded inline-block">Hypersensitivities</p>
                                            <ul className="space-y-2">
                                                {patient.allergies?.length > 0 ? patient.allergies.map((a: string, i: number) => (
                                                    <li key={i} className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                                        <div className="w-1.5 h-1.5 bg-red-400 rounded-full" /> {a}
                                                    </li>
                                                )) : <li className="text-sm text-slate-400 font-medium italic">No recorded allergies</li>}
                                            </ul>
                                        </div>
                                        <div className="space-y-4">
                                            <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded inline-block">Chronic Entities</p>
                                            <ul className="space-y-2">
                                                {patient.chronicConditions?.length > 0 ? patient.chronicConditions.map((c: string, i: number) => (
                                                    <li key={i} className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" /> {c}
                                                    </li>
                                                )) : <li className="text-sm text-slate-400 font-medium italic">No chronic conditions</li>}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-8">
                                <div className="bg-slate-900 rounded-[40px] p-8 text-white relative overflow-hidden shadow-2xl">
                                    <h4 className="text-sm font-black uppercase tracking-widest mb-6 relative z-10 text-teal-400 italic">Sentinel Monitoring</h4>
                                    <div className="space-y-6 relative z-10">
                                        <div className="flex justify-between items-end border-b border-white/5 pb-4">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Blood Pressure</span>
                                            <span className="text-2xl font-black italic">120/80</span>
                                        </div>
                                        <div className="flex justify-between items-end border-b border-white/5 pb-4">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Heart Rate</span>
                                            <span className="text-2xl font-black italic">72 bpm</span>
                                        </div>
                                    </div>
                                    <Activity size={200} className="absolute bottom-[-20%] right-[-20%] text-white/5" />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'prescriptions' && (
                        <div className="bg-white rounded-[40px] p-10 border border-slate-100 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-500">
                            <div className="flex items-center justify-between mb-10">
                                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
                                    <Pill size={24} className="text-olive-600" /> Active Directives
                                </h3>
                                <button onClick={() => setShowRxModal(true)} className="flex items-center gap-2 px-5 py-2.5 bg-olive-50 text-olive-700 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-olive-600 hover:text-white transition-all shadow-sm">
                                    <Plus size={14} /> New RX
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {prescriptions.length === 0 ? (
                                    <div className="col-span-full py-20 text-center text-slate-300 font-black uppercase tracking-[0.2em] italic border-2 border-dashed border-slate-50 rounded-[32px]">No active pharmaceutical orders</div>
                                ) : (
                                    prescriptions.map((rx, idx) => (
                                        <div key={idx} className="p-8 bg-slate-50/50 rounded-[32px] border border-slate-100 flex flex-col justify-between group hover:bg-white hover:border-olive-400 transition-all hover:shadow-xl hover:shadow-olive-600/5">
                                            <div className="space-y-6">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em] font-mono">{new Date(rx.prescribedDate).toLocaleTimeString()} • {new Date(rx.prescribedDate).toLocaleDateString()}</p>
                                                        <h4 className="text-xs font-black text-slate-900 uppercase mt-1">Order Ref: {rx.prescriptionId.slice(-8)}</h4>
                                                    </div>
                                                    <span className="text-[9px] font-black px-3 py-1 bg-green-50 text-green-600 rounded-full border border-green-100 uppercase tracking-widest">{rx.status}</span>
                                                </div>
                                                <div className="space-y-3">
                                                    {rx.medications.map((m: any, j: number) => (
                                                        <div key={j} className="flex items-center justify-between text-xs py-3 border-t border-slate-100 first:border-0 pt-4 first:pt-0">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-1.5 h-1.5 bg-olive-400 rounded-full" />
                                                                <span className="font-black text-slate-800 uppercase tracking-tight">{m.drugName}</span>
                                                            </div>
                                                            <span className="text-slate-500 font-bold italic">{m.dosage} • {m.frequency}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'labs' && (
                        <div className="bg-white rounded-[40px] p-10 border border-slate-100 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-500">
                            <div className="flex items-center justify-between mb-10">
                                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
                                    <Beaker size={24} className="text-blue-600" /> Laboratory Archive
                                </h3>
                                <button onClick={() => setShowLabModal(true)} className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10">
                                    <Plus size={14} /> Order Lab
                                </button>
                            </div>
                            <div className="space-y-6">
                                {labs.length === 0 ? (
                                    <div className="py-20 text-center text-slate-300 font-black uppercase tracking-[0.2em] italic border-2 border-dashed border-slate-50 rounded-[32px]">No diagnostic records discovered</div>
                                ) : (
                                    labs.map((lab, idx) => (
                                        <div key={idx} className="p-8 bg-slate-50/50 rounded-[32px] border border-slate-100 flex items-center justify-between group hover:bg-white hover:border-blue-400 transition-all hover:shadow-xl hover:shadow-blue-600/5">
                                            <div className="flex items-center gap-8">
                                                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm border border-slate-50 group-hover:scale-110 transition-transform">
                                                    <Beaker size={28} />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-3">
                                                        <h4 className="text-xl font-black text-slate-900 italic tracking-tight uppercase leading-none">{lab.testType}</h4>
                                                        <span className={`text-[9px] font-black px-3 py-1 rounded border uppercase tracking-widest ${lab.priority === 'urgent' || lab.priority === 'stat' ? 'bg-red-50 text-red-600 border-red-100 animate-pulse' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>{lab.priority}</span>
                                                    </div>
                                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mt-3">{new Date(lab.createdAt).toLocaleDateString()} • STATUS: <span className="text-slate-900">{lab.status}</span></p>
                                                </div>
                                            </div>
                                            <div className="text-right flex items-center gap-12">
                                                <div className="text-right">
                                                    <p className={`text-4xl font-black tracking-tight italic ${lab.abnormalFlag ? 'text-red-500' : 'text-slate-900'}`}>{lab.resultValue}</p>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{lab.unit || '---'}</p>
                                                </div>
                                                <button className="w-12 h-12 flex items-center justify-center bg-white border border-slate-100 rounded-2xl opacity-0 group-hover:opacity-100 transition-all text-slate-400 hover:text-blue-600 hover:border-blue-200 shadow-sm">
                                                    <ClipboardList size={22} />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'documents' && (
                        <div className="bg-white rounded-[40px] p-10 border border-slate-100 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-500">
                            <div className="flex items-center justify-between mb-10">
                                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
                                    <History size={24} className="text-olive-600" /> Patient Uploaded Archive
                                </h3>
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{documents.length} Records Found</div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {documents.length === 0 ? (
                                    <div className="col-span-full py-20 text-center text-slate-300 font-black uppercase tracking-[0.2em] italic border-2 border-dashed border-slate-50 rounded-[32px]">No uploaded history discovered</div>
                                ) : (
                                    documents.map((doc, idx) => (
                                        <div key={idx} className="p-8 bg-slate-50/50 rounded-[32px] border border-slate-100 flex items-center justify-between group hover:bg-white hover:border-olive-400 transition-all hover:shadow-xl hover:shadow-olive-600/5">
                                            <div className="flex items-center gap-6">
                                                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-olive-600 shadow-sm border border-slate-50">
                                                    <FileText size={24} />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900 group-hover:text-olive-700 transition-colors">{doc.fileName}</p>
                                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">
                                                        {doc.documentType.replace('_', ' ')} • {new Date(doc.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => setPreviewDoc(doc)}
                                                className="w-12 h-12 flex items-center justify-center bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-olive-600 hover:border-olive-200 shadow-sm transition-all"
                                            >
                                                <Eye size={20} />
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* RX MODAL */}
                {showRxModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-in fade-in transition-all duration-300">
                        <div className="bg-white w-full max-w-2xl rounded-[48px] shadow-2xl border border-white/20 overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
                            <div className="p-10 border-b border-slate-50 flex items-center justify-between bg-white relative z-10">
                                <div>
                                    <h4 className="text-3xl font-black text-slate-900 tracking-tight italic uppercase">Clinical Prescription</h4>
                                    <p className="text-olive-600 text-[10px] font-black uppercase tracking-[0.4em] mt-2">Digital Directives Authorization Node</p>
                                </div>
                                <button onClick={() => setShowRxModal(false)} className="w-12 h-12 flex items-center justify-center bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-2xl transition-all border border-slate-100">
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleRxSubmit} className="p-10 space-y-8 overflow-y-auto noscrollbar bg-white">
                                <div className="space-y-6">
                                    {rxData.medications.map((med, idx) => (
                                        <div key={idx} className="p-8 bg-slate-50/50 rounded-[40px] border border-slate-100 relative group/med hover:bg-white hover:border-olive-200 transition-all">
                                            <div className="grid grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Medication Identity</label>
                                                    <input
                                                        type="text" required
                                                        className="w-full bg-white border border-slate-100 px-6 py-4 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-olive-500 transition-all shadow-sm"
                                                        placeholder="e.g., Amoxicillin"
                                                        value={med.drugName}
                                                        onChange={e => {
                                                            const newMeds = [...rxData.medications];
                                                            newMeds[idx].drugName = e.target.value;
                                                            setRxData({ ...rxData, medications: newMeds });
                                                        }}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Clinical Dosage</label>
                                                    <input
                                                        type="text" required
                                                        className="w-full bg-white border border-slate-100 px-6 py-4 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-olive-500 transition-all shadow-sm"
                                                        placeholder="e.g., 500mg"
                                                        value={med.dosage}
                                                        onChange={e => {
                                                            const newMeds = [...rxData.medications];
                                                            newMeds[idx].dosage = e.target.value;
                                                            setRxData({ ...rxData, medications: newMeds });
                                                        }}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Frequency Range</label>
                                                    <input
                                                        type="text" required
                                                        className="w-full bg-white border border-slate-100 px-6 py-4 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-olive-500 transition-all shadow-sm"
                                                        placeholder="e.g., Twice daily"
                                                        value={med.frequency}
                                                        onChange={e => {
                                                            const newMeds = [...rxData.medications];
                                                            newMeds[idx].frequency = e.target.value;
                                                            setRxData({ ...rxData, medications: newMeds });
                                                        }}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Duration / Period</label>
                                                    <input
                                                        type="text" required
                                                        className="w-full bg-white border border-slate-100 px-6 py-4 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-olive-500 transition-all shadow-sm"
                                                        placeholder="e.g., 7 days"
                                                        value={med.duration}
                                                        onChange={e => {
                                                            const newMeds = [...rxData.medications];
                                                            newMeds[idx].duration = e.target.value;
                                                            setRxData({ ...rxData, medications: newMeds });
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="pt-4 space-y-4">
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="w-full py-6 bg-slate-900 text-white rounded-[32px] font-black text-sm uppercase tracking-[0.3em] shadow-2xl hover:bg-olive-700 transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-70"
                                    >
                                        {submitting ? <>Authorizing Directive...</> : <><Check size={22} /> Commit E-Prescription</>}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* LAB MODAL */}
                {showLabModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-in fade-in transition-all duration-300">
                        <div className="bg-white w-full max-w-lg rounded-[48px] shadow-2xl border border-white/20 overflow-hidden animate-in zoom-in-95 duration-300">
                            <div className="p-10 border-b border-slate-50 flex items-center justify-between">
                                <div>
                                    <h4 className="text-3xl font-black text-slate-900 tracking-tight italic uppercase">Diagnostic Order</h4>
                                    <p className="text-blue-600 text-[10px] font-black uppercase tracking-[0.4em] mt-2">Laboratory Request Dispatch</p>
                                </div>
                                <button onClick={() => setShowLabModal(false)} className="w-12 h-12 flex items-center justify-center bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-2xl transition-all border border-slate-100">
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleLabSubmit} className="p-10 space-y-8 bg-white">
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Diagnostic Test Type</label>
                                        <input
                                            type="text" required
                                            placeholder="e.g. Full Biochemistry Profile"
                                            className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-[28px] outline-none focus:border-blue-500 transition-all font-black text-sm uppercase tracking-tight"
                                            value={labData.testType}
                                            onChange={(e) => setLabData({ ...labData, testType: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Clincal Priority</label>
                                        <select
                                            className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-[28px] outline-none focus:border-blue-500 transition-all font-black text-xs uppercase tracking-widest appearance-none"
                                            value={labData.priority}
                                            onChange={(e) => setLabData({ ...labData, priority: e.target.value })}
                                        >
                                            <option value="routine">Routine Protocol</option>
                                            <option value="urgent">Urgent Escalation</option>
                                            <option value="stat">STAT Priority</option>
                                        </select>
                                    </div>
                                </div>
                                <button disabled={submitting} className="w-full py-6 bg-slate-900 text-white rounded-[32px] font-black text-sm uppercase tracking-[0.3em] shadow-2xl hover:bg-blue-700 transition-all active:scale-[0.98] disabled:opacity-70">
                                    {submitting ? <>Transmitting Order...</> : <>Dispatch Lab Request</>}
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {/* DOCUMENT PREVIEW MODAL */}
                {previewDoc && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300">
                        <div className="bg-white w-full max-w-5xl h-[90vh] rounded-[48px] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300 border border-white/20">
                            {/* Modal Header */}
                            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-olive-50 rounded-2xl flex items-center justify-center text-olive-600">
                                        <FileText size={24} />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-black text-slate-900 tracking-tight italic uppercase">{previewDoc.fileName}</h4>
                                        <p className="text-[10px] text-olive-600 font-black uppercase tracking-widest mt-1">
                                            {previewDoc.documentType.replace('_', ' ')} • Uploaded on {new Date(previewDoc.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <a
                                        href={previewDoc.fileUrl}
                                        download
                                        className="flex items-center gap-2 px-6 py-3 bg-slate-50 text-slate-600 hover:bg-slate-100 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all"
                                    >
                                        Download Archive
                                    </a>
                                    <button
                                        onClick={() => setPreviewDoc(null)}
                                        className="w-12 h-12 flex items-center justify-center bg-red-50 text-red-500 hover:bg-red-100 rounded-2xl transition-all border border-red-100"
                                    >
                                        <Plus size={24} className="rotate-45" />
                                    </button>
                                </div>
                            </div>

                            {/* Modal Body */}
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
                                            className="max-w-full max-h-full object-contain p-4"
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </DashboardLayout>
    );
}

