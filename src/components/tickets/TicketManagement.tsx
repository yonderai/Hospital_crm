"use client";

import { useEffect, useState } from "react";
import {
    Plus, Filter, CheckCircle2, XCircle, Clock,
    AlertCircle, FileText, Banknote, User as UserIcon, Calendar
} from "lucide-react";

interface TicketManagementProps {
    mode: "user" | "finance"; // user = create/view, finance = review/approve
}

export default function TicketManagement({ mode }: TicketManagementProps) {
    const [tickets, setTickets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState<any>(null);

    // Form States
    const [formData, setFormData] = useState({
        title: "", description: "", category: "IT", priority: "Medium", photoUrl: ""
    });

    // Review States
    const [reviewData, setReviewData] = useState({ status: "", remarks: "", amount: 0 });

    const fetchTickets = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/tickets");
            if (res.ok) setTickets(await res.json());
        } catch (error) {
            console.error("Failed to fetch tickets", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTickets();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/tickets", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                setShowModal(false);
                setFormData({ title: "", description: "", category: "IT", priority: "Medium", photoUrl: "" });
                fetchTickets();
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleReview = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedTicket) return;
        try {
            const res = await fetch(`/api/tickets/${selectedTicket._id}/review`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(reviewData)
            });
            if (res.ok) {
                setSelectedTicket(null);
                fetchTickets();
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase italic">
                        {mode === "finance" ? "Finance Approvals" : "Support Tickets"}
                    </h2>
                    <p className="text-sm font-black text-slate-400 uppercase tracking-widest mt-1">
                        {mode === "finance" ? "Review & Process Requests" : "Report Issues & Track Status"}
                    </p>
                </div>
                {mode === "user" && (
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2 shadow-xl shadow-slate-900/20"
                    >
                        <Plus size={16} /> New Request
                    </button>
                )}
            </div>

            {/* Stats (Simulated for Demo) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                    { label: "Total Tickets", val: tickets.length, color: "text-slate-900" },
                    { label: "Pending", val: tickets.filter(t => t.status === "Pending").length, color: "text-orange-500" },
                    { label: "Approved", val: tickets.filter(t => t.status === "Approved").length, color: "text-emerald-600" },
                    { label: "Denied", val: tickets.filter(t => t.status === "Denied").length, color: "text-red-500" }
                ].map((s, i) => (
                    <div key={i} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm text-center">
                        <h3 className={`text-4xl font-black italic tracking-tighter ${s.color}`}>{s.val}</h3>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{s.label}</p>
                    </div>
                ))}
            </div>

            {/* Ticket List */}
            <div className="grid grid-cols-1 gap-6">
                {loading ? <div className="text-center py-20 animate-pulse text-slate-400 font-bold uppercase tracking-widest">Loading Tickets...</div> :
                    tickets.length === 0 ? <div className="text-center py-20 text-slate-400 font-bold uppercase tracking-widest border-2 border-dashed border-slate-100 rounded-[32px]">No Tickets Found</div> :
                        tickets.map((ticket) => (
                            <div key={ticket._id} onClick={() => mode === "finance" && setSelectedTicket(ticket)} className={`bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-8 group transition-all ${mode === "finance" ? 'cursor-pointer hover:border-olive-400 hover:shadow-lg' : ''}`}>
                                <div className="flex-1 space-y-4">
                                    <div className="flex items-center gap-4">
                                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${ticket.status === "Approved" ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                            ticket.status === "Denied" ? "bg-red-50 text-red-600 border-red-100" :
                                                "bg-orange-50 text-orange-600 border-orange-100"
                                            }`}>{ticket.status}</span>
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{new Date(ticket.createdAt).toLocaleDateString()}</span>
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">• {ticket.category}</span>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tight">{ticket.title}</h3>
                                        <p className="text-xs font-medium text-slate-500 mt-2 leading-relaxed">{ticket.description}</p>
                                    </div>
                                    {mode === "finance" && (
                                        <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                            <UserIcon size={12} /> Requested By: <span className="text-slate-900">{ticket.requestedBy?.firstName} {ticket.requestedBy?.lastName}</span>
                                        </div>
                                    )}
                                    {ticket.approvalDetails?.remarks && (
                                        <div className="bg-slate-50 p-4 rounded-xl text-xs text-slate-600 italic border border-slate-100">
                                            <span className="font-bold not-italic text-[9px] uppercase tracking-widest block text-slate-400 mb-1">Finace Remarks</span>
                                            "{ticket.approvalDetails.remarks}"
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-col items-end justify-between min-w-[150px]">
                                    <div className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg ${ticket.priority === "High" ? "bg-red-50 text-red-600" : "bg-slate-100 text-slate-500"
                                        }`}>Priority: {ticket.priority}</div>

                                    {ticket.approvalDetails?.amount > 0 && (
                                        <div className="text-right mt-4">
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Approved Cost</p>
                                            <p className="text-2xl font-black text-emerald-600 italic tracking-tight">${ticket.approvalDetails.amount}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
            </div>

            {/* Create Ticket Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
                    <div className="bg-white w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-8 border-b border-slate-100 bg-slate-50">
                            <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tight">New Support Ticket</h3>
                        </div>
                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Issue Title</label>
                                <input required type="text" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:border-slate-400 transition-all" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="Brief title..." />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
                                    <select className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-bold outline-none" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                                        {["IT", "Equipment", "Maintenance", "Finance", "Other"].map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Priority</label>
                                    <select className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-bold outline-none" value={formData.priority} onChange={e => setFormData({ ...formData, priority: e.target.value })}>
                                        {["Low", "Medium", "High"].map(p => <option key={p} value={p}>{p}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Description</label>
                                <textarea required rows={4} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-medium outline-none resize-none" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="Detailed description..." />
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-500 hover:bg-slate-100 transition-all">Cancel</button>
                                <button type="submit" className="flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-widest bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20">Submit Ticket</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Review Ticket Modal (Finance Only) */}
            {selectedTicket && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
                    <div className="bg-white w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-8 border-b border-slate-100 bg-slate-50">
                            <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tight">Review Request</h3>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{selectedTicket.title}</p>
                        </div>
                        <form onSubmit={handleReview} className="p-8 space-y-6">
                            <div className="bg-slate-50 p-6 rounded-2xl text-xs text-slate-600 italic mb-6">
                                "{selectedTicket.description}"
                            </div>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Action</label>
                                    <div className="flex gap-4">
                                        <button type="button" onClick={() => setReviewData({ ...reviewData, status: "Approved" })} className={`flex-1 py-3 rounded-xl border-2 font-black text-xs uppercase tracking-widest transition-all ${reviewData.status === "Approved" ? "border-emerald-500 bg-emerald-50 text-emerald-600" : "border-slate-100 text-slate-400"}`}>Approve</button>
                                        <button type="button" onClick={() => setReviewData({ ...reviewData, status: "Denied" })} className={`flex-1 py-3 rounded-xl border-2 font-black text-xs uppercase tracking-widest transition-all ${reviewData.status === "Denied" ? "border-red-500 bg-red-50 text-red-600" : "border-slate-100 text-slate-400"}`}>Deny</button>
                                    </div>
                                </div>
                                {reviewData.status === "Approved" && (
                                    <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Approved Expense Amount (₹)</label>
                                        <input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-lg font-black outline-none focus:border-emerald-500 transition-all text-emerald-600" placeholder="0.00" value={reviewData.amount} onChange={e => setReviewData({ ...reviewData, amount: parseFloat(e.target.value) })} />
                                    </div>
                                )}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Remarks</label>
                                    <textarea required rows={3} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-medium outline-none resize-none" placeholder="Reason for approval/denial..." value={reviewData.remarks} onChange={e => setReviewData({ ...reviewData, remarks: e.target.value })} />
                                </div>
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setSelectedTicket(null)} className="flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-500 hover:bg-slate-100 transition-all">Cancel</button>
                                <button type="submit" disabled={!reviewData.status} className="flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-widest bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 disabled:opacity-50">Confirm Decision</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
