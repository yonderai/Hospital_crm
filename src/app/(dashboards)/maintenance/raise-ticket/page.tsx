"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, Save, AlertCircle } from "lucide-react";

export default function RaiseTicketPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "Other",
        priority: "Low",
        estimatedCost: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/maintenance/tickets", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                router.push("/maintenance/tickets");
            } else {
                alert("Failed to raise ticket");
            }
        } catch (error) {
            console.error(error);
            alert("Error submitting form");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-slate-900">Raise New Ticket</h1>

            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Category</label>
                        <select
                            name="category"
                            className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-olive-500/20"
                            value={formData.category}
                            onChange={handleChange}
                        >
                            <option value="Elevator">Elevator Issues</option>
                            <option value="Plumbing">Plumbing Problems</option>
                            <option value="Electrical">Electrical Faults</option>
                            <option value="Equipment">Equipment Repair</option>
                            <option value="Furniture">Furniture Repair</option>
                            <option value="HVAC">HVAC / Air Conditioning</option>
                            <option value="Other">Miscellaneous</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Priority</label>
                        <select
                            name="priority"
                            className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-olive-500/20"
                            value={formData.priority}
                            onChange={handleChange}
                        >
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                            <option value="Critical">Critical</option>
                        </select>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Issue Title</label>
                    <input
                        type="text"
                        name="title"
                        required
                        className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-olive-500/20"
                        placeholder="e.g., Main Corridor Light Flicker"
                        value={formData.title}
                        onChange={handleChange}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Detailed Description</label>
                    <textarea
                        name="description"
                        required
                        rows={4}
                        className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-olive-500/20"
                        placeholder="Describe the issue in detail..."
                        value={formData.description}
                        onChange={handleChange}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Estimated Cost (Optional)</label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                        <input
                            type="number"
                            name="estimatedCost"
                            className="w-full pl-8 p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-olive-500/20"
                            placeholder="0.00"
                            value={formData.estimatedCost}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Attachments</label>
                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center text-slate-400 hover:bg-slate-50 transition-colors cursor-pointer">
                        <Upload size={24} className="mb-2" />
                        <span className="text-sm">Click to upload photos or documents</span>
                    </div>
                    <p className="text-xs text-slate-400">Supported formats: JPG, PNG, PDF</p>
                </div>

                <div className="pt-4 flex items-center justify-end gap-4">
                    <button type="button" onClick={() => router.back()} className="px-6 py-3 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-colors">Cancel</button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-3 bg-olive-600 text-white font-bold rounded-xl hover:bg-olive-700 transition-colors flex items-center gap-2 shadow-lg shadow-olive-600/20"
                    >
                        {loading ? "Submitting..." : <><Save size={18} /> Raise Ticket</>}
                    </button>
                </div>
            </form>
        </div>
    );
}
