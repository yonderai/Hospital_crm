"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Scan, User, Calendar, FileText, CheckCircle } from "lucide-react";

interface ImagingOrder {
    _id: string;
    patientId: {
        firstName: string;
        lastName: string;
        mrn: string;
        contact: { phone: string; email: string };
    };
    orderedBy: {
        firstName: string;
        lastName: string;
        department: string;
    };
    imagingType: string;
    bodyPart: string;
    priority: "routine" | "urgent" | "stat";
    reasonForStudy: string;
    status: string;
    createdAt: string;
}

export default function LabRadiologyPage() {
    const [orders, setOrders] = useState<ImagingOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<ImagingOrder | null>(null);
    const [findings, setFindings] = useState("");
    const [impression, setImpression] = useState("");
    const [recommendations, setRecommendations] = useState("");
    const [reportStatus, setReportStatus] = useState<"draft" | "preliminary" | "final">("final");
    const [submitting, setSubmitting] = useState(false);

    const fetchOrders = async () => {
        try {
            const res = await fetch("/api/radiology/pending-orders");
            if (res.ok) {
                const data = await res.json();
                setOrders(data);
            }
        } catch (error) {
            console.error("Failed to fetch orders:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleOpenModal = (order: ImagingOrder) => {
        setSelectedOrder(order);
        setFindings("");
        setImpression("");
        setRecommendations("");
        setReportStatus("final");
    };

    const handleSubmitReport = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedOrder) return;

        setSubmitting(true);
        try {
            const res = await fetch("/api/radiology/submit-report", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    orderId: selectedOrder._id,
                    findings,
                    impression,
                    recommendations,
                    status: reportStatus
                })
            });

            if (res.ok) {
                alert("Report submitted successfully!");
                setSelectedOrder(null);
                fetchOrders();
            } else {
                alert("Failed to submit report");
            }
        } catch (error) {
            console.error("Error submitting report:", error);
            alert("Error submitting report");
        } finally {
            setSubmitting(false);
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "stat": return "bg-red-100 text-red-700 border-red-200 animate-pulse";
            case "urgent": return "bg-orange-100 text-orange-700 border-orange-200";
            default: return "bg-slate-100 text-slate-600 border-slate-200";
        }
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="p-10 text-slate-400 font-bold animate-pulse">Loading pending imaging studies...</div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Pending Imaging Studies</h1>
                        <p className="text-blue-600 text-sm font-bold mt-2">Interpret and submit radiology reports</p>
                    </div>
                    <div className="flex items-center gap-3 px-6 py-3 bg-blue-600 text-white rounded-2xl">
                        <Scan size={24} />
                        <div>
                            <p className="text-2xl font-black">{orders.length}</p>
                            <p className="text-[10px] font-bold uppercase tracking-widest opacity-70">Pending</p>
                        </div>
                    </div>
                </div>

                {orders.length === 0 ? (
                    <div className="bg-white rounded-[40px] p-20 text-center border border-slate-100">
                        <Scan size={64} className="mx-auto text-slate-200 mb-4" />
                        <p className="text-slate-400 font-black uppercase tracking-widest">No pending studies</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div
                                key={order._id}
                                className="bg-white rounded-[40px] p-8 border border-slate-100 hover:border-blue-300 transition-all hover:shadow-xl hover:shadow-blue-600/5"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1 space-y-6">
                                        <div className="flex items-center gap-6">
                                            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center">
                                                <Scan size={32} className="text-blue-600" />
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-black text-slate-900">
                                                    {order.imagingType} - {order.bodyPart}
                                                </h3>
                                                <p className="text-sm font-bold text-slate-500">
                                                    {order.patientId.firstName} {order.patientId.lastName} (MRN: {order.patientId.mrn})
                                                </p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-6">
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Ordering Physician</p>
                                                <p className="text-sm font-bold text-slate-900">
                                                    Dr. {order.orderedBy.firstName} {order.orderedBy.lastName}
                                                </p>
                                                <p className="text-xs text-slate-500">{order.orderedBy.department}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Order Date</p>
                                                <p className="text-sm font-bold text-slate-900">
                                                    {new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString()}
                                                </p>
                                            </div>
                                        </div>

                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Clinical Indication</p>
                                            <p className="text-sm font-medium text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                                {order.reasonForStudy}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <span className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border ${getPriorityColor(order.priority)}`}>
                                                {order.priority}
                                            </span>
                                            <span className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-xl text-xs font-black uppercase tracking-widest">
                                                {order.status}
                                            </span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => handleOpenModal(order)}
                                        className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2"
                                    >
                                        <FileText size={16} />
                                        Submit Report
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Report Modal */}
                {selectedOrder && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-in fade-in">
                        <div className="bg-white w-full max-w-4xl rounded-[48px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
                            <div className="p-10 border-b border-slate-50 flex items-center justify-between">
                                <div>
                                    <h4 className="text-3xl font-black text-slate-900">Radiology Report</h4>
                                    <p className="text-blue-600 text-sm font-bold mt-2">
                                        {selectedOrder.imagingType} - {selectedOrder.bodyPart} | {selectedOrder.patientId.firstName} {selectedOrder.patientId.lastName}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setSelectedOrder(null)}
                                    className="w-12 h-12 flex items-center justify-center bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-2xl transition-all"
                                >
                                    ✕
                                </button>
                            </div>

                            <form onSubmit={handleSubmitReport} className="p-10 space-y-8 overflow-y-auto">
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Findings *</label>
                                    <textarea
                                        required
                                        rows={6}
                                        className="w-full mt-2 px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500"
                                        value={findings}
                                        onChange={(e) => setFindings(e.target.value)}
                                        placeholder="Describe the imaging findings in detail..."
                                    />
                                </div>

                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Impression *</label>
                                    <textarea
                                        required
                                        rows={4}
                                        className="w-full mt-2 px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500"
                                        value={impression}
                                        onChange={(e) => setImpression(e.target.value)}
                                        placeholder="Summarize the clinical impression..."
                                    />
                                </div>

                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Recommendations</label>
                                    <textarea
                                        rows={3}
                                        className="w-full mt-2 px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500"
                                        value={recommendations}
                                        onChange={(e) => setRecommendations(e.target.value)}
                                        placeholder="Clinical recommendations or follow-up suggestions..."
                                    />
                                </div>

                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Report Status</label>
                                    <select
                                        className="w-full mt-2 px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500"
                                        value={reportStatus}
                                        onChange={(e) => setReportStatus(e.target.value as any)}
                                    >
                                        <option value="draft">Draft</option>
                                        <option value="preliminary">Preliminary</option>
                                        <option value="final">Final</option>
                                    </select>
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full py-6 bg-blue-600 text-white rounded-[32px] font-black text-sm uppercase tracking-[0.3em] shadow-2xl hover:bg-blue-700 transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-70"
                                >
                                    {submitting ? "Submitting..." : <>Submit Report <CheckCircle size={20} /></>}
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
