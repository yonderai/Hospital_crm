"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { useState, useEffect } from "react";
import { Plus, Search, Filter, Wind, Zap, Droplets } from "lucide-react";

export default function UtilitiesPage() {
    const [bills, setBills] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [showModal, setShowModal] = useState(false);
    const [newItem, setNewItem] = useState({
        utilityType: "electricity",
        providerName: "",
        billNumber: "",
        consumption: 0,
        unit: "kWh",
        amount: 0,
        billDate: new Date().toISOString().split('T')[0],
        dueDate: new Date(new Date().getTime() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: "unpaid"
    });

    useEffect(() => {
        fetchBills();
    }, []);

    const fetchBills = async () => {
        try {
            const res = await fetch("/api/finance/utilities");
            const data = await res.json();
            setBills(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to load utility bills");
        } finally {
            setLoading(false);
        }
    };

    const [submitting, setSubmitting] = useState(false);

    const handleCreate = async () => {
        if (!newItem.providerName || !newItem.billNumber || newItem.amount <= 0) {
            alert("Please fill in all required fields (Provider, Bill Number, Amount)");
            return;
        }

        setSubmitting(true);
        try {
            const res = await fetch("/api/finance/utilities", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newItem)
            });
            if (res.ok) {
                setShowModal(false);
                setNewItem({
                    utilityType: "electricity",
                    providerName: "",
                    billNumber: "",
                    consumption: 0,
                    unit: "kWh",
                    amount: 0,
                    billDate: new Date().toISOString().split('T')[0],
                    dueDate: new Date(new Date().getTime() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                    status: "unpaid"
                });
                fetchBills();
            } else {
                alert("Failed to create bill. Please try again.");
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred.");
        } finally {
            setSubmitting(false);
        }
    };

    const getIcon = (type: string) => {
        if (type === 'electricity') return <Zap size={16} />;
        if (type === 'water') return <Droplets size={16} />;
        return <Wind size={16} />;
    };

    return (
        <DashboardLayout>
            <div className="space-y-8 relative">
                {/* Modal Overlay */}
                {showModal && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm">
                        <div className="bg-white rounded-[32px] p-8 w-[500px] shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-200 h-[600px] overflow-y-auto">
                            <h3 className="text-2xl font-black text-slate-900 tracking-tight italic mb-6 uppercase">Add Utility Bill</h3>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Type</label>
                                        <select
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-olive-500 transition-all"
                                            value={newItem.utilityType}
                                            onChange={(e) => {
                                                const type = e.target.value;
                                                let unit = "kWh";
                                                if (type === "water") unit = "kL";
                                                if (type === "diesel") unit = "Liters";
                                                if (type === "internet") unit = "Month";
                                                setNewItem({ ...newItem, utilityType: type, unit });
                                            }}
                                        >
                                            <option value="electricity">Electricity</option>
                                            <option value="water">Water</option>
                                            <option value="diesel">Diesel</option>
                                            <option value="internet">Internet</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Provider</label>
                                        <input
                                            type="text"
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-olive-500 transition-all"
                                            value={newItem.providerName}
                                            onChange={(e) => setNewItem({ ...newItem, providerName: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Bill Number</label>
                                    <input
                                        type="text"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-olive-500 transition-all"
                                        value={newItem.billNumber}
                                        onChange={(e) => setNewItem({ ...newItem, billNumber: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Consumption</label>
                                        <input
                                            type="number"
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-olive-500 transition-all"
                                            value={newItem.consumption}
                                            onChange={(e) => setNewItem({ ...newItem, consumption: Number(e.target.value) })}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Unit</label>
                                        <input
                                            type="text"
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-olive-500 transition-all"
                                            value={newItem.unit}
                                            onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Total Amount ($)</label>
                                    <input
                                        type="number"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-olive-500 transition-all"
                                        value={newItem.amount}
                                        onChange={(e) => setNewItem({ ...newItem, amount: Number(e.target.value) })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Bill Date</label>
                                        <input
                                            type="date"
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-olive-500 transition-all"
                                            value={newItem.billDate}
                                            onChange={(e) => setNewItem({ ...newItem, billDate: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Due Date</label>
                                        <input
                                            type="date"
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-olive-500 transition-all"
                                            value={newItem.dueDate}
                                            onChange={(e) => setNewItem({ ...newItem, dueDate: e.target.value })}
                                        />
                                    </div>
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
                                        disabled={submitting}
                                        className="flex-1 py-4 bg-[#42542B] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-olive-600/20 hover:bg-olive-800 transition-all disabled:opacity-50"
                                    >
                                        {submitting ? "Adding..." : "Add Bill"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight italic uppercase">Utilities & Infrastructure</h2>
                        <p className="text-slate-500 text-[10px] font-black mt-1 uppercase tracking-[0.4em]">Power, Water, & Diesel Tracking</p>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-[#42542B] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-olive-600/20 hover:bg-olive-800 transition-all"
                    >
                        <Plus size={16} /> Add Bill
                    </button>
                </div>

                <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                        <h3 className="text-xl font-black text-slate-900 tracking-tight">Utility Records</h3>
                        <div className="flex gap-2">
                            <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl">
                                <Search size={16} className="text-slate-400" />
                                <input type="text" placeholder="Search..." className="bg-transparent text-sm font-bold outline-none" />
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50 border-b border-slate-100">
                                <tr>
                                    <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</th>
                                    <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Provider</th>
                                    <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Bill Date</th>
                                    <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Consumption</th>
                                    <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                                    <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan={6} className="px-8 py-8 text-center font-bold text-slate-500">Loading bills...</td></tr>
                                ) : bills.length === 0 ? (
                                    <tr><td colSpan={6} className="px-8 py-8 text-center font-bold text-slate-500">No utility bills found.</td></tr>
                                ) : (
                                    bills.map((bill) => (
                                        <tr key={bill._id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-all">
                                            <td className="px-8 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="p-2 bg-slate-100 rounded-lg text-slate-500">
                                                        {getIcon(bill.utilityType)}
                                                    </div>
                                                    <span className="text-sm font-bold text-slate-700 capitalize">{bill.utilityType}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-4 text-sm font-bold text-slate-600">{bill.providerName}</td>
                                            <td className="px-8 py-4 text-sm font-bold text-slate-600">
                                                {new Date(bill.billDate).toLocaleDateString()}
                                            </td>
                                            <td className="px-8 py-4 text-sm font-bold text-slate-600">
                                                {bill.consumption} <span className="text-xs text-slate-400">{bill.unit}</span>
                                            </td>
                                            <td className="px-8 py-4 text-sm font-black text-slate-900">
                                                ${bill.amount.toLocaleString()}
                                            </td>
                                            <td className="px-8 py-4">
                                                <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${bill.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                    }`}>
                                                    {bill.status}
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
