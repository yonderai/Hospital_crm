"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
    Activity,
    Microscope,
    FileText,
    CheckCircle,
    TestTube,
} from "lucide-react";

interface LabOrder {
    _id: string;
    patientId: { firstName: string; lastName: string; mrn: string };
    orderingProviderId: { firstName: string; lastName: string };
    tests: string[];
    priority: string;
    status: string;
}

export default function PathologyDashboard() {
    const [orders, setOrders] = useState<LabOrder[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<LabOrder | null>(null);
    const [report, setReport] = useState({
        specimenSource: "",
        grossDescription: "",
        microscopicDescription: "",
        diagnosis: ""
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetch("/api/specialist/pathology/queue")
            .then(res => res.json())
            .then(data => setOrders(data));
    }, []);

    const handleSubmitReport = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedOrder) return;
        setLoading(true);

        const res = await fetch("/api/specialist/pathology/report", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                orderId: selectedOrder._id,
                ...report
            })
        });

        if (res.ok) {
            alert("Pathology Report Finalsied!");
            setOrders(orders.filter(o => o._id !== selectedOrder._id));
            setSelectedOrder(null);
            setReport({ specimenSource: "", grossDescription: "", microscopicDescription: "", diagnosis: "" });
        } else {
            alert("Error submitting report");
        }
        setLoading(false);
    };

    return (
        <DashboardLayout>
            <div className="flex h-[calc(100vh-100px)] gap-6">
                {/* Left Panel: Worklist */}
                <div className="w-1/3 flex flex-col gap-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                    <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        <Microscope className="text-purple-500" />
                        Pathology Queue
                        <span className="text-xs font-medium text-slate-400 ml-auto bg-slate-50 px-2 py-1 rounded-full">{orders.length} Samples</span>
                    </h3>

                    <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                        {orders.length === 0 ? (
                            <p className="text-slate-400 text-center text-sm py-10">No pending samples.</p>
                        ) : orders.map(order => (
                            <div
                                key={order._id}
                                onClick={() => setSelectedOrder(order)}
                                className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedOrder?._id === order._id ? 'border-purple-500 bg-purple-50 shadow-md' : 'border-slate-100 bg-slate-50 hover:bg-white hover:border-purple-200'}`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-xs font-bold uppercase text-slate-500">
                                        MRN: {order.patientId.mrn}
                                    </span>
                                    {order.priority === 'urgent' && (
                                        <span className="text-[10px] font-black uppercase bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">URGENT</span>
                                    )}
                                </div>
                                <h4 className="font-bold text-slate-800">{order.patientId.firstName} {order.patientId.lastName}</h4>
                                <div className="flex flex-wrap gap-1 mt-2">
                                    {order.tests.map(t => (
                                        <span key={t} className="text-[10px] bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-600">{t}</span>
                                    ))}
                                </div>
                                <p className="text-xs text-slate-400 mt-2">Ref: Dr. {order.orderingProviderId?.lastName}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Panel: Report Editor */}
                <div className="flex-1 bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col">
                    {!selectedOrder ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                            <TestTube size={48} className="mb-4 opacity-20" />
                            <p>Select a specimen to analyze</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmitReport} className="flex flex-col h-full">
                            <div className="flex justify-between items-center mb-6 pb-6 border-b border-slate-100">
                                <div>
                                    <h2 className="text-2xl font-black text-slate-900">Pathology Analysis</h2>
                                    <p className="text-slate-500 text-sm">Tests: {selectedOrder.tests.join(", ")}</p>
                                </div>
                            </div>

                            <div className="flex-1 space-y-6 overflow-y-auto pr-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Specimen Source</label>
                                    <input
                                        required
                                        className="w-full p-4 rounded-xl border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none text-sm"
                                        placeholder="e.g. Blood (Venous), Tissue Biopsy"
                                        value={report.specimenSource}
                                        onChange={e => setReport({ ...report, specimenSource: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Gross Description</label>
                                        <textarea
                                            required
                                            rows={4}
                                            className="w-full p-4 rounded-xl border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none text-sm"
                                            value={report.grossDescription}
                                            onChange={e => setReport({ ...report, grossDescription: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Microscopic Desc.</label>
                                        <textarea
                                            required
                                            rows={4}
                                            className="w-full p-4 rounded-xl border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none text-sm"
                                            value={report.microscopicDescription}
                                            onChange={e => setReport({ ...report, microscopicDescription: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Final Diagnosis</label>
                                    <textarea
                                        required
                                        rows={2}
                                        className="w-full p-4 rounded-xl border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none text-sm font-bold text-slate-800"
                                        placeholder="Definitive diagnosis..."
                                        value={report.diagnosis}
                                        onChange={e => setReport({ ...report, diagnosis: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
                                <button type="button" onClick={() => setSelectedOrder(null)} className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-50">
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-8 py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 shadow-lg shadow-purple-600/20 flex items-center gap-2"
                                >
                                    {loading ? "Finalizing..." : <> <CheckCircle size={18} /> Finalize Report </>}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
