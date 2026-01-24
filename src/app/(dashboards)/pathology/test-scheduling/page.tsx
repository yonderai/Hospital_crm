"use client";

import { useEffect, useState } from "react";
import {
    Calendar,
    Clock,
    User,
    Search,
    Filter,
    CheckCircle2,
    AlertCircle
} from "lucide-react";

interface Order {
    orderId: string;
    patientId: { firstName: string; lastName: string };
    orderingProviderId: { firstName: string; lastName: string };
    tests: string[];
    createdAt: string;
    status: string;
    priority: string;
    scheduledAt?: string;
}

export default function TestScheduling() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [scheduleDate, setScheduleDate] = useState("");
    const [technicianId, setTechnicianId] = useState("tech-1"); // Mock technician selection

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await fetch("/api/pathology/appointments");
            if (res.ok) {
                const data = await res.json();
                setOrders(data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSchedule = async () => {
        if (!selectedOrder || !scheduleDate) return;

        try {
            const res = await fetch("/api/pathology/appointments", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    orderId: selectedOrder.orderId,
                    scheduledDate: scheduleDate,
                    technicianId
                })
            });

            if (res.ok) {
                // Remove from list or update
                // For now, refreshing list
                fetchOrders();
                setSelectedOrder(null);
                setScheduleDate("");
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Test Scheduling</h1>
                <p className="text-slate-500 font-medium mt-1">Manage pending lab orders and assign slots.</p>
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-4 bg-slate-50 px-4 py-2 rounded-xl w-96">
                        <Search size={18} className="text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search orders..."
                            className="bg-transparent border-none outline-none text-sm font-medium w-full"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                            <tr>
                                <th className="px-6 py-4">Order ID</th>
                                <th className="px-6 py-4">Patient</th>
                                <th className="px-6 py-4">Tests</th>
                                <th className="px-6 py-4">Priority</th>
                                <th className="px-6 py-4">Requested By</th>
                                <th className="px-6 py-4">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr><td colSpan={6} className="p-8 text-center text-slate-400">Loading orders...</td></tr>
                            ) : orders.length === 0 ? (
                                <tr><td colSpan={6} className="p-8 text-center text-slate-400">No pending orders found.</td></tr>
                            ) : (
                                orders.map((order) => (
                                    <tr key={order.orderId} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4 font-bold text-slate-700">
                                            {order.orderId}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-slate-900">{order.patientId?.firstName} {order.patientId?.lastName}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-1">
                                                {order.tests.map(t => (
                                                    <span key={t} className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded-md mb-1 mr-1 inline-block">
                                                        {t}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${order.priority === 'urgent' || order.priority === 'stat'
                                                    ? 'bg-red-50 text-red-600'
                                                    : 'bg-blue-50 text-blue-600'
                                                }`}>
                                                {order.priority}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">
                                            Dr. {order.orderingProviderId?.lastName}
                                        </td>
                                        <td className="px-6 py-4">
                                            {selectedOrder?.orderId === order.orderId ? (
                                                <div className="flex items-center gap-2 animate-in fade-in zoom-in duration-200">
                                                    <input
                                                        type="datetime-local"
                                                        className="px-2 py-1 border border-slate-200 rounded-lg text-xs"
                                                        value={scheduleDate}
                                                        onChange={(e) => setScheduleDate(e.target.value)}
                                                    />
                                                    <button
                                                        onClick={handleSchedule}
                                                        className="p-1.5 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
                                                    >
                                                        <CheckCircle2 size={16} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => setSelectedOrder(order)}
                                                    className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-colors"
                                                >
                                                    Schedule
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
