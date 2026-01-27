"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
    Search, User, Activity, Beaker, Plus,
    Calendar, Clock, CheckCircle2, AlertCircle, X, ChevronRight
} from "lucide-react";

interface Patient {
    _id: string;
    firstName: string;
    lastName: string;
    mrn: string;
    gender: string;
    dob: string;
    contact: { email: string; phone: string };
}

export default function LabTestSchedulingPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [patients, setPatients] = useState<Patient[]>([]);
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [loading, setLoading] = useState(false);
    const [isNewPatient, setIsNewPatient] = useState(false);
    const [newPatientData, setNewPatientData] = useState({
        firstName: "",
        lastName: "",
        dob: "",
        gender: "male",
        phone: ""
    });

    // Form State
    const [tests, setTests] = useState<string[]>([""]);
    const [priority, setPriority] = useState("routine");
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Search Patients
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchQuery && !isNewPatient) {
                handleSearch();
            } else {
                setPatients([]);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery, isNewPatient]);

    const handleSearch = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/lab/patients?q=${searchQuery}`);
            if (res.ok) {
                const data = await res.json();
                setPatients(data);
            }
        } catch (err) {
            console.error("Search failed:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddTest = () => setTests([...tests, ""]);
    const handleRemoveTest = (index: number) => {
        const newTests = tests.filter((_, i) => i !== index);
        setTests(newTests.length ? newTests : [""]);
    };

    const updateTest = (index: number, value: string) => {
        const newTests = [...tests];
        newTests[index] = value;
        setTests(newTests);
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedPatient && !isNewPatient) return;

        setSubmitting(true);
        setMessage(null);

        try {
            const res = await fetch("/api/lab/direct-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    patientId: selectedPatient?._id,
                    isNewPatient,
                    patientData: isNewPatient ? newPatientData : null,
                    tests: tests.filter(t => t.trim() !== ""),
                    priority
                })
            });

            if (res.ok) {
                setMessage({ type: 'success', text: isNewPatient ? "Patient registered and order created!" : "Direct test order created successfully!" });
                setSelectedPatient(null);
                setIsNewPatient(false);
                setNewPatientData({ firstName: "", lastName: "", dob: "", gender: "male", phone: "" });
                setTests([""]);
                setPriority("routine");
                setSearchQuery("");
                setTimeout(() => setMessage(null), 5000);
            } else {
                const err = await res.json();
                setMessage({
                    type: 'error',
                    text: err.message || err.error || "Failed to create order"
                });
            }
        } catch (err) {
            setMessage({ type: 'error', text: "An error occurred during submission" });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="max-w-6xl mx-auto space-y-10 pb-20">
                {/* Status Message */}
                {message && (
                    <div className={`fixed top-24 right-8 z-50 p-4 rounded-2xl shadow-xl border animate-in fade-in slide-in-from-top-4 duration-300 ${message.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-red-50 border-red-100 text-red-700'
                        }`}>
                        <div className="flex items-center gap-3">
                            {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                            <p className="text-sm font-bold">{message.text}</p>
                        </div>
                    </div>
                )}

                {/* Header */}
                <div className="flex justify-between items-end">
                    <div>
                        <h2 className="text-4xl font-black text-slate-900 tracking-tight italic uppercase">Test Scheduling</h2>
                        <p className="text-olive-600 text-[10px] font-black mt-2 uppercase tracking-[0.4em]">WALK-IN DIAGNOSTIC DISPATCH</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
                    {/* Left: Patient Selection/Registration */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-sm space-y-8">
                            <div className="flex p-2 bg-slate-50 rounded-[28px]">
                                <button
                                    type="button"
                                    onClick={() => { setIsNewPatient(false); setSelectedPatient(null); }}
                                    className={`flex-1 py-3 px-6 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${!isNewPatient ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    Find Subject
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setIsNewPatient(true); setSelectedPatient(null); }}
                                    className={`flex-1 py-3 px-6 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${isNewPatient ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    New Subject
                                </button>
                            </div>

                            {!isNewPatient ? (
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Search Clinical Archive</label>
                                        <div className="relative">
                                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                            <input
                                                type="text"
                                                placeholder="MRN or Name..."
                                                className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-3xl outline-none focus:ring-2 focus:ring-olive-500 transition-all font-bold text-slate-900"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6 animate-in fade-in slide-in-from-top-4">
                                    <div className="p-6 bg-olive-50 rounded-3xl border border-olive-100">
                                        <p className="text-[10px] font-black text-olive-600 uppercase tracking-widest leading-relaxed">
                                            You are in <span className="underline italic">Direct Registration Mode</span>. Capture basic details to spawn a temporary MRN.
                                        </p>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Subject Demographics</label>
                                            <div className="grid grid-cols-2 gap-4 mt-2">
                                                <input
                                                    placeholder="First Name"
                                                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-olive-500 font-bold text-sm"
                                                    value={newPatientData.firstName}
                                                    onChange={(e) => setNewPatientData({ ...newPatientData, firstName: e.target.value })}
                                                />
                                                <input
                                                    placeholder="Last Name"
                                                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-olive-500 font-bold text-sm"
                                                    value={newPatientData.lastName}
                                                    onChange={(e) => setNewPatientData({ ...newPatientData, lastName: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">DOB</label>
                                                <input
                                                    type="date"
                                                    className="w-full mt-2 px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-olive-500 font-bold text-sm"
                                                    value={newPatientData.dob}
                                                    onChange={(e) => setNewPatientData({ ...newPatientData, dob: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Gender</label>
                                                <select
                                                    className="w-full mt-2 px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-olive-500 font-bold text-sm uppercase"
                                                    value={newPatientData.gender}
                                                    onChange={(e) => setNewPatientData({ ...newPatientData, gender: e.target.value })}
                                                >
                                                    <option value="male">Male</option>
                                                    <option value="female">Female</option>
                                                    <option value="other">Other</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Phone Reference</label>
                                            <input
                                                placeholder="e.g. +1 234 567 890"
                                                className="w-full mt-2 px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-olive-500 font-bold text-sm"
                                                value={newPatientData.phone}
                                                onChange={(e) => setNewPatientData({ ...newPatientData, phone: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 noscrollbar">
                            {loading ? (
                                <div className="text-center py-10 text-slate-400 font-bold animate-pulse">Searching clinical archive...</div>
                            ) : searchQuery && patients.length === 0 ? (
                                <div className="text-center py-10 text-slate-300 font-black uppercase tracking-widest">No matching subjects found</div>
                            ) : (
                                patients.map((p) => (
                                    <button
                                        key={p._id}
                                        onClick={() => setSelectedPatient(p)}
                                        className={`w-full text-left p-6 rounded-[32px] border transition-all flex items-center justify-between group ${selectedPatient?._id === p._id
                                            ? 'bg-olive-600 border-olive-600 text-white shadow-xl shadow-olive-600/20'
                                            : 'bg-slate-50 border-slate-100 text-slate-900 hover:bg-white hover:border-olive-400 shadow-sm'
                                            }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${selectedPatient?._id === p._id ? 'bg-white/20' : 'bg-white text-slate-400'}`}>
                                                <User size={24} />
                                            </div>
                                            <div>
                                                <h4 className="font-black tracking-tight">{p.firstName} {p.lastName}</h4>
                                                <p className={`text-[9px] font-black uppercase tracking-widest ${selectedPatient?._id === p._id ? 'text-white/60' : 'text-slate-400'}`}>MRN: {p.mrn}</p>
                                            </div>
                                        </div>
                                        <ChevronRight size={18} className={`transition-transform group-hover:translate-x-1 ${selectedPatient?._id === p._id ? 'text-white/40' : 'text-slate-300'}`} />
                                    </button>
                                ))
                            )}
                        </div>

                        {/* Summary of Selected Patient */}
                        {selectedPatient && (
                            <div className="bg-slate-900 rounded-[40px] p-8 mt-6 text-white relative overflow-hidden animate-in slide-in-from-left-4">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-olive-400 mb-6 relative z-10">Subject Selection Verified</h4>
                                <div className="space-y-4 relative z-10">
                                    <div className="flex justify-between border-b border-white/10 pb-4">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Full Name</span>
                                        <span className="font-black italic">{selectedPatient.firstName} {selectedPatient.lastName}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-white/10 pb-4">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">MRN Reference</span>
                                        <span className="font-mono text-xs">{selectedPatient.mrn}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Demographics</span>
                                        <span className="text-xs font-bold">{selectedPatient.gender} • {new Date(selectedPatient.dob).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <Activity size={120} className="absolute -bottom-10 -right-10 text-white/5" />
                            </div>
                        )}
                    </div>



                    {/* Right: Direct Order Form */}
                    <div className="lg:col-span-3">
                        <form onSubmit={handleFormSubmit} className={`bg-white rounded-[48px] border border-slate-100 shadow-sm p-10 space-y-10 transition-all ${(!selectedPatient && !isNewPatient) ? 'opacity-50 pointer-events-none grayscale' : ''}`}>
                            <div className="flex items-center justify-between">
                                <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                                    <Beaker size={28} className="text-olive-600" /> Walk-in Order Dispatch
                                </h3>
                                {(!selectedPatient && !isNewPatient) && <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-lg animate-pulse">Identify subject to proceed</span>}
                                {isNewPatient && <span className="text-[9px] font-black text-olive-600 uppercase tracking-widest bg-olive-50 px-3 py-1 rounded-lg">New Subject Enrolled</span>}
                            </div>

                            {/* Test List */}
                            <div className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Diagnostic Protocol(s)</label>
                                    <button
                                        type="button"
                                        onClick={handleAddTest}
                                        className="text-[10px] font-black text-olive-600 uppercase tracking-widest hover:text-olive-700 underline decoration-2 underline-offset-4"
                                    >
                                        + Add Test
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {tests.map((test, index) => (
                                        <div key={index} className="flex gap-4 group">
                                            <div className="flex-1 relative">
                                                <div className="absolute left-6 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-olive-500" />
                                                <input
                                                    required
                                                    type="text"
                                                    placeholder="Enter test name (e.g., Blood Glucose, CBC)"
                                                    className="w-full pl-12 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-[28px] outline-none focus:ring-2 focus:ring-olive-500 transition-all font-bold text-sm"
                                                    value={test}
                                                    onChange={(e) => updateTest(index, e.target.value)}
                                                />
                                            </div>
                                            {tests.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveTest(index)}
                                                    className="p-4 bg-red-50 text-red-400 rounded-2xl hover:bg-red-500 hover:text-white transition-all"
                                                >
                                                    <X size={20} />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Priority & Scheduling */}
                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Clinical Priority</label>
                                    <select
                                        className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-[28px] outline-none focus:ring-2 focus:ring-olive-500 font-black text-xs uppercase tracking-widest appearance-none transition-all"
                                        value={priority}
                                        onChange={(e) => setPriority(e.target.value)}
                                    >
                                        <option value="routine">Routine Protocol</option>
                                        <option value="urgent">Urgent Escalation</option>
                                        <option value="stat">STAT Immediate</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Expected Turnaround</label>
                                    <div className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-[28px] flex items-center justify-between">
                                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Auto-Calculated</span>
                                        <Clock size={16} className="text-slate-300" />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6">
                                <button
                                    disabled={submitting || (!selectedPatient && !isNewPatient)}
                                    type="submit"
                                    className="w-full py-6 bg-slate-900 text-white rounded-[32px] font-black text-sm uppercase tracking-[0.3em] shadow-2xl hover:bg-olive-600 transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50"
                                >
                                    {submitting ? "Transmitting Direct Order..." : (
                                        <>
                                            <CheckCircle2 size={24} />
                                            {isNewPatient ? "Register & Commit Diagnostics" : "Commit Diagnostics"}
                                        </>
                                    )}
                                </button>
                                <p className="text-center text-[9px] font-black text-slate-400 uppercase tracking-widest mt-6">
                                    Note: Direct orders bypass hospital physician approval but require lab head verification.
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </DashboardLayout >
    );
}
