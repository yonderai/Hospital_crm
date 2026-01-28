"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Filter, Wrench } from "lucide-react";
import Link from "next/link";

export default function MaintenanceTicketsPage() {
    const [tickets, setTickets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/maintenance/tickets")
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) setTickets(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Open": return "bg-blue-100 text-blue-700";
            case "Pending Approval": return "bg-yellow-100 text-yellow-700";
            case "Approved": return "bg-purple-100 text-purple-700";
            case "In Progress": return "bg-orange-100 text-orange-700";
            case "Completed": return "bg-green-100 text-green-700";
            case "Rejected": return "bg-red-100 text-red-700";
            default: return "bg-slate-100 text-slate-700";
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">My Tickets</h1>
                    <p className="text-sm text-slate-500">Track and manage your maintenance requests</p>
                </div>
                <Link href="/maintenance/raise-ticket" className="px-4 py-2 bg-olive-600 text-white rounded-xl hover:bg-olive-700 transition-colors flex items-center gap-2 font-medium">
                    <Plus size={18} /> Raise Ticket
                </Link>
            </div>

            {/* Filters */}
            <div className="flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search tickets..."
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-olive-500/20 focus:border-olive-500"
                    />
                </div>
                <button className="px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 flex items-center gap-2">
                    <Filter size={18} /> Filter
                </button>
            </div>

            {/* List */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Ticket ID</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Issue</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Category</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Priority</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Created</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {loading ? (
                            <tr><td colSpan={6} className="text-center py-8 text-slate-500">Loading tickets...</td></tr>
                        ) : tickets.length === 0 ? (
                            <tr><td colSpan={6} className="text-center py-8 text-slate-500">No tickets found. Raise a new one to get started.</td></tr>
                        ) : (
                            tickets.map((ticket) => (
                                <tr key={ticket._id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 text-sm font-medium text-slate-900">#{ticket._id.slice(-6).toUpperCase()}</td>
                                    <td className="px-6 py-4 text-sm text-slate-600">
                                        <div className="font-medium text-slate-900">{ticket.title}</div>
                                        <div className="text-xs text-slate-400 truncate max-w-[200px]">{ticket.description}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600">{ticket.category}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase
                                            ${ticket.priority === 'High' || ticket.priority === 'Critical' ? 'bg-red-100 text-red-700' :
                                                ticket.priority === 'Medium' ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-600'}`}>
                                            {ticket.priority}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${getStatusColor(ticket.status)}`}>
                                            {ticket.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500">
                                        {new Date(ticket.createdAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
