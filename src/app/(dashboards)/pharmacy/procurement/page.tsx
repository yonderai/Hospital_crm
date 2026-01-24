"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
    ShoppingBag,
    Plus,
    FileText,
    CheckCircle,
    Truck
} from "lucide-react";
import Link from "next/link";

interface PO {
    _id: string;
    poNumber: string;
    supplierId: { name: string };
    totalAmount: number;
    status: string;
    orderedAt: string;
    items: { itemId: { name: string }, quantity: number }[];
}

export default function ProcurementPage() {
    const [orders, setOrders] = useState<PO[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/pharmacy/procurement")
            .then(res => res.json())
            .then(data => {
                setOrders(data);
                setLoading(false);
            });
    }, []);

    return (
        <DashboardLayout>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Procurement</h1>
                    <p className="text-slate-500 mt-2 font-medium">Manage purchase orders and supplier deliveries.</p>
                </div>
                <Link href="/pharmacy/procurement/create" className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all flex items-center gap-2">
                    <Plus size={18} />
                    Create Purchase Order
                </Link>
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100/80">
                                <th className="p-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">PO Number</th>
                                <th className="p-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Supplier</th>
                                <th className="p-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Items</th>
                                <th className="p-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Total Amount</th>
                                <th className="p-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Status</th>
                                <th className="p-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr><td colSpan={6} className="p-10 text-center text-slate-400">Loading orders...</td></tr>
                            ) : orders.length === 0 ? (
                                <tr><td colSpan={6} className="p-10 text-center text-slate-400">No purchase orders found.</td></tr>
                            ) : orders.map(po => (
                                <tr key={po._id} className="group hover:bg-slate-50/80 transition-all">
                                    <td className="p-6">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                                <FileText size={16} />
                                            </div>
                                            <span className="font-bold text-slate-900">{po.poNumber}</span>
                                        </div>
                                    </td>
                                    <td className="p-6 text-sm font-medium text-slate-600">
                                        {po.supplierId?.name || "Generic Supplier"}
                                    </td>
                                    <td className="p-6 text-sm text-slate-500">
                                        {po.items.length} items ({po.items[0]?.itemId?.name}...)
                                    </td>
                                    <td className="p-6 text-right font-bold text-slate-900">
                                        ${po.totalAmount.toLocaleString()}
                                    </td>
                                    <td className="p-6 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase 
                                                ${po.status === 'received' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'}`}>
                                                {po.status}
                                            </span>
                                            {po.status === 'ordered' && (
                                                <button
                                                    onClick={async () => {
                                                        if (!confirm("Mark as Received? This will update stock.")) return;
                                                        await fetch(`/api/pharmacy/procurement/${po._id}`, {
                                                            method: "PATCH",
                                                            headers: { "Content-Type": "application/json" },
                                                            body: JSON.stringify({ status: "received" })
                                                        });
                                                        window.location.reload();
                                                    }}
                                                    className="text-[10px] bg-slate-100 hover:bg-emerald-50 text-slate-500 hover:text-emerald-600 px-2 py-1 rounded border border-slate-200 transition-all flex items-center gap-1"
                                                >
                                                    <CheckCircle size={10} /> Receive
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-6 text-right text-xs font-bold text-slate-400 uppercase">
                                        {new Date(po.orderedAt).toLocaleDateString()}
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
