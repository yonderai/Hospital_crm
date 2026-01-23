"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Pill, Search, Plus, CheckCircle, Clock } from "lucide-react";

export default function PharmacistPharmacy() {
    const [prescriptions, setPrescriptions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchRx = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/pharmacy/prescriptions");
            if (res.ok) {
                const data = await res.json();
                setPrescriptions(data);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRx();
    }, []);

    const handleDispense = async (id: string) => {
        if (!confirm("Confirm dispensing? Stock will be deducted.")) return;
        try {
            const res = await fetch("/api/pharmacy/dispense", {
                method: "POST",
                body: JSON.stringify({ prescriptionId: id }),
                headers: { "Content-Type": "application/json" }
            });
            if (res.ok) {
                alert("Dispensed successfully");
                fetchRx();
            } else {
                const err = await res.json();
                alert("Error: " + err.error);
            }
        } catch (e) {
            alert("Dispense failed");
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Dispensing Hub</h2>
                        <p className="text-slate-500 text-sm font-medium mt-1 uppercase tracking-widest">PHARMACY OPERATIONS • ACTIVE QUEUE</p>
                    </div>
                </div>

                <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                                <th className="px-8 py-6">Prescription ID</th>
                                <th className="px-8 py-6">Patient</th>
                                <th className="px-8 py-6">Doctor</th>
                                <th className="px-8 py-6">Medications</th>
                                <th className="px-8 py-6 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? <tr><td colSpan={5} className="p-8 text-center text-slate-400">Loading...</td></tr> :
                                prescriptions.length === 0 ? <tr><td colSpan={5} className="p-8 text-center text-slate-400">No active prescriptions</td></tr> :
                                    prescriptions.map((rx: any) => (
                                        <tr key={rx._id} className="hover:bg-slate-50/50">
                                            <td className="px-8 py-6 font-bold text-slate-900 text-sm">#{rx.prescriptionId}</td>
                                            <td className="px-8 py-6">
                                                <p className="font-bold text-slate-900 text-sm">{rx.patientId?.firstName} {rx.patientId?.lastName}</p>
                                                <p className="text-[10px] text-slate-400 uppercase tracking-widest">MRN-{rx.patientId?.mrn}</p>
                                            </td>
                                            <td className="px-8 py-6 text-sm font-medium text-slate-600">Dr. {rx.providerId?.lastName}</td>
                                            <td className="px-8 py-6 border-l border-r border-dashed border-slate-100 bg-slate-50/30">
                                                <div className="space-y-1">
                                                    {rx.medications.map((m: any, i: number) => (
                                                        <div key={i} className="text-xs font-bold text-slate-700 flex items-center gap-2">
                                                            <Pill size={12} className="text-olive-500" />
                                                            {m.drugName} <span className="text-slate-400">({m.quantity})</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <button
                                                    onClick={() => handleDispense(rx.prescriptionId)}
                                                    className="px-4 py-2 bg-olive-600 hover:bg-olive-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-olive-600/20 transition-all active:scale-95"
                                                >
                                                    Dispense
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
}
