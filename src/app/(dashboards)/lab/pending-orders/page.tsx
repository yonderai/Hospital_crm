"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Beaker, User, Calendar, AlertCircle, CheckCircle, Clock, FileText } from "lucide-react";

interface LabOrder {
    _id: string;
    orderId: string;
    patientId: {
        firstName: string;
        lastName: string;
        mrn: string;
        contact: { phone: string; email: string };
    };
    orderingProviderId?: {
        firstName: string;
        lastName: string;
        department: string;
    };
    tests: string[];
    priority: "routine" | "urgent" | "stat";
    status: string;
    createdAt: string;
    sampleCollectedAt?: string;
}

interface TestResult {
    testName: string;
    value: string;
    unit: string;
    referenceRange: string;
    abnormalFlag: boolean;
    notes: string;
}

export default function PendingOrdersPage() {
    const [orders, setOrders] = useState<LabOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<LabOrder | null>(null);
    const [results, setResults] = useState<TestResult[]>([]);
    const [submitting, setSubmitting] = useState(false);

    const fetchOrders = async () => {
        try {
            const res = await fetch("/api/lab/pending-orders");
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

    const handleOpenModal = (order: LabOrder) => {
        setSelectedOrder(order);
        // Initialize results array with test names
        const initialResults = order.tests.map(test => ({
            testName: test,
            value: "",
            unit: "",
            referenceRange: "",
            abnormalFlag: false,
            notes: ""
        }));
        setResults(initialResults);
    };

    const handleSubmitResults = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedOrder) return;

        setSubmitting(true);
        try {
            const res = await fetch("/api/lab/submit-results", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    orderId: selectedOrder._id,
                    results
                })
            });

            if (res.ok) {
                alert("Results submitted successfully!");
                setSelectedOrder(null);
                fetchOrders(); // Refresh the list
            } else {
                alert("Failed to submit results");
            }
        } catch (error) {
            console.error("Error submitting results:", error);
            alert("Error submitting results");
        } finally {
            setSubmitting(false);
        }
    };

    const updateResult = (index: number, field: keyof TestResult, value: string | boolean) => {
        const newResults = [...results];
        (newResults[index] as any)[field] = value;
        setResults(newResults);
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "stat": return "bg-red-100 text-red-700 border-red-200 animate-pulse";
            case "urgent": return "bg-orange-100 text-orange-700 border-orange-200";
            default: return "bg-slate-100 text-slate-600 border-slate-200";
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "ordered": return "bg-blue-100 text-blue-700";
            case "collected": return "bg-purple-100 text-purple-700";
            case "in-progress": return "bg-yellow-100 text-yellow-700";
            default: return "bg-slate-100 text-slate-600";
        }
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="p-10 text-slate-400 font-bold animate-pulse">Loading pending orders...</div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Pending Lab Orders</h1>
                        <p className="text-olive-600 text-sm font-bold mt-2">Process and submit test results</p>
                    </div>
                    <div className="flex items-center gap-3 px-6 py-3 bg-slate-900 text-white rounded-2xl">
                        <Beaker size={24} />
                        <div>
                            <p className="text-2xl font-black">{orders.length}</p>
                            <p className="text-[10px] font-bold uppercase tracking-widest opacity-70">Pending</p>
                        </div>
                    </div>
                </div>

                {/* Orders List */}
                {orders.length === 0 ? (
                    <div className="bg-white rounded-[40px] p-20 text-center border border-slate-100">
                        <Beaker size={64} className="mx-auto text-slate-200 mb-4" />
                        <p className="text-slate-400 font-black uppercase tracking-widest">No pending orders</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div
                                key={order._id}
                                className="bg-white rounded-[40px] p-8 border border-slate-100 hover:border-olive-300 transition-all hover:shadow-xl hover:shadow-olive-600/5"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1 space-y-6">
                                        {/* Patient Info */}
                                        <div className="flex items-center gap-6">
                                            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center">
                                                <User size={32} className="text-slate-400" />
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-black text-slate-900">
                                                    {order.patientId?.firstName} {order.patientId?.lastName}
                                                </h3>
                                                <p className="text-sm font-bold text-slate-500">MRN: {order.patientId?.mrn}</p>
                                                <p className="text-xs font-medium text-slate-400 mt-1">
                                                    {order.patientId?.contact?.phone} • {order.patientId?.contact?.email}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Order Details */}
                                        <div className="grid grid-cols-2 gap-6">
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Ordering Physician</p>
                                                {order.orderingProviderId ? (
                                                    <>
                                                        <p className="text-sm font-bold text-slate-900">
                                                            Dr. {order.orderingProviderId?.firstName} {order.orderingProviderId?.lastName}
                                                        </p>
                                                        <p className="text-xs text-slate-500">{order.orderingProviderId?.department}</p>
                                                    </>
                                                ) : (
                                                    <p className="text-sm font-bold text-olive-600 italic">Direct Walk-in</p>
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Order ID</p>
                                                <p className="text-sm font-bold text-slate-900 font-mono">{order.orderId}</p>
                                                <p className="text-xs text-slate-500">
                                                    {new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString()}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Tests */}
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Tests Requested</p>
                                            <div className="flex flex-wrap gap-2">
                                                {order.tests.map((test, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="px-4 py-2 bg-slate-50 text-slate-700 rounded-xl text-xs font-bold border border-slate-100"
                                                    >
                                                        {test}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Status Badges */}
                                        <div className="flex items-center gap-3">
                                            <span className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border ${getPriorityColor(order.priority)}`}>
                                                {order.priority}
                                            </span>
                                            <span className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest ${getStatusColor(order.status)}`}>
                                                {order.status}
                                            </span>
                                            {order.sampleCollectedAt && (
                                                <span className="px-4 py-2 bg-green-50 text-green-700 rounded-xl text-xs font-bold flex items-center gap-2">
                                                    <CheckCircle size={14} />
                                                    Sample Collected
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Action Button */}
                                    <button
                                        onClick={() => handleOpenModal(order)}
                                        className="px-6 py-3 bg-olive-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-olive-700 transition-all shadow-lg shadow-olive-600/20 flex items-center gap-2"
                                    >
                                        <FileText size={16} />
                                        Submit Results
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Results Modal */}
                {selectedOrder && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-in fade-in">
                        <div className="bg-white w-full max-w-4xl rounded-[48px] shadow-2xl border border-white/20 overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
                            <div className="p-10 border-b border-slate-50 flex items-center justify-between bg-white">
                                <div>
                                    <h4 className="text-3xl font-black text-slate-900 tracking-tight">Submit Test Results</h4>
                                    <p className="text-olive-600 text-sm font-bold mt-2">
                                        {selectedOrder.patientId?.firstName} {selectedOrder.patientId?.lastName} ({selectedOrder.patientId?.mrn})
                                    </p>
                                </div>
                                <button
                                    onClick={() => setSelectedOrder(null)}
                                    className="w-12 h-12 flex items-center justify-center bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-2xl transition-all"
                                >
                                    ✕
                                </button>
                            </div>

                            <form onSubmit={handleSubmitResults} className="p-10 space-y-8 overflow-y-auto">
                                {results.map((result, idx) => (
                                    <div key={idx} className="p-8 bg-slate-50/50 rounded-[32px] border border-slate-100 space-y-6">
                                        <h5 className="text-lg font-black text-slate-900">{result.testName}</h5>

                                        <div className="grid grid-cols-2 gap-6">
                                            <div>
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Result Value *</label>
                                                <input
                                                    required
                                                    type="text"
                                                    className="w-full mt-2 px-6 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-olive-500"
                                                    value={result.value}
                                                    onChange={(e) => updateResult(idx, "value", e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Unit *</label>
                                                <input
                                                    required
                                                    type="text"
                                                    placeholder="e.g., mg/dL, %"
                                                    className="w-full mt-2 px-6 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-olive-500"
                                                    value={result.unit}
                                                    onChange={(e) => updateResult(idx, "unit", e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Reference Range *</label>
                                                <input
                                                    required
                                                    type="text"
                                                    placeholder="e.g., 70-100"
                                                    className="w-full mt-2 px-6 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-olive-500"
                                                    value={result.referenceRange}
                                                    onChange={(e) => updateResult(idx, "referenceRange", e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Abnormal Flag</label>
                                                <div className="mt-2 flex items-center gap-4">
                                                    <label className="flex items-center gap-2 cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            className="w-5 h-5 rounded text-red-600 focus:ring-red-500"
                                                            checked={result.abnormalFlag}
                                                            onChange={(e) => updateResult(idx, "abnormalFlag", e.target.checked)}
                                                        />
                                                        <span className="text-sm font-bold text-slate-700">Mark as Abnormal</span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Notes</label>
                                            <textarea
                                                rows={3}
                                                className="w-full mt-2 px-6 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-olive-500"
                                                value={result.notes}
                                                onChange={(e) => updateResult(idx, "notes", e.target.value)}
                                                placeholder="Additional observations or comments..."
                                            />
                                        </div>
                                    </div>
                                ))}

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full py-6 bg-slate-900 text-white rounded-[32px] font-black text-sm uppercase tracking-[0.3em] shadow-2xl hover:bg-olive-700 transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-70"
                                >
                                    {submitting ? "Submitting..." : <>Submit All Results <CheckCircle size={20} /></>}
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
