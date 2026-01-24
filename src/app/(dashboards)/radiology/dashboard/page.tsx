"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
    Activity,
    Clipboard,
    FileText,
    CheckCircle,
    XCircle,
    UploadCloud
} from "lucide-react";

interface ImagingOrder {
    _id: string;
    patientId: { firstName: string; lastName: string; mrn: string };
    orderedBy: { firstName: string; lastName: string };
    imagingType: string;
    bodyPart: string;
    priority: string;
    status: string;
    reasonForStudy: string;
}

export default function RadiologyDashboard() {
    const [orders, setOrders] = useState<ImagingOrder[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<ImagingOrder | null>(null);
    const [report, setReport] = useState({ findings: "", impression: "", recommendations: "" });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetch("/api/specialist/radiology/queue")
            .then(res => res.json())
            .then(data => setOrders(data));
    }, []);

    const handleSubmitReport = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedOrder) return;
        setLoading(true);

        const res = await fetch("/api/specialist/radiology/report", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                orderId: selectedOrder._id,
                ...report
            })
        });

        if (res.ok) {
            alert("Report Submitted!");
            setOrders(orders.filter(o => o._id !== selectedOrder._id));
            setSelectedOrder(null);
            setReport({ findings: "", impression: "", recommendations: "" });
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
                        <Activity className="text-blue-500" />
                        Radiology Worklist
                        <span className="text-xs font-medium text-slate-400 ml-auto bg-slate-50 px-2 py-1 rounded-full">{orders.length} Pending</span>
                    </h3>

                    <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                        {orders.length === 0 ? (
                            <p className="text-slate-400 text-center text-sm py-10">No pending orders.</p>
                        ) : orders.map(order => (
                            <div
                                key={order._id}
                                onClick={() => setSelectedOrder(order)}
                                className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedOrder?._id === order._id ? 'border-blue-500 bg-blue-50 shadow-md' : 'border-slate-100 bg-slate-50 hover:bg-white hover:border-blue-200'}`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-xs font-bold uppercase text-slate-500">
                                        MRN: {order.patientId.mrn}
                                    </span>
                                    {order.priority === 'stat' && (
                                        <span className="text-[10px] font-black uppercase bg-red-100 text-red-600 px-2 py-0.5 rounded-full">STAT</span>
                                    )}
                                </div>
                                <h4 className="font-bold text-slate-800">{order.patientId.firstName} {order.patientId.lastName}</h4>
                                <p className="text-sm font-medium text-blue-600 mt-1">{order.imagingType} - {order.bodyPart}</p>
                                <p className="text-xs text-slate-400 mt-2">Dr. {order.orderedBy.lastName}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Panel: Report Editor */}
                <div className="flex-1 bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col">
                    {!selectedOrder ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                            <Clipboard size={48} className="mb-4 opacity-20" />
                            <p>Select a patient to begin reporting</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmitReport} className="flex flex-col h-full">
                            <div className="flex justify-between items-center mb-6 pb-6 border-b border-slate-100">
                                <div>
                                    <h2 className="text-2xl font-black text-slate-900">{selectedOrder.imagingType} Report</h2>
                                    <p className="text-slate-500 text-sm">Patient: {selectedOrder.patientId.firstName} {selectedOrder.patientId.lastName}</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs font-bold text-slate-400 uppercase">Reason for Study</div>
                                    <div className="font-medium text-slate-700 max-w-xs truncate">{selectedOrder.reasonForStudy}</div>
                                </div>
                            </div>

                            <div className="flex-1 space-y-6 overflow-y-auto pr-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Findings</label>
                                    <textarea
                                        required
                                        rows={6}
                                        className="w-full p-4 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none text-sm leading-relaxed"
                                        placeholder="Detailed radiological findings..."
                                        value={report.findings}
                                        onChange={e => setReport({ ...report, findings: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Impression</label>
                                    <textarea
                                        required
                                        rows={3}
                                        className="w-full p-4 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none text-sm font-medium"
                                        placeholder="Summary conclusion..."
                                        value={report.impression}
                                        onChange={e => setReport({ ...report, impression: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Recommendations</label>
                                    <input
                                        className="w-full p-4 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none text-sm"
                                        placeholder="Follow-up instructions..."
                                        value={report.recommendations}
                                        onChange={e => setReport({ ...report, recommendations: e.target.value })}
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
                                    className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-600/20 flex items-center gap-2"
                                >
                                    {loading ? "Signing..." : <> <CheckCircle size={18} /> Sign & Finalize </>}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
