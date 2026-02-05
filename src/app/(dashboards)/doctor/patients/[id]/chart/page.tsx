
"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useParams } from "next/navigation";
import {
    FileText,
    Pill,
    Microscope,
    Activity,
    Scissors,
    Clock,
    Calendar,
    Image as ImageIcon,
    Sliders,
    AlertCircle,
    X
} from "lucide-react";
import ReportModal from "@/components/doctor/ReportModal";
import { format } from "date-fns";

export default function PatientChart() {
    const params = useParams();
    const [patient, setPatient] = useState<any>(null);
    const [activeTab, setActiveTab] = useState('Timeline');
    const [loading, setLoading] = useState(true);
    const [selectedReport, setSelectedReport] = useState<any>(null);

    useEffect(() => {
        const fetchPatient = async () => {
            if (!params.id) return;
            try {
                const res = await fetch(`/api/patients/${params.id}`);
                if (res.ok) {
                    const data = await res.json();
                    setPatient(data);
                }
            } catch (error) {
                console.error("Failed to fetch patient:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPatient();
    }, [params.id]);

    if (!patient && loading) return <DashboardLayout><div className="p-12">Loading Chart...</div></DashboardLayout>;
    if (!patient) return <DashboardLayout><div className="p-12">Patient not found</div></DashboardLayout>;

    return (
        <DashboardLayout>
            <div className="space-y-10">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Full Patient Chart</h2>
                    <p className="text-slate-500 text-sm font-medium mt-1 uppercase tracking-widest">{patient.firstName} {patient.lastName} • MRN: {patient.mrn}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar Chart Nav */}
                    <div className="space-y-2">
                        {['Timeline', 'SOAP Notes', 'Medications', 'Labs & Imaging', 'Procedures'].map((item) => (
                            <button
                                key={item}
                                onClick={() => setActiveTab(item)}
                                className={`w-full text-left px-6 py-4 rounded-2xl font-bold text-sm transition-all ${activeTab === item ? 'bg-olive-600 text-white shadow-lg shadow-olive-600/20' : 'bg-white text-slate-500 hover:bg-olive-50 hover:text-olive-700'}`}
                            >
                                {item}
                            </button>
                        ))}
                    </div>

                    {/* Chart Content */}
                    <div className="lg:col-span-3 min-h-[600px]">
                        {activeTab === 'Timeline' && <TimelineView patientId={params.id} />}
                        {activeTab === 'SOAP Notes' && <SOAPView patientId={params.id} />}
                        {activeTab === 'Medications' && <MedicationsView patientId={params.id} />}
                        {activeTab === 'Labs & Imaging' && <LabsImagingView patientId={params.id} onSelectReport={setSelectedReport} patient={patient} />}
                        {activeTab === 'Procedures' && <ProceduresView patientId={params.id} />}
                    </div>
                </div>

                {selectedReport && (
                    <div className="no-print">
                        <ReportModal
                            title={selectedReport.title}
                            data={selectedReport.data}
                            imageUrl={selectedReport.imageUrl}
                            onClose={() => setSelectedReport(null)}
                        />
                        {/* Overlay to hide print/download buttons as requested for doctor section */}
                        <style jsx global>{`
                            .no-print button[title="Print Report"],
                            .no-print button[title="Download PDF"] {
                                display: none !important;
                            }
                        `}</style>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}

// --- TAB COMPONENTS ---

function TimelineView({ patientId }: { patientId: any }) {
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTimeline = async () => {
            try {
                const [labsRes, radRes, medsRes] = await Promise.all([
                    fetch(`/api/patients/${patientId}/labs`),
                    fetch(`/api/patients/${patientId}/radiology`),
                    fetch(`/api/patients/${patientId}/prescriptions`)
                ]);

                const labs = labsRes.ok ? await labsRes.json() : [];
                const radiology = radRes.ok ? await radRes.json() : [];
                const prescriptions = medsRes.ok ? await medsRes.json() : [];

                const allEvents: any[] = [];

                // Map Labs
                labs.forEach((l: any) => {
                    allEvents.push({
                        date: format(new Date(l.createdAt), "MMM dd, yyyy HH:mm"),
                        timestamp: new Date(l.createdAt).getTime(),
                        title: `Lab Order: ${(l.tests || []).join(', ')}`,
                        desc: `Status: ${l.status.toUpperCase()}`,
                        icon: Microscope
                    });
                });

                // Map Radiology
                radiology.forEach((r: any) => {
                    allEvents.push({
                        date: format(new Date(r.createdAt), "MMM dd, yyyy HH:mm"),
                        timestamp: new Date(r.createdAt).getTime(),
                        title: `Imaging: ${r.imagingType} (${r.bodyPart})`,
                        desc: `Priority: ${(r.priority || 'Normal').toUpperCase()} - ${r.status}`,
                        icon: ImageIcon
                    });
                });

                // Map Prescriptions
                prescriptions.forEach((p: any) => {
                    allEvents.push({
                        date: format(new Date(p.prescribedDate), "MMM dd, yyyy HH:mm"),
                        timestamp: new Date(p.prescribedDate).getTime(),
                        title: `Prescription: ${p.medications.map((m: any) => m.drugName).join(', ')}`,
                        desc: `Status: ${p.status.toUpperCase()}`,
                        icon: Pill
                    });
                });

                // Sort by timestamp desc
                allEvents.sort((a, b) => b.timestamp - a.timestamp);
                setEvents(allEvents);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchTimeline();
    }, [patientId]);

    if (loading) return <div className="p-8 text-center text-slate-400 italic animate-pulse tracking-widest uppercase text-xs font-bold">Aggregating Longitudinal Timeline...</div>;

    return (
        <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-8 bottom-0 w-0.5 bg-slate-100"></div>
            <div className="space-y-12 relative z-10 pl-12">
                {events.length === 0 ? (
                    <div className="text-slate-400 italic py-10">No clinical events recorded for this patient.</div>
                ) : events.map((evt, i) => (
                    <TimelineItem key={i} {...evt} />
                ))}
            </div>
        </div>
    );
}


function SOAPView({ patientId }: { patientId: any }) {
    const [notes, setNotes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const res = await fetch(`/api/patients/${patientId}/consultations`);
                if (res.ok) {
                    const data = await res.json();
                    setNotes(data.map((c: any) => ({
                        date: new Date(c.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                        provider: `${c.providerId?.firstName || 'Dr.'} ${c.providerId?.lastName || 'Provider'}`,
                        s: c.soapNotes?.subjective || "No subjective notes.",
                        o: c.soapNotes?.objective || "No objective findings.",
                        a: c.soapNotes?.assessment || "Assessment pending.",
                        p: c.soapNotes?.plan || "Plan not recorded."
                    })));
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchNotes();
    }, [patientId]);

    if (loading) return <div className="p-8 text-center text-slate-400 italic animate-pulse">Retrieving Clinical Narratives...</div>;

    return (
        <div className="space-y-6">
            {notes.length === 0 ? (
                <div className="bg-white p-12 rounded-[30px] border border-slate-100 shadow-sm text-center">
                    <p className="text-slate-400 italic">No formal SOAP notes recorded for this patient.</p>
                </div>
            ) : notes.map((note, i) => (
                <div key={i} className="bg-white p-8 rounded-[30px] border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h4 className="text-lg font-black text-slate-900">{note.date}</h4>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Provider: {note.provider}</p>
                        </div>
                        <FileText className="text-olive-500" size={24} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                        <div className="bg-slate-50 p-4 rounded-xl">
                            <span className="font-black text-slate-900 uppercase tracking-widest text-xs block mb-2">Subjective</span>
                            <p className="text-slate-600">{note.s}</p>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-xl">
                            <span className="font-black text-slate-900 uppercase tracking-widest text-xs block mb-2">Objective</span>
                            <p className="text-slate-600">{note.o}</p>
                        </div>
                        <div className="bg-olive-50 p-4 rounded-xl md:col-span-2">
                            <span className="font-black text-olive-800 uppercase tracking-widest text-xs block mb-2">Assessment & Plan</span>
                            <div className="space-y-2">
                                <p className="text-olive-900 font-bold"><span className="opacity-50 uppercase text-[10px] tracking-widest mr-2">ASM:</span> {note.a}</p>
                                <p className="text-olive-700"><span className="opacity-50 uppercase text-[10px] tracking-widest mr-2">PLN:</span> {note.p}</p>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

function MedicationsView({ patientId }: { patientId: any }) {
    const [meds, setMeds] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMeds = async () => {
            try {
                const res = await fetch(`/api/patients/${patientId}/prescriptions`);
                if (res.ok) {
                    const data = await res.json();
                    const flatMeds = data.flatMap((rx: any) =>
                        rx.medications.map((m: any) => ({
                            ...m,
                            status: rx.status,
                            date: new Date(rx.prescribedDate).toLocaleDateString(),
                            prescriptionId: rx.prescriptionId
                        }))
                    );
                    setMeds(flatMeds);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchMeds();
    }, [patientId]);

    if (loading) return <div className="p-8 text-center text-slate-400 italic animate-pulse tracking-widest uppercase text-xs font-bold">Accessing Pharmacy Records...</div>;

    return (
        <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Active & Historical Medications</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 italic">Longitudinal Prescription Log</p>
                </div>
                <Pill size={24} className="text-olive-500 opacity-30" />
            </div>
            <table className="w-full text-left">
                <thead className="bg-slate-50/50">
                    <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <th className="px-10 py-5">Medication</th>
                        <th className="px-10 py-5">Dosage</th>
                        <th className="px-10 py-5">Frequency</th>
                        <th className="px-10 py-5">Date</th>
                        <th className="px-10 py-5">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                    {meds.length === 0 ? (
                        <tr><td colSpan={5} className="p-10 text-center text-slate-400 italic">No medication history found</td></tr>
                    ) : meds.map((m, i) => (
                        <tr key={i} className="hover:bg-slate-50/30 transition-colors">
                            <td className="px-10 py-6 font-bold text-slate-900 flex items-center gap-4">
                                <div className="w-10 h-10 rounded-2xl bg-olive-50 text-olive-600 flex items-center justify-center border border-olive-100"><Pill size={18} /></div>
                                <div>
                                    <p className="font-black text-sm italic tracking-tight">{m.drugName}</p>
                                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{m.prescriptionId}</p>
                                </div>
                            </td>
                            <td className="px-10 py-6 text-sm font-bold text-slate-600">{m.dosage}</td>
                            <td className="px-10 py-6 text-sm text-slate-500 italic">{m.frequency}</td>
                            <td className="px-10 py-6 text-xs font-bold text-slate-400 uppercase">{m.date}</td>
                            <td className="px-10 py-6">
                                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${m.status === 'active' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-slate-50 text-slate-400 border-slate-100'
                                    }`}>{m.status}</span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function LabsImagingView({ patientId, onSelectReport, patient }: { patientId: any, onSelectReport: (report: any) => void, patient: any }) {
    const [reports, setReports] = useState<any>({ results: [], radiologyReports: [], labResults: [] });
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState<'all' | 'lab' | 'radiology' | 'surgery'>('all');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`/api/doctor/surgery/patient-reports?patientId=${patientId}`);
                if (res.ok) {
                    const data = await res.json();
                    setReports(data);
                }
            } catch (e) {
                console.error("Failed to fetch reports:", e);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [patientId]);

    const filteredResults = (reports.results || []).filter((item: any) =>
        activeFilter === 'all' || item.type === activeFilter
    );

    if (loading) return <div className="p-12 text-center text-slate-400 italic animate-pulse tracking-widest uppercase text-xs font-bold">Synchronizing Clinical Diagnostics...</div>;

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="space-y-8">
            {/* Header & Filters */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">Diagnostic Archive</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 italic">Official Certified Reports</p>
                </div>

                <div className="flex items-center gap-2 p-1.5 bg-white rounded-2xl border border-slate-100 shadow-sm">
                    {(['all', 'lab', 'radiology', 'surgery'] as const).map((filter) => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeFilter === filter
                                ? 'bg-olive-600 text-white shadow-md'
                                : 'text-slate-400 hover:text-slate-600'
                                }`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>
            </div>

            {/* Reports Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResults.length === 0 ? (
                    <div className="col-span-full py-20 text-center bg-white rounded-[40px] border border-slate-100 shadow-sm">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-50">
                            <Microscope size={32} className="text-slate-200" />
                        </div>
                        <p className="text-sm font-black text-slate-400 uppercase tracking-widest">No matching reports found</p>
                    </div>
                ) : (
                    filteredResults.map((item: any) => (
                        <div
                            key={item.id}
                            onClick={() => {
                                let title = '';
                                let data = {};

                                if (item.type === 'lab') {
                                    title = `Lab Report: ${item.title}`;
                                    data = {
                                        type: item.type,
                                        patientName: `${patient.firstName} ${patient.lastName}`,
                                        mrn: patient.mrn,
                                        date: formatDate(item.date),
                                        testName: item.title,
                                        results: item.details?.results
                                    };
                                } else if (item.type === 'radiology') {
                                    title = `Imaging Report: ${item.title}`;
                                    data = {
                                        type: item.type,
                                        patientName: `${patient.firstName} ${patient.lastName}`,
                                        mrn: patient.mrn,
                                        date: formatDate(item.date),
                                        testName: item.title,
                                        radiology: {
                                            findings: item.details?.report?.findings || 'No findings available',
                                            impression: item.details?.report?.impression || 'No impression available',
                                            recommendations: item.details?.report?.recommendations
                                        }
                                    };
                                } else {
                                    title = `${item.type === 'surgery' ? 'Pre-Op' : 'Post-Op'} Report: ${item.title}`;
                                    data = {
                                        type: 'surgery',
                                        patientName: `${patient.firstName} ${patient.lastName}`,
                                        mrn: patient.mrn,
                                        date: formatDate(item.date),
                                        testName: item.title,
                                        radiology: { // Reusing radiology structure for generic text report
                                            findings: item.details?.instructions || 'No instructions provided',
                                            impression: item.details?.nurseNotes || 'Action pending',
                                            recommendations: `Completed by: ${item.details?.completedBy?.firstName || 'N/A'} ${item.details?.completedBy?.lastName || ''}`
                                        }
                                    };
                                }

                                onSelectReport({ title, data });
                            }}
                            className="group bg-white rounded-[40px] border border-slate-100 shadow-sm hover:shadow-2xl hover:border-olive-200 transition-all p-8 flex flex-col justify-between cursor-pointer"
                        >
                            <div>
                                <div className="flex justify-between items-start mb-6">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform ${item.type === 'lab' ? 'bg-gradient-to-br from-blue-500 to-indigo-600' :
                                        item.type === 'radiology' ? 'bg-gradient-to-br from-purple-500 to-pink-600' :
                                            'bg-gradient-to-br from-orange-400 to-amber-600'
                                        }`}>
                                        <Activity className="text-white" size={24} />
                                    </div>
                                    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${item.status === 'final' || item.status === 'completed'
                                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                        : 'bg-amber-50 text-amber-600 border border-amber-100'
                                        }`}>
                                        {item.status}
                                    </span>
                                </div>

                                <h4 className="text-xl font-black text-slate-900 leading-tight mb-2 group-hover:text-olive-700 transition-colors uppercase italic tracking-tight">
                                    {item.title}
                                </h4>
                                <p className="text-sm font-medium text-slate-500 line-clamp-2 mb-4 italic">
                                    {item.summary}
                                </p>

                                <div className="flex items-center gap-3 text-xs font-bold text-slate-400 capitalize">
                                    <Calendar size={14} className="text-slate-300" />
                                    {formatDate(item.date)}
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between group-hover:text-olive-600">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-olive-600 transition-colors">
                                    {item.type === 'lab' ? 'Laboratory Analysis' :
                                        item.type === 'radiology' ? 'Diagnostic Imaging' :
                                            item.type === 'surgery' ? 'Pre-Op Order' : 'Post-Op Instruction'}
                                </span>
                                <div className="w-8 h-8 rounded-full bg-slate-50 group-hover:bg-olive-600 flex items-center justify-center transition-all">
                                    <Activity size={14} className="text-slate-400 group-hover:text-white" />
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

function ProceduresView({ patientId }: { patientId: any }) {
    const [procedures, setProcedures] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProcedures = async () => {
            try {
                const res = await fetch(`/api/patients/${patientId}/surgery`);
                if (res.ok) {
                    const data = await res.json();
                    setProcedures(data);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchProcedures();
    }, [patientId]);

    if (loading) return <div className="p-8 text-center text-slate-400 italic animate-pulse">Retrieving Surgical Records...</div>;

    return (
        <div className="space-y-6">
            {procedures.length === 0 ? (
                <div className="bg-white p-12 rounded-[30px] border border-slate-100 shadow-sm text-center">
                    <p className="text-slate-400 italic font-medium uppercase tracking-[0.2em]">No surgical procedures recorded for this patient</p>
                </div>
            ) : procedures.map((proc, i) => (
                <div key={i} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm transition-all hover:shadow-md">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-5">
                            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center border border-blue-100 shadow-inner">
                                <Scissors size={24} />
                            </div>
                            <div>
                                <h4 className="text-xl font-black text-slate-900 italic uppercase italic tracking-tight">{proc.procedureName}</h4>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">
                                    {new Date(proc.scheduledDate).toLocaleDateString()} • Surgeon: {proc.surgeonId?.firstName} {proc.surgeonId?.lastName}
                                </p>
                            </div>
                        </div>
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border ${proc.status === 'completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-orange-50 text-orange-600 border-orange-100'
                            }`}>{proc.status}</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Vitals Section */}
                        <div className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100">
                            <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Activity size={12} className="text-blue-500" /> Intra-operative Vitals
                            </h5>
                            {proc.vitals && Object.keys(proc.vitals).length > 0 ? (
                                <div className="grid grid-cols-2 gap-4">
                                    {proc.vitals.bloodPressure && (
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">BP (mmHg)</p>
                                            <p className="text-lg font-black text-slate-800 tabular-nums">{proc.vitals.bloodPressure}</p>
                                        </div>
                                    )}
                                    {proc.vitals.heartRate && (
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Heart Rate</p>
                                            <p className="text-lg font-black text-slate-800 tabular-nums">{proc.vitals.heartRate} <span className="text-[10px] opacity-30">BPM</span></p>
                                        </div>
                                    )}
                                    {proc.vitals.oxygenSaturation && (
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">SpO2</p>
                                            <p className="text-lg font-black text-slate-800 tabular-nums">{proc.vitals.oxygenSaturation}%</p>
                                        </div>
                                    )}
                                    {proc.vitals.temperature && (
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Temp</p>
                                            <p className="text-lg font-black text-slate-800 tabular-nums">{proc.vitals.temperature}°C</p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <p className="text-[10px] text-slate-400 italic">No vitals recorded during this procedure.</p>
                            )}
                        </div>

                        {/* Medications Section */}
                        <div className="bg-olive-50/30 p-6 rounded-3xl border border-olive-100/50">
                            <h5 className="text-[10px] font-black text-olive-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Pill size={12} /> Post-Op Prescriptions
                            </h5>
                            {proc.medications && proc.medications.length > 0 ? (
                                <div className="space-y-4">
                                    {proc.medications.map((med: any, idx: number) => (
                                        <div key={idx} className="flex justify-between items-start pb-2 border-b border-olive-100/50 last:border-0 last:pb-0">
                                            <div>
                                                <p className="text-xs font-black text-olive-900 leading-tight tracking-tight uppercase italic">{med.drugName}</p>
                                                <p className="text-[10px] text-olive-600 font-bold mt-0.5">{med.dosage} • {med.frequency}</p>
                                            </div>
                                            {med.instructions && <p className="text-[9px] text-slate-400 italic max-w-[120px] text-right">{med.instructions}</p>}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-[10px] text-olive-500/70 italic">No specific medications recorded for this case.</p>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

function TimelineItem({ date, title, desc, icon: Icon }: any) {
    return (
        <div className="relative group">
            <div className="absolute -left-[54px] top-1 w-5 h-5 rounded-full bg-olive-50 border-2 border-olive-500 z-20 group-hover:scale-125 transition-all"></div>
            <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 shrink-0 group-hover:bg-olive-100 group-hover:text-olive-700 transition-colors">
                    <Icon size={20} />
                </div>
                <div>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{date}</p>
                    <h4 className="text-lg font-bold text-slate-900">{title}</h4>
                    <p className="text-slate-500 mt-1">{desc}</p>
                </div>
            </div>
        </div>
    );
}
