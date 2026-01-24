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
    const [selectedRx, setSelectedRx] = useState<Prescription | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch("/api/pharmacy/queue")
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setPrescriptions(data);
                else setPrescriptions([]);
            })
            .catch(() => setPrescriptions([]));
    }, []);

    const handleDispense = async () => {
        if (!selectedRx) return;
        setLoading(true);
        setError(null);

        const res = await fetch("/api/pharmacy/dispense", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prescriptionId: selectedRx._id })
        });

        const data = await res.json();

        if (res.ok) {
            alert("Dispensed & Charged to Patient Bill!");
            setPrescriptions(prescriptions.filter(p => p._id !== selectedRx._id));
            setSelectedRx(null);
        } else {
            setError(data.error || "Error dispensing.");
        }
        setLoading(false);
    };

    return (
        <DashboardLayout>
            <div className="flex h-[calc(100vh-100px)] gap-6">
                {/* Left Panel: Active Prescriptions */}
                <div className="w-1/3 flex flex-col gap-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                    <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        <Pill className="text-teal-500" />
                        Rx Queue
                        <span className="text-xs font-medium text-slate-400 ml-auto bg-slate-50 px-2 py-1 rounded-full">{prescriptions.length} Pending</span>
                    </h3>

                    <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                        {prescriptions.length === 0 ? (
                            <p className="text-slate-400 text-center text-sm py-10">All active prescriptions dispensed.</p>
                        ) : prescriptions.map(rx => (
                            <div
                                key={rx._id}
                                onClick={() => { setSelectedRx(rx); setError(null); }}
                                className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedRx?._id === rx._id ? 'border-teal-500 bg-teal-50 shadow-md' : 'border-slate-100 bg-slate-50 hover:bg-white hover:border-teal-200'}`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-xs font-bold uppercase text-slate-500">
                                        RX: {rx.prescriptionId}
                                    </span>
                                </div>
                                <h4 className="font-bold text-slate-800">{rx.patientId?.firstName || "Unknown"} {rx.patientId?.lastName || "Patient"}</h4>
                                <p className="text-xs text-slate-400 mt-1">{rx.medications.length} items • Dr. {rx.providerId?.lastName || "Unknown"}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Panel: Rx Details */}
                <div className="flex-1 bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col">
                    {!selectedRx ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                            <ShoppingBag size={48} className="mb-4 opacity-20" />
                            <p>Select a prescription to dispense</p>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col">
                            <div className="flex justify-between items-start mb-8 pb-8 border-b border-slate-100">
                                <div>
                                    <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                                        <User size={24} className="text-slate-400" />
                                        {selectedRx.patientId?.firstName || "Unknown"} {selectedRx.patientId?.lastName || "Patient"}
                                    </h2>
                                    <p className="text-slate-500 text-sm mt-1 ml-9">MRN: {selectedRx.patientId?.mrn || "N/A"}</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs font-bold text-slate-400 uppercase">Prescribed By</div>
                                    <div className="font-medium text-slate-700">Dr. {selectedRx.providerId?.firstName || "Unknown"} {selectedRx.providerId?.lastName || "Provider"}</div>
                                    <div className="text-xs text-slate-400 mt-1">{new Date(selectedRx.prescribedDate).toLocaleDateString()}</div>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto pr-4">
                                <h3 className="text-sm font-bold text-slate-400 uppercase mb-4 tracking-widest">Medications</h3>
                                <div className="space-y-4">
                                    {selectedRx.medications.map((med, idx) => (
                                        <div key={idx} className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                                            <div>
                                                <div className="font-bold text-slate-800">{med.drugName}</div>
                                                <div className="text-xs text-slate-500 mt-1">{med.dosage} • {med.instructions}</div>
                                            </div>
                                            <div className="text-teal-600 font-bold bg-white px-3 py-1 rounded-lg border border-teal-100 shadow-sm">
                                                Qty: {med.quantity}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {error && (
                                <div className="mb-4 p-4 rounded-xl bg-red-50 border border-red-100 flex items-center gap-3 text-red-600">
                                    <AlertTriangle size={20} />
                                    <span className="text-sm font-bold">{error}</span>
                                </div>
                            )}

                            <div className="pt-6 border-t border-slate-100 mt-auto">
                                <div className="flex items-center justify-between bg-teal-50 p-4 rounded-xl mb-6">
                                    <span className="text-sm font-medium text-teal-800">Billing Action</span>
                                    <span className="text-sm font-bold text-teal-900">Charges will be auto-added to Patient Bill</span>
                                </div>
                                <div className="flex justify-end gap-3">
                                    <button onClick={() => setSelectedRx(null)} className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-50">
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleDispense}
                                        disabled={loading}
                                        className="px-8 py-3 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 shadow-lg shadow-teal-600/20 flex items-center gap-2"
                                    >
                                        {loading ? "Processing..." : <> <CheckCircle size={18} /> Dispense Medications</>}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
