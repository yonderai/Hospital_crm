"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
    Activity,
    Thermometer,
    Droplets,
    FileText,
    Clock,
    ArrowLeft,
    User,
    Calendar,
    MapPin,
    HeartPulse,
    X,
    Check,
    Pill
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";

export default function PatientClinicalChart() {
    const router = useRouter();
    const params = useParams();
    const id = Array.isArray(params.id) ? params.id[0] : params.id;
    const [patient, setPatient] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Modal States
    const [showNoteModal, setShowNoteModal] = useState(false);
    const [showMedModal, setShowMedModal] = useState(false);
    const [noteInput, setNoteInput] = useState("");
    const [medications, setMedications] = useState<any[]>([]);
    const [medLoading, setMedLoading] = useState(false);
    const [isAdministering, setIsAdministering] = useState<string | null>(null);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
    const [pastNotes, setPastNotes] = useState<any[]>([]);
    const [notesLoading, setNotesLoading] = useState(false);

    // Fetch Meds
    const fetchMeds = async () => {
        if (!id) return;
        setMedLoading(true);
        try {
            const res = await fetch(`/api/doctor/prescriptions?patientId=${id}&status=active`);
            if (res.ok) {
                const data = await res.json();
                // Flatten prescriptions to med items if structure allows, or just show prescriptions
                // Assuming data is array of prescriptions with medications array inside
                setMedications(data);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setMedLoading(false);
        }
    };

    const fetchNotes = async () => {
        if (!id) return;
        setNotesLoading(true);
        try {
            const res = await fetch(`/api/nurse/notes?patientId=${id}`);
            if (res.ok) {
                const data = await res.json();
                setPastNotes(data);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setNotesLoading(false);
        }
    };

    const handleOpenMeds = () => {
        setShowMedModal(true);
        fetchMeds();
    };

    const handleSubmitNote = async () => {
        if (!noteInput.trim()) return;
        setSaveStatus('saving');
        try {
            const res = await fetch('/api/nurse/notes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ patientId: id, note: noteInput })
            });
            if (res.ok) {
                setSaveStatus('saved');
                setTimeout(() => {
                    setNoteInput("");
                    setShowNoteModal(false);
                    setSaveStatus('idle');
                    fetchNotes(); // Refresh list if kept open or next time
                }, 1000);
            } else {
                setSaveStatus('error');
                setTimeout(() => setSaveStatus('idle'), 2000);
            }
        } catch (e) {
            console.error(e);
            setSaveStatus('error');
            setTimeout(() => setSaveStatus('idle'), 2000);
        }
    };

    const handleAdminister = async (medName: string) => {
        setIsAdministering(medName);
        // Log as a note for now
        try {
            await fetch('/api/nurse/notes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ patientId: id, note: `MEDICATION ADMINISTERED: ${medName} at ${new Date().toLocaleTimeString()}` })
            });
            // Simulate success with delay
            setTimeout(() => setIsAdministering(null), 1000);
        } catch (e) { console.error(e); setIsAdministering(null); }
    };

    // Mock Fetch - in real app, fetch /api/patients/${params.id}
    useEffect(() => {
        const fetchPatientDetails = async () => {
            try {
                if (!id) return;
                const res = await fetch(`/api/patients/${id}`);
                const data = await res.json();

                if (res.ok) {
                    setPatient({
                        id: data._id,
                        name: `${data.firstName} ${data.lastName}`,
                        mrn: data.mrn || "MRN-PENDING",
                        age: new Date().getFullYear() - new Date(data.dateOfBirth).getFullYear(), // Approx age
                        gender: data.gender,
                        admissionDate: data.createdAt ? new Date(data.createdAt).toISOString().split('T')[0] : "2024-02-04",
                        diagnosis: data.medicalHistory?.[0]?.condition || "Observation",
                        room: data.address?.city ? `Ward ${data.address.city}` : "General Ward", // Fallback if no bed info in Patient model
                        doctor: data.assignedDoctorId ? `Dr. ${data.assignedDoctorId.lastName}` : "Unassigned",
                        vitals: {
                            bp: "120/80",
                            hr: 75,
                            temp: 98.6,
                            spo2: 99
                        }
                    });
                }
            } catch (e) {
                console.error("Failed to fetch patient details", e);
            } finally {
                setLoading(false);
            }
        };
        fetchPatientDetails();
    }, [id]);

    return (
        <DashboardLayout>
            <div className="space-y-8">
                {/* Header / Nav */}
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-slate-400 font-bold hover:text-slate-600 transition-colors uppercase tracking-widest text-xs"
                >
                    <ArrowLeft size={16} /> Back to Roster
                </button>

                {loading ? (
                    <div className="animate-pulse space-y-8">
                        <div className="h-40 bg-white rounded-[40px] w-full" />
                        <div className="grid grid-cols-3 gap-8">
                            <div className="h-64 bg-white rounded-[40px] col-span-2" />
                            <div className="h-64 bg-white rounded-[40px]" />
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Patient Identity Header */}
                        <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-[48px] p-10 text-white shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-olive-500/20 rounded-full blur-[100px] -mr-16 -mt-16" />

                            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                                <div className="flex items-center gap-8">
                                    <div className="w-24 h-24 bg-white/10 rounded-3xl flex items-center justify-center border border-white/20 backdrop-blur-md">
                                        <User size={40} className="text-olive-400" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="px-3 py-1 bg-olive-500 text-white rounded-lg text-[10px] font-black uppercase tracking-widest">
                                                Inpatient
                                            </span>
                                            <span className="text-slate-400 font-black text-xs uppercase tracking-widest">
                                                {patient.mrn}
                                            </span>
                                        </div>
                                        <h1 className="text-4xl font-black italic tracking-tight mb-2">
                                            {patient.name}
                                        </h1>
                                        <div className="flex items-center gap-6 text-sm font-medium text-slate-300">
                                            <span className="flex items-center gap-2"><Calendar size={14} /> {patient.age} Yrs</span>
                                            <span className="flex items-center gap-2"><User size={14} /> {patient.gender}</span>
                                            <span className="flex items-center gap-2"><MapPin size={14} /> Room {patient.room}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="text-right">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Primary Doctor</p>
                                        <p className="text-xl font-bold">{patient.doctor}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Clinical Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Vitals */}
                            <div className="lg:col-span-2">
                                <div className="bg-white rounded-[48px] p-10 border border-slate-100 shadow-sm space-y-8">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-2xl font-black text-slate-900 italic uppercase">Live Vitals</h3>
                                        <button className="px-6 py-2 bg-olive-50 text-olive-700 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-olive-100 transition-colors">
                                            + Record New
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <VitalCard label="Heart Rate" value={patient.vitals.hr} unit="bpm" icon={HeartPulse} color="text-rose-500" bg="bg-rose-50" />
                                        <VitalCard label="BP" value={patient.vitals.bp} unit="mmHg" icon={Activity} color="text-indigo-500" bg="bg-indigo-50" />
                                        <VitalCard label="Temp" value={patient.vitals.temp} unit="°F" icon={Thermometer} color="text-amber-500" bg="bg-amber-50" />
                                        <VitalCard label="SpO2" value={patient.vitals.spo2} unit="%" icon={Droplets} color="text-cyan-500" bg="bg-cyan-50" />
                                    </div>

                                    <div className="h-64 bg-slate-50 rounded-3xl border border-slate-100 flex items-center justify-center text-slate-300 font-bold uppercase tracking-widest">
                                        Vitals Graph Visualization
                                    </div>
                                </div>
                            </div>

                            {/* Actions / Meds */}
                            <div className="space-y-8">
                                <div className="bg-olive-900 text-white rounded-[48px] p-10 relative overflow-hidden">
                                    <Activity className="absolute -right-10 -bottom-10 text-white/5 w-64 h-64" />
                                    <h3 className="text-xl font-black italic uppercase mb-6 relative z-10">Quick Actions</h3>
                                    <div className="space-y-4 relative z-10">
                                        <button
                                            onClick={() => { setShowNoteModal(true); fetchNotes(); }}
                                            className="w-full py-4 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl flex items-center justify-center gap-3 font-bold transition-all"
                                        >
                                            <FileText size={18} /> Clinical Notes
                                        </button>
                                        <button
                                            onClick={handleOpenMeds}
                                            className="w-full py-4 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl flex items-center justify-center gap-3 font-bold transition-all"
                                        >
                                            <Droplets size={18} /> Medication Admin
                                        </button>
                                    </div>
                                </div>

                                <div className="bg-white rounded-[48px] p-8 border border-slate-100 shadow-sm">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                                            <Clock size={20} />
                                        </div>
                                        <div>
                                            <p className="font-black text-slate-900 uppercase">Next Med Due</p>
                                            <p className="text-xs text-slate-400 font-bold">14:00 PM</p>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                        <p className="font-bold text-slate-700">Paracetamol 500mg</p>
                                        <p className="text-xs text-slate-400 mt-1">IV Drip • Slow Infusion</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Clinical Note Modal */}
            {showNoteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-[32px] w-full max-w-lg p-8 shadow-2xl animate-in fade-in zoom-in duration-200 max-h-[85vh] flex flex-col">
                        <div className="flex justify-between items-center mb-6 shrink-0">
                            <h3 className="text-2xl font-black text-slate-900 italic uppercase">Clinical Notes</h3>
                            <button onClick={() => setShowNoteModal(false)} className="p-2 bg-slate-50 rounded-full hover:bg-slate-100"><X size={20} /></button>
                        </div>

                        {/* History List */}
                        <div className="flex-1 overflow-y-auto mb-6 space-y-4 pr-2 border-b border-slate-100 pb-4">
                            {notesLoading ? (
                                <p className="text-center text-xs text-slate-400 uppercase tracking-widest font-bold py-4">Loading History...</p>
                            ) : pastNotes.length === 0 ? (
                                <p className="text-center text-xs text-slate-400 uppercase tracking-widest font-bold py-4">No previous notes found</p>
                            ) : (
                                pastNotes.map((note) => (
                                    <div key={note._id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-sm">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="font-bold text-slate-900">{note.providerId?.firstName} {note.providerId?.lastName} <span className="text-[10px] text-slate-500 uppercase font-medium bg-white px-2 py-0.5 rounded-full border border-slate-100 ml-1">{note.providerId?.role || 'Staff'}</span></span>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{new Date(note.createdAt).toLocaleString()}</span>
                                        </div>
                                        <p className="text-slate-600 font-medium leading-relaxed">{note.soapNotes?.assessment || note.chiefComplaint}</p>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="shrink-0">
                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">New Entry</h4>
                            <textarea
                                className="w-full h-32 bg-slate-50 rounded-2xl p-4 border border-slate-100 outline-none focus:border-olive-400 transition-colors font-medium text-slate-700 resize-none mb-4 text-sm"
                                placeholder="Type observation, assessment, or plan..."
                                value={noteInput}
                                onChange={e => setNoteInput(e.target.value)}
                            />
                            <button
                                onClick={handleSubmitNote}
                                disabled={!noteInput.trim() || saveStatus === 'saving' || saveStatus === 'saved'}
                                className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest transition-all ${saveStatus === 'saved' ? 'bg-green-500 text-white' :
                                    saveStatus === 'error' ? 'bg-red-500 text-white' :
                                        'bg-olive-600 text-white hover:bg-olive-700 disabled:opacity-50'
                                    }`}
                            >
                                {saveStatus === 'saving' ? 'Saving...' :
                                    saveStatus === 'saved' ? 'Note Saved!' :
                                        saveStatus === 'error' ? 'Failed - Retry' :
                                            'Save Note'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Med Admin Modal */}
            {showMedModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-[32px] w-full max-w-2xl p-8 shadow-2xl animate-in fade-in zoom-in duration-200 max-h-[80vh] flex flex-col">
                        <div className="flex justify-between items-center mb-6 shrink-0">
                            <h3 className="text-2xl font-black text-slate-900 italic uppercase">Administer Medication</h3>
                            <button onClick={() => setShowMedModal(false)} className="p-2 bg-slate-50 rounded-full hover:bg-slate-100"><X size={20} /></button>
                        </div>

                        <div className="overflow-y-auto flex-1 space-y-4 pr-2">
                            {medLoading ? (
                                <div className="p-10 text-center text-slate-400 font-bold uppercase tracking-widest">Loading Prescriptions...</div>
                            ) : medications.length === 0 ? (
                                <div className="p-10 text-center text-slate-400 font-bold italic">No active prescriptions found.</div>
                            ) : (
                                medications.map(pres => (
                                    pres.medications.map((med: any, i: number) => (
                                        <div key={pres._id + i} className="p-5 border border-slate-100 rounded-2xl flex items-center justify-between hover:bg-slate-50 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                                                    <Pill size={24} />
                                                </div>
                                                <div>
                                                    <h4 className="font-black text-slate-900 uppercase">{med.drugName}</h4>
                                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-tight">{med.dosage} • {med.frequency}</p>
                                                    <p className="text-[10px] text-slate-400 mt-1">{med.instructions}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleAdminister(med.drugName)}
                                                disabled={isAdministering === med.drugName}
                                                className={`px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-colors flex items-center gap-2 ${isAdministering === med.drugName
                                                    ? 'bg-green-500 text-white'
                                                    : 'bg-slate-900 text-white hover:bg-olive-600'
                                                    }`}
                                            >
                                                {isAdministering === med.drugName ? <Check size={14} /> : <div className="w-3.5" />}
                                                {isAdministering === med.drugName ? 'Done' : 'Administer'}
                                            </button>
                                        </div>
                                    ))
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}


function VitalCard({ label, value, unit, icon: Icon, color, bg }: any) {
    return (
        <div className="p-6 rounded-[32px] border border-slate-100 bg-white hover:shadow-lg transition-all group">
            <div className={`w-12 h-12 ${bg} ${color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <Icon size={24} />
            </div>
            <p className="text-3xl font-black text-slate-900 tracking-tighter">{value}</p>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{label} <span className="text-slate-300">({unit})</span></p>
        </div>
    );
}
