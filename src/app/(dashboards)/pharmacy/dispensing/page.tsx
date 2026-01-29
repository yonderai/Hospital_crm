"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
    Pill,
    CheckCircle,
    ShoppingBag,
    User,
    AlertTriangle
} from "lucide-react";

interface Medication {
    drugName: string;
    dosage: string;
    quantity: number;
    instructions: string;
}

interface Prescription {
    _id: string;
    prescriptionId: string;
    patientId: { firstName: string; lastName: string; mrn: string };
    providerId: { firstName: string; lastName: string };
    medications: Medication[];
    status: string;
    prescribedDate: string;
}

export default function PharmacyDispensing() {
    const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
    const [history, setHistory] = useState<Prescription[]>([]);
    const [activeTab, setActiveTab] = useState<"queue" | "history">("queue");
    const [selectedRx, setSelectedRx] = useState<Prescription | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        try {
            const [queueRes, historyRes] = await Promise.all([
                fetch("/api/pharmacy/queue"),
                fetch("/api/pharmacy/history")
            ]);

            if (queueRes.ok) {
                const data = await queueRes.json();
                setPrescriptions(Array.isArray(data) ? data : []);
            }

            if (historyRes.ok) {
                const data = await historyRes.json();
                setHistory(Array.isArray(data) ? data : []);
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 30000); // 30s auto-refresh
        return () => clearInterval(interval);
    }, []);

    const handleDispense = async () => {
        if (!selectedRx) return;
        setLoading(true);
        setError(null);

        try {
            const res = await fetch("/api/pharmacy/dispense", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prescriptionId: selectedRx._id })
            });

            const data = await res.json();

            if (res.ok) {
                await fetchData(); // Refresh both lists
                setSelectedRx(null);
            } else {
                setError(data.error || "Error dispensing.");
            }
        } catch (err) {
            setError("Connection failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="flex h-[calc(100vh-100px)] gap-6 font-sans">
                {/* Left Panel: Navigation */}
                <div className="w-1/3 flex flex-col gap-6 bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 overflow-hidden">
                    <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight italic uppercase">Dispensing</h3>
                        <span className="text-[10px] font-black bg-teal-50 text-teal-600 px-3 py-1 rounded-full uppercase tracking-widest border border-teal-100">
                            Live Stream
                        </span>
                    </div>

                    <div className="flex gap-2 p-1.5 bg-slate-100 rounded-[20px]">
                        <button
                            onClick={() => { setActiveTab("queue"); setSelectedRx(null); }}
                            className={`flex-1 py-3 rounded-[14px] text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'queue' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            Rx Queue ({prescriptions.length})
                        </button>
                        <button
                            onClick={() => { setActiveTab("history"); setSelectedRx(null); }}
                            className={`flex-1 py-3 rounded-[14px] text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'history' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            History ({history.length})
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                        {(activeTab === "queue" ? prescriptions : history).length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-40 opacity-40">
                                <Pill size={40} className="mb-3 text-slate-300" />
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Empty State</p>
                            </div>
                        ) : (activeTab === "queue" ? prescriptions : history).map(rx => (
                            <div
                                key={rx._id}
                                onClick={() => { setSelectedRx(rx); setError(null); }}
                                className={`p-6 rounded-[28px] border cursor-pointer transition-all duration-300 relative overflow-hidden group ${selectedRx?._id === rx._id ? 'border-teal-500 bg-teal-50 shadow-xl shadow-teal-500/5' : 'border-slate-100 bg-slate-50/50 hover:bg-white hover:border-teal-200'}`}
                            >
                                <div className="relative z-10">
                                    <div className="flex justify-between items-start mb-3">
                                        <span className={`text-[9px] font-black px-2.5 py-1 rounded-md uppercase tracking-widest ${selectedRx?._id === rx._id ? 'bg-teal-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
                                            Ref: {rx.prescriptionId.slice(-8)}
                                        </span>
                                        <span className="text-[10px] text-slate-400 font-bold">{new Date(rx.prescribedDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                    <h4 className="font-black text-slate-900 tracking-tight uppercase group-hover:text-teal-600 transition-colors">
                                        {rx.patientId?.firstName} {rx.patientId?.lastName}
                                    </h4>
                                    <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-wider block">
                                        {rx.medications.length} items • Dr. {rx.providerId?.lastName}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Panel: Rx Details */}
                <div className="flex-1 bg-white p-10 rounded-[40px] shadow-sm border border-slate-100 flex flex-col relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none">
                        <ShoppingBag size={200} />
                    </div>

                    {!selectedRx ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-300">
                            <div className="w-24 h-24 bg-slate-50 rounded-[32px] flex items-center justify-center mb-6">
                                <ShoppingBag size={40} className="opacity-20" />
                            </div>
                            <p className="text-xs font-black uppercase tracking-[0.4em] italic text-slate-400">Target Selection Pending</p>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col z-10">
                            <div className="flex justify-between items-start mb-10">
                                <div>
                                    <div className="flex items-center gap-4 mb-2">
                                        <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-teal-400">
                                            <User size={28} />
                                        </div>
                                        <div>
                                            <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase italic leading-none">
                                                {selectedRx.patientId?.firstName} {selectedRx.patientId?.lastName}
                                            </h2>
                                            <p className="text-[10px] font-black text-teal-600 uppercase tracking-[0.3em] mt-2">Active Clinical Profile • {selectedRx.patientId?.mrn}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right space-y-2">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Prescribed By</p>
                                    <div className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl">
                                        <p className="text-sm font-black text-slate-700">Dr. {selectedRx.providerId?.firstName} {selectedRx.providerId?.lastName}</p>
                                    </div>
                                    <p className="text-[9px] font-bold text-slate-400 px-1 italic italic">Authorized on {new Date(selectedRx.prescribedDate).toLocaleString()}</p>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto pr-6 custom-scrollbar">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-2">
                                        <div className="w-1.5 h-6 bg-teal-500 rounded-full" />
                                        Prescription List
                                    </h3>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{selectedRx.medications.length} items to process</span>
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    {selectedRx.medications.map((med, idx) => (
                                        <div key={idx} className="flex justify-between items-center p-6 bg-slate-50/50 rounded-[28px] border border-slate-100 hover:border-teal-200 transition-all group">
                                            <div className="flex items-center gap-5">
                                                <div className="w-12 h-12 bg-white rounded-xl border border-slate-100 flex items-center justify-center text-teal-600 shadow-sm group-hover:scale-110 transition-transform">
                                                    <Pill size={20} />
                                                </div>
                                                <div>
                                                    <div className="font-black text-slate-900 uppercase tracking-tight">{med.drugName}</div>
                                                    <div className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">
                                                        {med.dosage} • <span className="italic normal-case">{med.instructions}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-xl font-black text-teal-600 bg-white px-6 py-2 rounded-2xl border border-teal-100 shadow-sm">
                                                <span className="text-[9px] uppercase tracking-widest mr-2 opacity-50">QTY</span>{med.quantity}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {error && (
                                <div className="my-6 p-5 rounded-2xl bg-red-50 border border-red-100 flex items-center gap-4 text-red-600 animate-bounce">
                                    <AlertTriangle size={24} />
                                    <span className="text-xs font-black uppercase tracking-widest">{error}</span>
                                </div>
                            )}

                            <div className="mt-8 pt-8 border-t border-slate-100">
                                {activeTab === "queue" ? (
                                    <>
                                        <div className="flex items-center gap-4 bg-teal-50/50 p-6 rounded-[28px] border border-teal-100/50 mb-8">
                                            <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-teal-500/20">
                                                <ShoppingBag size={18} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-teal-800 uppercase tracking-[0.2em] mb-1">Billing synchronization</p>
                                                <p className="text-xs text-teal-700 font-medium opacity-80 italic">Standard pharmacy charges will be automatically appended to the patient's active claim.</p>
                                            </div>
                                        </div>
                                        <div className="flex justify-end gap-4">
                                            <button
                                                onClick={() => setSelectedRx(null)}
                                                className="px-10 py-5 rounded-[24px] font-black text-[10px] uppercase tracking-[0.2em] text-slate-400 hover:bg-slate-50 transition-all"
                                            >
                                                Abort
                                            </button>
                                            <button
                                                onClick={handleDispense}
                                                disabled={loading}
                                                className="px-12 py-5 bg-slate-900 text-teal-400 rounded-[24px] font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl shadow-slate-900/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center gap-3"
                                            >
                                                {loading ? "Synchronizing..." : <> <CheckCircle size={18} /> Finalize & Dispense </>}
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="bg-slate-50 p-6 rounded-[28px] border border-slate-100 text-center">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">This prescription was successfully dispensed and billed.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
