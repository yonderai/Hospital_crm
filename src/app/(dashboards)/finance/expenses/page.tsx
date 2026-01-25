"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { useState, useEffect } from "react";
import { Plus, Search, Filter, DollarSign } from "lucide-react";

export default function ExpensesPage() {
    const [expenses, setExpenses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [showModal, setShowModal] = useState(false);
    const [newItem, setNewItem] = useState({
        category: "other",
        description: "",
        amount: 0,
        expenseDate: new Date().toISOString().split('T')[0],
        status: "pending"
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await fetch("/api/finance/expenses");
            const data = await res.json();
            setExpenses(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to load expenses");
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async () => {
        try {
            const res = await fetch("/api/finance/expenses", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newItem)
            });
            if (res.ok) {
                setShowModal(false);
                setNewItem({ category: "other", description: "", amount: 0, expenseDate: new Date().toISOString().split('T')[0], status: "pending" });
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
                            <h3 className="text-2xl font-black text-slate-900 tracking-tight italic mb-6 uppercase">New Expense</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Category</label>
                                    <select
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-olive-500 transition-all"
                                        value={newItem.category}
                                        onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                                    >
                                        {["rent", "internet", "housekeeping", "security", "waste-disposal", "laundry", "cafeteria", "other"].map(opt => (
                                            <option key={opt} value={opt}>{opt.toUpperCase()}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Description</label>
                                    <input
                                        type="text"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-olive-500 transition-all"
                                        placeholder="E.g. Monthly Internet Bill"
                                        value={newItem.description}
                                        onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Amount ($)</label>
                                        <input
                                            type="number"
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-olive-500 transition-all"
                                            value={newItem.amount}
                                            onChange={(e) => setNewItem({ ...newItem, amount: Number(e.target.value) })}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Date</label>
                                        <input
                                            type="date"
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-olive-500 transition-all"
                                            value={newItem.expenseDate}
                                            onChange={(e) => setNewItem({ ...newItem, expenseDate: e.target.value })}
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
                                        className="flex-1 py-4 bg-[#42542B] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-olive-600/20 hover:bg-olive-800 transition-all"
                                    >
                                        Create Expense
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight italic uppercase">Operating Expenses</h2>
                        <p className="text-slate-500 text-[10px] font-black mt-1 uppercase tracking-[0.4em]">Manage Daily Costs</p>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-[#42542B] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-olive-600/20 hover:bg-olive-800 transition-all"
                    >
                        <Plus size={16} /> New Expense
                    </button>
                </div>

                <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                        <h3 className="text-xl font-black text-slate-900 tracking-tight">Expense Records</h3>
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
                                    <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                                    <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</th>
                                    <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Description</th>
                                    <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                                    <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan={5} className="px-8 py-8 text-center font-bold text-slate-500">Loading records...</td></tr>
                                ) : expenses.length === 0 ? (
                                    <tr><td colSpan={5} className="px-8 py-8 text-center font-bold text-slate-500">No expense records found.</td></tr>
                                ) : (
                                    expenses.map((expense) => (
                                        <tr key={expense._id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-all">
                                            <td className="px-8 py-4 text-sm font-bold text-slate-600">
                                                {new Date(expense.expenseDate).toLocaleDateString()}
                                            </td>
                                            <td className="px-8 py-4">
                                                <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-wider">
                                                    {expense.category}
                                                </span>
                                            </td>
                                            <td className="px-8 py-4 text-sm font-bold text-slate-900">{expense.description}</td>
                                            <td className="px-8 py-4 text-sm font-black text-slate-900">
                                                ${expense.amount.toLocaleString()}
                                            </td>
                                            <td className="px-8 py-4">
                                                <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${expense.status === 'approved' ? 'bg-green-100 text-green-700' :
                                                        expense.status === 'pending' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
                                                    }`}>
                                                    {expense.status}
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
