"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { SessionUser } from "@/lib/types";

interface Ticket {
    _id: string;
    title: string;
    description: string;
    category: string;
    priority: string;
    status: string;
    estimatedCost?: number;
    createdAt: string;
}

export default function MaintenanceDashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "Elevator",
        priority: "Medium",
        estimatedCost: "",
    });

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
    }, [status, session, router]);

    const fetchTickets = async () => {
        try {
            const res = await fetch("/api/maintenance/tickets");
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
        try {
            const res = await fetch("/api/maintenance/tickets", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setShowForm(false);
                setFormData({
                    title: "",
                    description: "",
                    category: "Elevator",
                    priority: "Medium",
                    estimatedCost: "",
                });
                fetchTickets();
            }
        } catch (error) {
            console.error("Error submitting ticket", error);
        }
    };

    if (loading) return <div className="p-8 text-center text-olive-800">Loading...</div>;

    return (
        <div className="min-h-screen bg-olive-50 p-6">
            <header className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-olive-900">Maintenance Dashboard</h1>
                    <p className="text-olive-700">Manage repair requests and maintenance logs.</p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="rounded-lg bg-olive-700 px-4 py-2 text-white hover:bg-olive-800"
                >
                    + Raise Ticket
                </button>
            </header>

            {showForm && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
                        <h2 className="mb-4 text-xl font-semibold text-olive-900">New Maintenance Ticket</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-olive-700">Title</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full rounded border border-olive-300 p-2 focus:border-olive-500 focus:outline-none"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-olive-700">Category</label>
                                <select
                                    className="w-full rounded border border-olive-300 p-2 focus:border-olive-500 focus:outline-none"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                >
                                    {["Elevator", "Plumbing", "Electrical", "Equipment", "Furniture", "Other"].map((c) => (
                                        <option key={c} value={c}>
                                            {c}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-olive-700">Priority</label>
                                <select
                                    className="w-full rounded border border-olive-300 p-2 focus:border-olive-500 focus:outline-none"
                                    value={formData.priority}
                                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                >
                                    {["Low", "Medium", "High", "Critical"].map((p) => (
                                        <option key={p} value={p}>
                                            {p}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-olive-700">Est. Cost (Optional)</label>
                                <input
                                    type="number"
                                    className="w-full rounded border border-olive-300 p-2 focus:border-olive-500 focus:outline-none"
                                    value={formData.estimatedCost}
                                    onChange={(e) => setFormData({ ...formData, estimatedCost: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-olive-700">Description</label>
                                <textarea
                                    required
                                    className="w-full rounded border border-olive-300 p-2 focus:border-olive-500 focus:outline-none"
                                    rows={3}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="rounded px-4 py-2 text-olive-600 hover:bg-olive-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="rounded bg-olive-700 px-4 py-2 text-white hover:bg-olive-800"
                                >
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {/* Summary Cards could go here */}
            </div>

            <div className="mt-6 rounded-lg bg-white p-6 shadow">
                <h3 className="mb-4 text-lg font-semibold text-olive-900">My Tickets</h3>
                {tickets.length === 0 ? (
                    <p className="text-olive-500">No tickets found.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-olive-700">
                            <thead className="border-b bg-olive-50 text-xs uppercase text-olive-700">
                                <tr>
                                    <th className="px-4 py-3">Title</th>
                                    <th className="px-4 py-3">Category</th>
                                    <th className="px-4 py-3">Priority</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tickets.map((ticket) => (
                                    <tr key={ticket._id} className="border-b hover:bg-olive-50">
                                        <td className="px-4 py-3 font-medium text-olive-900">{ticket.title}</td>
                                        <td className="px-4 py-3">{ticket.category}</td>
                                        <td className="px-4 py-3">
                                            <span className={`rounded-full px-2 py-1 text-xs font-semibold 
                                            ${ticket.priority === 'Critical' ? 'bg-red-100 text-red-700' :
                                                    ticket.priority === 'High' ? 'bg-orange-100 text-orange-700' :
                                                        'bg-green-100 text-green-700'}`}>
                                                {ticket.priority}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`rounded-full px-2 py-1 text-xs font-semibold 
                                            ${ticket.status === 'Approved' ? 'bg-blue-100 text-blue-700' :
                                                    ticket.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                                                        'bg-gray-100 text-gray-700'}`}>
                                                {ticket.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">{new Date(ticket.createdAt).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
