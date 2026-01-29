"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, Save, AlertCircle, X, Loader2 } from "lucide-react";
import Image from "next/image";
import DashboardLayout from "@/components/DashboardLayout";

export default function RaiseTicketPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "Other",
        priority: "Low",
        estimatedCost: "",
        images: [] as string[],
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;

        setUploading(true);
        const file = e.target.files[0];

        // Simple Base64 conversion
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const base64 = reader.result as string;
            setFormData(prev => ({ ...prev, images: [...prev.images, base64] }));
            setUploading(false);
        };
        reader.onerror = (error) => {
            console.error("Error converting file:", error);
            alert("Failed to process attachment");
            setUploading(false);
        };
    };

    const removeAttachment = (indexToRemove: number) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== indexToRemove)
        }));
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
        <DashboardLayout>
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

                        {/* File List */}
                        {formData.images.length > 0 && (
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                {formData.images.map((url, idx) => (
                                    <div key={idx} className="relative group border border-slate-200 rounded-lg p-2 bg-slate-50 flex items-center gap-2">
                                        <div className="w-10 h-10 bg-slate-200 rounded flex-shrink-0 overflow-hidden relative">
                                            {url.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                                                <Image src={url} alt="Attachment" fill className="object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-xs font-bold text-slate-500">FILE</div>
                                            )}
                                        </div>
                                        <span className="text-xs text-slate-600 truncate flex-1">{url.split('/').pop()}</span>
                                        <button
                                            type="button"
                                            onClick={() => removeAttachment(idx)}
                                            className="p-1 hover:bg-red-100 text-slate-400 hover:text-red-500 rounded-full transition-colors"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Upload Area */}
                        <div className="relative border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center text-slate-400 hover:bg-slate-50 transition-colors cursor-pointer group">
                            <input
                                type="file"
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                onChange={handleFileUpload}
                                accept="image/*,video/*,application/pdf"
                                disabled={uploading}
                            />
                            {uploading ? (
                                <Loader2 size={24} className="animate-spin text-olive-600 mb-2" />
                            ) : (
                                <Upload size={24} className="mb-2 group-hover:text-olive-600 transition-colors" />
                            )}
                            <span className="text-sm group-hover:text-olive-600 transition-colors">
                                {uploading ? "Uploading..." : "Click to upload photos or documents"}
                            </span>
                        </div>
                        <p className="text-xs text-slate-400">Supported formats: JPG, PNG, PDF, MP4</p>
                    </div>

                    <div className="pt-4 flex items-center justify-end gap-4">
                        <button type="button" onClick={() => router.back()} className="px-6 py-3 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-colors">Cancel</button>
                        <button
                            type="submit"
                            disabled={loading || uploading}
                            className="px-6 py-3 bg-olive-600 text-white font-bold rounded-xl hover:bg-olive-700 transition-colors flex items-center gap-2 shadow-lg shadow-olive-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Submitting..." : <><Save size={18} /> Raise Ticket</>}
                        </button>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
}
