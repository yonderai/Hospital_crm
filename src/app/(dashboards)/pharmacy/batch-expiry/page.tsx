"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
    Search,
    Clock,
    Filter,
} from "lucide-react";

interface InventoryItem {
    _id: string;
    sku: string;
    name: string;
    quantityOnHand: number;
    lotNumber: string;
    expiryDate: string;
}

export default function BatchExpiryPage() {
    const [items, setItems] = useState<InventoryItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/pharmacy/inventory")
            .then(res => res.json())
            .then(data => {
                // Filter items that have expiry dates
                const batchItems = data.filter((i: any) => i.expiryDate);
                setItems(batchItems);
                setLoading(false);
            });
    }, []);

    const getExpiryStatus = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = date.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) return { label: "EXPIRED", color: "bg-red-100 text-red-600" };
        if (diffDays <= 30) return { label: `Expiring in ${diffDays} days`, color: "bg-orange-100 text-orange-600" };
        return { label: `Valid (${diffDays} days left)`, color: "bg-emerald-100 text-emerald-600" };
    };

    return (
        <DashboardLayout>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Batch & Expiry Tracking</h1>
                    <p className="text-slate-500 mt-2 font-medium">Monitor medication expiration dates and lot numbers.</p>
                </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100/80">
                                <th className="p-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Medicine</th>
                                <th className="p-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Batch / Lot #</th>
                                <th className="p-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Expiry Date</th>
                                <th className="p-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Status</th>
                                <th className="p-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Stock</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr><td colSpan={5} className="p-10 text-center text-slate-400">Loading batches...</td></tr>
                            ) : items.map(item => {
                                const status = getExpiryStatus(item.expiryDate);
                                return (
                                    <tr key={item._id} className="group hover:bg-slate-50/80 transition-all">
                                        <td className="p-6">
                                            <p className="text-sm font-bold text-slate-900">{item.name}</p>
                                            <p className="text-xs text-slate-400 font-mono">{item.sku}</p>
                                        </td>
                                        <td className="p-6 font-mono text-sm text-slate-600">
                                            {item.lotNumber || "N/A"}
                                        </td>
                                        <td className="p-6 text-sm text-slate-600">
                                            {new Date(item.expiryDate).toLocaleDateString()}
                                        </td>
                                        <td className="p-6 text-center">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${status.color}`}>
                                                {status.label}
                                            </span>
                                        </td>
                                        <td className="p-6 text-right font-bold text-slate-700">
                                            {item.quantityOnHand}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
}
