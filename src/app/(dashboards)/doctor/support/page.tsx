"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Plus, Hammer, Ticket, AlertCircle, CheckCircle, Clock, Loader2, Save, X, Upload } from "lucide-react";
import Image from "next/image";

interface Ticket {
    _id: string;
    title: string;
    category: string;
    priority: string;
    status: string;
    createdAt: string;
    ticketNumber?: string;
}

export default function DoctorSupportPage() {
    const [activeTab, setActiveTab] = useState<"list" | "new">("list");
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);

    // Form State
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "Equipment",
        priority: "Medium",
        photoUrl: "",
    });

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        try {
            const res = await fetch("/api/tickets");
            if (res.ok) {
                const data = await res.json();
                setTickets(data);
            }
        } catch (error) {
            console.error("Failed to fetch tickets", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await fetch("/api/tickets", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            if (res.ok) {
                alert("Ticket Created Successfully");
                setActiveTab("list");
                fetchTickets();
                setFormData({ title: "", description: "", category: "Equipment", priority: "Medium", photoUrl: "" });
            } else {
                alert("Failed to create ticket");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setSubmitting(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Pending": return "text-amber-600 bg-amber-50 border-amber-200";
            case "Resolved": return "text-emerald-600 bg-emerald-50 border-emerald-200";
            case "Denied": return "text-red-600 bg-red-50 border-red-200";
            default: return "text-slate-600 bg-slate-50 border-slate-200";
        }
    };

    return (
        <DashboardLayout>
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Support Center</h1>
                        <p className="text-olive-600 text-[10px] font-black mt-1 uppercase tracking-[0.3em]">IT & Maintenance Helpdesk</p>
                    </div>
                    <div className="flex bg-white p-1 rounded-xl border border-slate-200">
                        <button
                            onClick={() => setActiveTab("list")}
                            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === "list" ? "bg-slate-100 text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                        >
                            My Tickets
                        </button>
                        <button
                            onClick={() => setActiveTab("new")}
                            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === "new" ? "bg-olive-600 text-white shadow-md shadow-olive-600/20" : "text-slate-500 hover:text-slate-700"}`}
                        >
                            <Plus size={14} className="inline mr-1" />
                            New Request
                        </button>
                    </div>
                </div>

                {activeTab === "list" ? (
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                        {loading ? (
                            <div className="p-12 text-center text-slate-400 text-sm">Loading tickets...</div>
                        ) : tickets.length === 0 ? (
                            <div className="p-12 text-center">
                                <Hammer size={48} className="mx-auto text-slate-200 mb-4" />
                                <h3 className="text-lg font-bold text-slate-900">No Tickets Found</h3>
                                <p className="text-slate-500 text-sm mt-1 mb-6">You haven't raised any support requests yet.</p>
                                <button
                                    onClick={() => setActiveTab("new")}
                                    className="px-6 py-3 bg-olive-600 text-white font-bold rounded-xl hover:bg-olive-700 transition-colors shadow-lg shadow-olive-600/20"
                                >
                                    Raise Ticket
                                </button>
                            </div>
                        ) : (
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 border-b border-slate-100">
                                    <tr>
                                        <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest">Ticket</th>
                                        <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest">Category</th>
                                        <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest">Priority</th>
                                        <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest">Status</th>
                                        <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {tickets.map((ticket) => (
                                        <tr key={ticket._id} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="p-6">
                                                <div className="font-bold text-slate-900">{ticket.title}</div>
                                                <div className="text-xs text-slate-500 mt-1 font-mono">ID: {ticket._id.substring(0, 8).toUpperCase()}</div>
                                            </td>
                                            <td className="p-6">
                                                <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600">
                                                    {ticket.category}
                                                </span>
                                            </td>
                                            <td className="p-6">
                                                <span className={`px-3 py-1 rounded-lg text-xs font-bold ${ticket.priority === 'High' ? 'text-red-600 bg-red-50' : 'text-slate-600 bg-slate-100'}`}>
                                                    {ticket.priority}
                                                </span>
                                            </td>
                                            <td className="p-6">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${getStatusColor(ticket.status)}`}>
                                                    {ticket.status}
                                                </span>
                                            </td>
                                            <td className="p-6 text-right text-xs text-slate-400 font-medium">
                                                {new Date(ticket.createdAt).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                ) : (
                    <div className="max-w-2xl mx-auto">
                        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Issue Category</label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {['IT', 'Equipment', 'Maintenance'].map(cat => (
                                            <button
                                                key={cat}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, category: cat })}
                                                className={`p-3 rounded-xl border text-sm font-bold transition-all ${formData.category === cat ? 'bg-olive-50 border-olive-500 text-olive-700 ring-1 ring-olive-500' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'}`}
                                            >
                                                {cat}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Priority</label>
                                    <select
                                        value={formData.priority}
                                        onChange={e => setFormData({ ...formData, priority: e.target.value })}
                                        className="w-full p-3 bg-slate-50 border-none rounded-xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-olive-500/20"
                                    >
                                        <option value="Low">Low - Can wait</option>
                                        <option value="Medium">Medium - Standard</option>
                                        <option value="High">High - Affects work</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Title</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. Printer not working"
                                        className="w-full p-3 bg-slate-50 border-none rounded-xl text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-olive-500/20"
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
                                    <textarea
                                        required
                                        rows={4}
                                        placeholder="Please describe the issue..."
                                        className="w-full p-3 bg-slate-50 border-none rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-olive-500/20 resize-none"
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setActiveTab("list")}
                                    className="px-6 py-3 text-slate-500 font-bold hover:bg-slate-50 rounded-xl transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="px-8 py-3 bg-olive-600 text-white font-bold rounded-xl hover:bg-olive-700 transition-colors shadow-lg shadow-olive-600/20 flex items-center gap-2"
                                >
                                    {submitting ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                    Submit Request
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
