"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Check, X, Search, FileText, Calendar, ImageIcon, Hammer } from "lucide-react";

interface Ticket {
    _id: string;
    title: string;
    description: string;
    category: string;
    priority: string;
    status: string;
    estimatedCost?: number;
    createdAt: string;
    requestedBy?: {
        firstName: string;
        lastName: string;
    };
    images?: string[];
}

export default function FinanceTicketsPage() {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    // Decoupled state: only store ID, find object on render or fetch separately if needed
    const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

    // Derived state for the right panel - strictly isolated by ID lookup
    const selectedTicket = tickets.find(t => t._id === selectedTicketId) || null;

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        try {
            const res = await fetch("/api/maintenance/tickets?status=Pending Approval");
            if (res.ok) {
                const data = await res.json();
                setTickets(data);
            }
        } catch (error) {
            console.error("Failed to load tickets", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id: string, action: "approve" | "reject") => {
        try {
            const res = await fetch(`/api/maintenance/tickets/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action }),
            });
            if (res.ok) {
                // Determine if we should clear selection or keep it (if it disappears from list)
                // For "Pending Approval" view, approving/rejecting removes it from list.
                // So we MUST clear selection to avoid showing a stale/broken state or automatically select next.
                setSelectedTicketId(null);
                fetchTickets();
            }
        } catch (error) {
            console.error("Failed to update status", error);
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase italic">Ticket Approvals</h2>
                        <p className="text-slate-500 text-[10px] font-black mt-1 uppercase tracking-[0.4em]">Finance Verification</p>
                    </div>
                    {/* ... Search ... */}
                    <div className="flex gap-2 bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-sm">
                        <Search size={16} className="text-slate-400" />
                        <input type="text" placeholder="Search requests..." className="bg-transparent text-sm font-bold outline-none text-slate-700" />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Ticket List Panel - Independent Scroll & State */}
                    <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden min-h-[500px] flex flex-col">
                        <div className="p-6 border-b border-slate-50 bg-slate-50/50">
                            <h3 className="text-lg font-black text-slate-900 tracking-tight">Pending Requests</h3>
                        </div>
                        <div className="divide-y divide-slate-50 overflow-y-auto max-h-[600px]">
                            {loading ? (
                                <div className="p-8 text-center text-slate-400 font-medium">Loading tickets...</div>
                            ) : tickets.length === 0 ? (
                                <div className="p-12 text-center">
                                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                                        <Hammer size={32} />
                                    </div>
                                    <p className="text-slate-500 font-bold">No pending tickets found.</p>
                                </div>
                            ) : (
                                tickets.map((ticket) => (
                                    <div
                                        key={ticket._id}
                                        onClick={() => setSelectedTicketId(ticket._id)}
                                        className={`p-6 cursor-pointer hover:bg-slate-50 transition-colors group ${selectedTicketId === ticket._id ? 'bg-slate-50 ring-1 ring-olive-500/20' : ''}`}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            {/* ... Ticket Item Content ... */}
                                            <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${ticket.priority === 'Critical' ? 'bg-red-100 text-red-600' :
                                                ticket.priority === 'High' ? 'bg-orange-100 text-orange-600' :
                                                    'bg-green-100 text-green-600'
                                                }`}>
                                                {ticket.priority}
                                            </span>
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                {new Date(ticket.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <h4 className="font-black text-slate-900 leading-tight mb-1">{ticket.title}</h4>
                                        <p className="text-xs font-bold text-slate-500 line-clamp-2 mb-3">{ticket.description}</p>
                                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                            <span>{ticket.category}</span>
                                            <span>•</span>
                                            <span>Est: ${ticket.estimatedCost || 0}</span>
                                            {ticket.images && ticket.images.length > 0 && (
                                                <span className="ml-auto flex items-center gap-1 text-olive-600">
                                                    <ImageIcon size={12} /> Photo
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Ticket Detail Panel - Isolated View */}
                    <div className="space-y-6">
                        {selectedTicket ? (
                            <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl overflow-hidden sticky top-8">
                                <div className="p-8 space-y-6">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            {/* Header Info */}
                                            <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">{selectedTicket.title}</h2>
                                            <p className="text-xs font-bold text-slate-500 mt-2 uppercase tracking-wider">
                                                Requested by {selectedTicket.requestedBy?.firstName} {selectedTicket.requestedBy?.lastName}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-3xl font-black text-slate-900">${selectedTicket.estimatedCost || 0}</div>
                                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Est. Cost</div>
                                        </div>
                                    </div>

                                    <div className="p-6 bg-slate-50 rounded-2xl">
                                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Description</h4>
                                        <p className="text-sm font-bold text-slate-700 leading-relaxed">
                                            {selectedTicket.description}
                                        </p>
                                    </div>

                                    {selectedTicket.images && selectedTicket.images.length > 0 ? (
                                        <div className="space-y-3">
                                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Attached Proof</h4>
                                            <div className="rounded-2xl overflow-hidden border border-slate-200">
                                                <img
                                                    src={selectedTicket.images[0]}
                                                    alt="Ticket Proof"
                                                    className="w-full h-64 object-cover hover:scale-105 transition-transform duration-500 cursor-zoom-in"
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="p-4 border-2 border-dashed border-slate-200 rounded-2xl text-center">
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">No photos attached</p>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                                        <button
                                            onClick={() => handleAction(selectedTicket._id, "reject")}
                                            className="py-4 rounded-xl border-2 border-slate-100 text-slate-600 font-black text-xs uppercase tracking-widest hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all flex items-center justify-center gap-2"
                                        >
                                            <X size={16} /> Deny Request
                                        </button>
                                        <button
                                            onClick={() => handleAction(selectedTicket._id, "approve")}
                                            className="py-4 rounded-xl bg-[#42542B] text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-olive-600/20 hover:bg-olive-800 transition-all flex items-center justify-center gap-2"
                                        >
                                            <Check size={16} /> Approve Ticket
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-center p-12 text-slate-400 border-2 border-dashed border-slate-200 rounded-[40px]">
                                <FileText size={48} className="mb-4 opacity-20" />
                                <p className="font-bold text-sm">Select a ticket to view details</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
