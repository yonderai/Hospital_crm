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
    actualCost?: number;
    requestedBy?: {
        firstName: string;
        lastName: string;
    };
    createdAt: string;
}

export default function BackOfficeDashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [reviewAction, setReviewAction] = useState<"approve" | "reject" | null>(null);
    const [feedback, setFeedback] = useState("");

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        } else if (status === "authenticated") {
            if ((session?.user as SessionUser).role !== "backoffice") {
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

    const handleAction = async () => {
        if (!selectedTicket || !reviewAction) return;

        try {
            const res = await fetch(`/api/maintenance/tickets/${selectedTicket._id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: reviewAction,
                    feedback: feedback
                }),
            });

            if (res.ok) {
                setReviewAction(null);
                setSelectedTicket(null);
                setFeedback("");
                fetchTickets();
            }
        } catch (error) {
            console.error("Error updating ticket", error);
        }
    };

    if (loading) return <div className="p-8 text-center text-olive-800">Loading...</div>;

    const pendingTickets = tickets.filter(t => t.status !== "Approved" && t.status !== "Rejected" && t.status !== "Completed");
    const totalCost = tickets.reduce((sum, t) => sum + (t.status === "Approved" ? (t.actualCost || t.estimatedCost || 0) : 0), 0);

    return (
        <div className="min-h-screen bg-olive-50 p-6">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-olive-900">Back Office Dashboard</h1>
                <p className="text-olive-700">Approve maintenance requests and track expenses.</p>
            </header>

            <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-lg bg-white p-6 shadow">
                    <h3 className="text-sm font-medium text-olive-500">Pending Approvals</h3>
                    <p className="mt-2 text-3xl font-bold text-olive-900">{pendingTickets.length}</p>
                </div>
                <div className="rounded-lg bg-white p-6 shadow">
                    <h3 className="text-sm font-medium text-olive-500">Total Approved Cost</h3>
                    <p className="mt-2 text-3xl font-bold text-olive-900">₹{totalCost.toLocaleString()}</p>
                </div>
            </div>

            <div className="rounded-lg bg-white p-6 shadow">
                <h3 className="mb-4 text-lg font-semibold text-olive-900">Ticket Approval Queue</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-olive-700">
                        <thead className="border-b bg-olive-50 text-xs uppercase text-olive-700">
                            <tr>
                                <th className="px-4 py-3">Title</th>
                                <th className="px-4 py-3">Requested By</th>
                                <th className="px-4 py-3">Category</th>
                                <th className="px-4 py-3">Cost (Est.)</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tickets.map((ticket) => (
                                <tr key={ticket._id} className="border-b hover:bg-olive-50">
                                    <td className="px-4 py-3 font-medium text-olive-900">{ticket.title}</td>
                                    <td className="px-4 py-3">{ticket.requestedBy?.firstName} {ticket.requestedBy?.lastName}</td>
                                    <td className="px-4 py-3">{ticket.category}</td>
                                    <td className="px-4 py-3">₹{ticket.estimatedCost || '-'}</td>
                                    <td className="px-4 py-3">
                                        <span className={`rounded-full px-2 py-1 text-xs font-semibold 
                                            ${ticket.status === 'Approved' ? 'bg-blue-100 text-blue-700' :
                                                ticket.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                                                    'bg-orange-100 text-orange-700'}`}>
                                            {ticket.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <button
                                            onClick={() => setSelectedTicket(ticket)}
                                            className="text-olive-600 hover:text-olive-900 font-medium"
                                        >
                                            View & Decide
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {selectedTicket && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
                        <h2 className="mb-2 text-xl font-semibold text-olive-900">{selectedTicket.title}</h2>
                        <div className="mb-4 text-sm text-olive-600">
                            <p><span className="font-semibold">Category:</span> {selectedTicket.category}</p>
                            <p><span className="font-semibold">Priority:</span> {selectedTicket.priority}</p>
                            <p><span className="font-semibold">Description:</span> {selectedTicket.description}</p>
                            <p><span className="font-semibold">Estimated Cost:</span> ₹{selectedTicket.estimatedCost}</p>
                        </div>

                        {reviewAction ? (
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-olive-700 mb-1">
                                    {reviewAction === 'approve' ? 'Approval Notes (Optional)' : 'Rejection Reason'}
                                </label>
                                <textarea
                                    className="w-full rounded border border-olive-300 p-2 focus:border-olive-500 focus:outline-none"
                                    rows={3}
                                    value={feedback}
                                    onChange={(e) => setFeedback(e.target.value)}
                                />
                                <div className="mt-2 flex justify-end gap-2">
                                    <button
                                        onClick={() => setReviewAction(null)}
                                        className="text-sm text-gray-500"
                                    >Back</button>
                                    <button
                                        onClick={handleAction}
                                        className={`rounded px-4 py-2 text-white 
                                            ${reviewAction === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
                                    >
                                        Confirm {reviewAction === 'approve' ? 'Approval' : 'Rejection'}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex justify-end gap-2 mt-4">
                                <button
                                    onClick={() => setSelectedTicket(null)}
                                    className="rounded px-4 py-2 text-olive-600 hover:bg-olive-50"
                                >
                                    Close
                                </button>
                                <button
                                    onClick={() => setReviewAction('reject')}
                                    className="rounded bg-red-100 px-4 py-2 text-red-700 hover:bg-red-200"
                                >
                                    Reject
                                </button>
                                <button
                                    onClick={() => setReviewAction('approve')}
                                    className="rounded bg-green-100 px-4 py-2 text-green-700 hover:bg-green-200"
                                >
                                    Approve
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
