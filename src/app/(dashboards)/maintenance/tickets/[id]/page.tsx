"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, MessageSquare, Send, Paperclip, Clock, Calendar } from "lucide-react";
import Link from "next/link";

export default function TicketDetailPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [ticket, setTicket] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState("");
    const [commenting, setCommenting] = useState(false);

    useEffect(() => {
        fetch(`/api/maintenance/tickets/${params.id}`)
            .then((res) => {
                if (!res.ok) throw new Error("Ticket not found");
                return res.json();
            })
            .then((data) => {
                setTicket(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, [params.id]);

    const handleAddComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setCommenting(true);
        try {
            const res = await fetch(`/api/maintenance/tickets/${params.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ comment: newComment }),
            });

            if (res.ok) {
                const updatedTicket = await res.json();
                setTicket(updatedTicket);
                setNewComment("");
            } else {
                alert("Failed to add comment");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setCommenting(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-slate-500">Loading ticket details...</div>;
    if (!ticket) return <div className="p-8 text-center text-red-500">Ticket not found or access denied.</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <Link href="/maintenance/tickets" className="inline-flex items-center gap-2 text-slate-500 hover:text-olive-600 transition-colors font-medium">
                <ArrowLeft size={18} /> Back to Tickets
            </Link>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                {/* Header */}
                <div className="p-8 border-b border-slate-100 flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${ticket.priority === 'Critical' ? 'bg-red-100 text-red-700' :
                                    ticket.priority === 'High' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
                                }`}>
                                {ticket.priority} Priority
                            </span>
                            <span className="text-slate-400 text-sm font-medium">#{ticket._id.slice(-6).toUpperCase()}</span>
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900 mb-1">{ticket.title}</h1>
                        <p className="text-slate-500 flex items-center gap-2">
                            <Clock size={16} /> Raised on {new Date(ticket.createdAt).toLocaleDateString()} at {new Date(ticket.createdAt).toLocaleTimeString()}
                        </p>
                    </div>
                    <div className="text-right">
                        <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Status</span>
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold uppercase ${ticket.status === 'Open' ? 'bg-blue-100 text-blue-700' :
                                ticket.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'
                            }`}>
                            {ticket.status}
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="p-8 grid grid-cols-3 gap-8">
                    <div className="col-span-2 space-y-8">
                        <div>
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">Description</h3>
                            <p className="text-slate-600 leading-relaxed bg-slate-50 p-6 rounded-xl border border-slate-100">
                                {ticket.description}
                            </p>
                        </div>

                        <div>
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <MessageSquare size={16} /> Activity & Comments
                            </h3>
                            <div className="space-y-4 mb-6">
                                {ticket.comments && ticket.comments.length > 0 ? (
                                    ticket.comments.map((comment: any, idx: number) => (
                                        <div key={idx} className="flex gap-4">
                                            <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-xs font-bold text-slate-600 shrink-0">
                                                U
                                            </div>
                                            <div className="bg-slate-50 p-4 rounded-xl rounded-tl-none border border-slate-100 flex-1">
                                                <p className="text-sm text-slate-800">{comment.text}</p>
                                                <p className="text-[10px] text-slate-400 mt-2 font-medium">{new Date(comment.date).toLocaleString()}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-slate-400 italic">No comments yet.</p>
                                )}
                            </div>

                            {/* Add Comment */}
                            <form onSubmit={handleAddComment} className="flex gap-4">
                                <input
                                    type="text"
                                    className="flex-1 p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-olive-500/20"
                                    placeholder="Add a comment or update..."
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                />
                                <button
                                    type="submit"
                                    disabled={commenting || !newComment.trim()}
                                    className="px-4 py-3 bg-olive-600 text-white rounded-xl hover:bg-olive-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Send size={18} />
                                </button>
                            </form>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="p-6 bg-slate-50 rounded-xl border border-slate-100 space-y-4">
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Category</p>
                                <p className="font-semibold text-slate-900">{ticket.category}</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Estimated Cost</p>
                                <p className="font-semibold text-slate-900">₹{ticket.estimatedCost || '0.00'}</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Attachments</p>
                                <div className="mt-2 space-y-2">
                                    {/* Placeholder for attachments if present */}
                                    <div className="flex items-center gap-2 text-sm text-slate-500 bg-white p-2 rounded border border-slate-200">
                                        <Paperclip size={14} /> No attachments
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
