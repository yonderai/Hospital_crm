"use client";

import { useState, useCallback, useEffect, ChangeEvent } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import {
    Search,
    AlertOctagon,
    Hammer,
    FileText,
    Plus,
    Camera,
    X,
    CheckCircle,
    Clock,
    AlertTriangle
} from "lucide-react";

interface Ticket {
    _id: string;
    title: string;
    description: string;
    status: "Open" | "Pending Approval" | "Approved" | "Rejected" | "In Progress" | "Completed";
    priority: "Low" | "Medium" | "High" | "Critical";
    category: string;
    requestedBy?: {
        firstName: string;
        lastName: string;
    };
    assignedTo?: string;
    createdAt: string;
    images?: string[];
    estimatedCost?: number;
}

interface SessionUser {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role: string;
}

export default function MaintenanceTicketsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentStatusFilter = searchParams.get("status");

    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    // Auto-open form based on URL param
    useEffect(() => {
        if (searchParams.get('create') === 'true') {
            setShowForm(true);
            // Optional: Clean URL without refresh
            const newParams = new URLSearchParams(searchParams.toString());
            newParams.delete('create');
            router.replace(`/maintenance/tickets?${newParams.toString()}`);
        }
    }, [searchParams, router]);

    // Form State
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "Elevator",
        priority: "Medium",
        estimatedCost: "",
        image: "" // Base64 string of the uploaded image
    });

    // Decoupled state for Ticket Details View
    const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
    const selectedTicket = tickets.find(t => t._id === selectedTicketId) || null;

    const fetchTickets = useCallback(async () => {
        setLoading(true);
        try {
            const query = currentStatusFilter ? `?status=${currentStatusFilter}` : "";
            const res = await fetch(`/api/maintenance/tickets${query}`);
            if (res.ok) {
                const data = await res.json();
                setTickets(data);
            }
        } catch (error) {
            console.error("Failed to fetch tickets", error);
        } finally {
            setLoading(false);
        }
    }, [currentStatusFilter]);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        } else if (status === "authenticated") {
            if ((session?.user as SessionUser).role !== "maintenance") {
                router.push("/access-denied");
            } else {
                fetchTickets();
            }
        }
    }, [status, session, router, fetchTickets]);

    const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, image: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setFormData({ ...formData, image: "" });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                images: formData.image ? [formData.image] : []
            };

            const res = await fetch("/api/maintenance/tickets", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                setShowForm(false);
                setFormData({
                    title: "",
                    description: "",
                    category: "Elevator",
                    priority: "Medium",
                    estimatedCost: "",
                    image: ""
                });
                fetchTickets();
            }
        } catch (error) {
            console.error("Error submitting ticket", error);
        }
    };

    const handleFilterClick = (statusFilter: string) => {
        router.push(`/maintenance/tickets?status=${statusFilter}`);
    };

    const clearFilter = () => {
        router.push("/maintenance/tickets");
    };

    return (
        <DashboardLayout>
            <div className="space-y-8 h-[calc(100vh-140px)] flex flex-col">
                {/* Header Section */}
                <div className="flex items-center justify-between flex-shrink-0">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Work Orders</h2>
                        <p className="text-slate-500 text-sm font-medium mt-1 uppercase tracking-widest">
                            FACILITY MANAGEMENT • OPERATIONS
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={() => setShowForm(true)}
                            className="flex items-center gap-2 rounded-full bg-olive-700 px-6 py-3 text-white shadow-lg hover:bg-olive-800 transition-all font-bold tracking-wide uppercase text-xs"
                        >
                            <Plus size={16} /> Raise Ticket
                        </button>
                    </div>
                </div>

                {/* Main Content Split */}
                <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
                    {/* Ticket List Panel */}
                    <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm flex flex-col h-full overflow-hidden">
                        <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/30 flex-shrink-0">
                            <div>
                                <h3 className="text-lg font-black text-slate-900 tracking-tight">Active Operations</h3>
                                <p className="text-xs text-slate-500 font-medium mt-1">
                                    {currentStatusFilter ? `Filtered: ${currentStatusFilter}` : "All Tickets"}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                {['Approved', 'Pending Approval', 'Rejected'].map(status => (
                                    <button
                                        key={status}
                                        onClick={() => handleFilterClick(status)}
                                        className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${currentStatusFilter === status ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
                                        title={status}
                                    >
                                        <div className={`w-2 h-2 rounded-full ${status === 'Approved' ? 'bg-green-500' :
                                            status === 'Pending Approval' ? 'bg-orange-500' : 'bg-red-500'
                                            }`} />
                                    </button>
                                ))}
                                {currentStatusFilter && (
                                    <button onClick={clearFilter} className="ml-2 text-[10px] font-bold text-slate-400 uppercase hover:text-slate-900">Clear</button>
                                )}
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-0">
                            {loading ? (
                                <div className="p-12 text-center text-slate-400 font-medium">Loading tickets...</div>
                            ) : tickets.length === 0 ? (
                                <div className="p-12 text-center">
                                    <Hammer size={32} className="mx-auto mb-4 text-slate-300" />
                                    <p className="text-slate-500 font-bold">No tickets found.</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-slate-50">
                                    {tickets.map((ticket) => (
                                        <div
                                            key={ticket._id}
                                            onClick={() => setSelectedTicketId(ticket._id)}
                                            className={`p-6 cursor-pointer hover:bg-slate-50 transition-colors group ${selectedTicketId === ticket._id ? 'bg-slate-50 ring-1 ring-olive-500/20' : ''}`}
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${ticket.priority === 'Critical' ? 'bg-red-100 text-red-600' : ticket.priority === 'High' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}>
                                                    {ticket.priority}
                                                </span>
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{new Date(ticket.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            <h4 className="font-black text-slate-900 leading-tight mb-1">{ticket.title}</h4>
                                            <p className="text-xs font-bold text-slate-500 line-clamp-2 mb-3">{ticket.description}</p>
                                            <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                                <span>{ticket.category}</span>
                                                <span className={`px-2 py-0.5 rounded-full ${ticket.status === 'Approved' ? 'bg-green-100 text-green-600' : ticket.status === 'Rejected' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}`}>{ticket.status}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Ticket Detail Panel */}
                    <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl overflow-hidden flex flex-col h-full sticky top-0">
                        {selectedTicket ? (
                            <div className="p-8 space-y-6 overflow-y-auto flex-1">
                                <div className="flex justify-between items-start">
                                    <div>
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
                                    <p className="text-sm font-bold text-slate-700 leading-relaxed">{selectedTicket.description}</p>
                                </div>
                                {selectedTicket.images && selectedTicket.images.length > 0 ? (
                                    <div className="space-y-3">
                                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Attached Proof</h4>
                                        <div className="rounded-2xl overflow-hidden border border-slate-200">
                                            <img src={selectedTicket.images[0]} alt="Ticket Proof" className="w-full h-64 object-cover" />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-4 border-2 border-dashed border-slate-200 rounded-2xl text-center">
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">No photos attached</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-center p-12 text-slate-400">
                                <FileText size={48} className="mb-4 opacity-20" />
                                <p className="font-bold text-sm">Select a ticket to view details</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Raise Ticket Modal */}
                {showForm && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
                        <div className="w-full max-w-lg rounded-3xl bg-white p-8 shadow-2xl transform transition-all scale-100 max-h-[90vh] overflow-y-auto">
                            <h2 className="mb-6 text-2xl font-black text-slate-900 tracking-tight">New Maintenance Request</h2>
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Title</label>
                                    <input type="text" required className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:border-olive-500 outline-none" placeholder="e.g. Broken AC" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Category</label>
                                        <select className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:border-olive-500 outline-none bg-white" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                                            {["Elevator", "Plumbing", "Electrical", "Equipment", "Furniture", "Other"].map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Priority</label>
                                        <select className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:border-olive-500 outline-none bg-white" value={formData.priority} onChange={(e) => setFormData({ ...formData, priority: e.target.value })}>
                                            {["Low", "Medium", "High", "Critical"].map(p => <option key={p} value={p}>{p}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Est. Cost</label>
                                    <input type="number" className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:border-olive-500 outline-none" placeholder="Optional" value={formData.estimatedCost} onChange={(e) => setFormData({ ...formData, estimatedCost: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Proof / Photo</label>
                                    <div className="flex items-center gap-4">
                                        <label className="flex flex-col items-center justify-center w-24 h-24 rounded-2xl border-2 border-dashed border-slate-200 cursor-pointer hover:border-olive-500 hover:bg-olive-50 transition-all group">
                                            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                                            <Camera size={24} className="text-slate-400 group-hover:text-olive-600 mb-1" />
                                            <span className="text-[10px] font-bold text-slate-400 group-hover:text-olive-600 uppercase">Upload</span>
                                        </label>
                                        {formData.image && (
                                            <div className="relative w-24 h-24 rounded-2xl overflow-hidden border border-slate-100">
                                                <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                                                <button type="button" onClick={removeImage} className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 hover:bg-black/70"><X size={12} /></button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Description</label>
                                    <textarea required className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:border-olive-500 outline-none min-h-[100px]" placeholder="Describe the issue..." rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                                </div>
                                <div className="flex justify-end gap-3 pt-2">
                                    <button type="button" onClick={() => setShowForm(false)} className="rounded-xl px-6 py-3 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-colors">Cancel</button>
                                    <button type="submit" className="rounded-xl bg-olive-700 px-8 py-3 text-white font-bold text-sm hover:bg-olive-800 transition-colors shadow-lg shadow-olive-700/20">Submit Request</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
