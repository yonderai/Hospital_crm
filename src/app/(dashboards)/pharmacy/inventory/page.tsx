"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
    Search,
    Plus,
    Filter,
    MoreHorizontal,
    Package,
    AlertTriangle
} from "lucide-react";

interface InventoryItem {
    _id: string;
    sku: string;
    name: string;
    category: string;
    quantityOnHand: number;
    reorderLevel: number;
    unit: string;
    unitCost: number;
    sellingPrice: number;
    lotNumber: string;
    expiryDate: string;
}

export default function InventoryPage() {
    const [items, setItems] = useState<InventoryItem[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/pharmacy/inventory")
            .then(res => res.json())
            .then(data => {
                setItems(data);
                setLoading(false);
            });
    }, []);

    const filteredItems = items.filter(i =>
        i.name.toLowerCase().includes(search.toLowerCase()) ||
        i.sku.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <DashboardLayout>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Inventory Management</h1>
                    <p className="text-slate-500 mt-2 font-medium">Track stock levels, prices, and batches.</p>
                </div>
                <button className="px-6 py-3 bg-olive-600 text-white font-bold rounded-xl shadow-lg shadow-olive-600/20 hover:bg-olive-700 transition-all flex items-center gap-2">
                    <Plus size={18} />
                    Add New Item
                </button>
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 bg-slate-50 border border-slate-100 px-4 py-2.5 rounded-xl w-96">
                        <Search size={18} className="text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by Name or SKU..."
                            className="bg-transparent border-none outline-none text-sm font-medium text-slate-900 w-full placeholder:text-slate-400"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        <button className="p-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 font-bold text-xs flex items-center gap-2">
                            <Filter size={14} /> Filter
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100/80">
                                <th className="p-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Item Details</th>
                                <th className="p-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Category</th>
                                <th className="p-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Stock Level</th>
                                <th className="p-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Unit Cost</th>
                                <th className="p-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Selling Price</th>
                                <th className="p-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr><td colSpan={6} className="p-10 text-center text-slate-400">Loading inventory...</td></tr>
                            ) : filteredItems.length === 0 ? (
                                <tr><td colSpan={6} className="p-10 text-center text-slate-400">No items found.</td></tr>
                            ) : filteredItems.map(item => (
                                <tr key={item._id} className="group hover:bg-slate-50/80 transition-all">
                                    <td className="p-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 font-black text-xs">
                                                {item.sku.slice(0, 3)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900">{item.name}</p>
                                                <p className="text-xs text-slate-400 font-mono">SKU: {item.sku}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <span className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-bold text-slate-600 uppercase">
                                            {item.category}
                                        </span>
                                    </td>
                                    <td className="p-6 text-center">
                                        <div className="inline-flex items-center gap-2">
                                            {item.quantityOnHand <= item.reorderLevel && (
                                                <AlertTriangle size={14} className="text-orange-500" />
                                            )}
                                            <span className={`text-sm font-bold ${item.quantityOnHand <= item.reorderLevel ? 'text-orange-600' : 'text-slate-700'}`}>
                                                {item.quantityOnHand} {item.unit}s
                                            </span>
                                        </div>
                                        {item.quantityOnHand <= item.reorderLevel && (
                                            <p className="text-[9px] text-orange-400 font-bold uppercase mt-1">Reorder Level: {item.reorderLevel}</p>
                                        )}
                                    </td>
                                    <td className="p-6 text-right font-mono text-sm text-slate-500">
                                        ${item.unitCost.toFixed(2)}
                                    </td>
                                    <td className="p-6 text-right font-mono text-sm font-bold text-slate-900">
                                        ${item.sellingPrice?.toFixed(2)}
                                    </td>
                                    <td className="p-6 text-center">
                                        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
                                            <MoreHorizontal size={18} />
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
