"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { useState, useEffect } from "react";
import { Plus, Search, Package, ShoppingBag } from "lucide-react";

export default function ProcurementPage() {
    const [pos, setPos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [suppliers, setSuppliers] = useState<any[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [newItem, setNewItem] = useState({
        poNumber: `PO-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`,
        supplierId: "",
        items: [],
        totalAmount: 0,
        status: "ordered"
    });

    useEffect(() => {
        fetchData();
        fetchSuppliers();
    }, []);

    const fetchData = async () => {
        try {
            const res = await fetch("/api/finance/procurement");
            const data = await res.json();
            setPos(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to load POs");
        } finally {
            setLoading(false);
        }
    };

    const fetchSuppliers = async () => {
        try {
            const res = await fetch("/api/finance/suppliers");
            if (res.ok) {
                const data = await res.json();
                setSuppliers(data);
                // Set default supplier if available
                if (data.length > 0) {
                    setNewItem(prev => ({ ...prev, supplierId: data[0]._id }));
                }
            }
        } catch (error) {
            console.error("Failed to load suppliers");
        }
    };

    const handleCreate = async () => {
        try {
            const res = await fetch("/api/finance/procurement", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newItem)
            });
            if (res.ok) {
                setShowModal(false);
                // Reset form with new random PO number
                setNewItem({
                    poNumber: `PO-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`,
                    supplierId: suppliers.length > 0 ? suppliers[0]._id : "",
                    items: [],
                    totalAmount: 0,
                    status: "ordered"
                });
                fetchData();
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-8 relative">
                {/* Modal Overlay */}
                {showModal && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm">
                        <div className="bg-white rounded-[32px] p-8 w-[500px] shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-200">
                            <h3 className="text-2xl font-black text-slate-900 tracking-tight italic mb-6 uppercase">New Purchase Order</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">PO Number</label>
                                    <input
                                        type="text"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-olive-500 transition-all"
                                        value={newItem.poNumber}
                                        onChange={(e) => setNewItem({ ...newItem, poNumber: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Supplier</label>
                                    <select
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-olive-500 transition-all"
                                        value={newItem.supplierId}
                                        onChange={(e) => setNewItem({ ...newItem, supplierId: e.target.value })}
                                    >
                                        {suppliers.map(s => (
                                            <option key={s._id} value={s._id}>{s.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Total Amount (₹)</label>
                                    <input
                                        type="number"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-olive-500 transition-all"
                                        value={newItem.totalAmount}
                                        onChange={(e) => setNewItem({ ...newItem, totalAmount: Number(e.target.value) })}
                                    />
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleCreate}
                                        className="flex-1 py-4 bg-[#42542B] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-olive-600/20 hover:bg-olive-800 transition-all"
                                    >
                                        Create Order
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight italic uppercase">Procurement</h2>
                        <p className="text-slate-500 text-[10px] font-black mt-1 uppercase tracking-[0.4em]">Vendor & Purchase Order Management</p>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-[#42542B] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-olive-600/20 hover:bg-olive-800 transition-all"
                    >
                        <Plus size={16} /> New Purchase Order
                    </button>
                </div>

                <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                        <h3 className="text-xl font-black text-slate-900 tracking-tight">Purchase Orders</h3>
                        <div className="flex gap-2">
                            <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl">
                                <Search size={16} className="text-slate-400" />
                                <input type="text" placeholder="Search PO..." className="bg-transparent text-sm font-bold outline-none" />
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50 border-b border-slate-100">
                                <tr>
                                    <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">PO Number</th>
                                    <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Supplier</th>
                                    <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                                    <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Items</th>
                                    <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Total</th>
                                    <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan={6} className="px-8 py-8 text-center font-bold text-slate-500">Loading orders...</td></tr>
                                ) : pos.length === 0 ? (
                                    <tr><td colSpan={6} className="px-8 py-8 text-center font-bold text-slate-500">No purchase orders found.</td></tr>
                                ) : (
                                    pos.map((po) => (
                                        <tr key={po._id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-all">
                                            <td className="px-8 py-4 text-sm font-black text-slate-900">{po.poNumber}</td>
                                            <td className="px-8 py-4 text-sm font-bold text-slate-600">{po.supplierId?.name || 'Unknown'}</td>
                                            <td className="px-8 py-4 text-sm font-bold text-slate-600">
                                                {new Date(po.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-8 py-4 text-sm font-bold text-slate-600">{po.items?.length || 0}</td>
                                            <td className="px-8 py-4 text-sm font-black text-slate-900">
                                                ₹{po.totalAmount.toLocaleString()}
                                            </td>
                                            <td className="px-8 py-4">
                                                <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${po.status === 'received' ? 'bg-green-100 text-green-700' :
                                                    po.status === 'ordered' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
                                                    }`}>
                                                    {po.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
