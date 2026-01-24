"use client";

import { useEffect, useState } from "react";
import {
    Microscope,
    Play,
    CheckCircle2,
    MoreHorizontal,
    FileText
} from "lucide-react";

interface Sample {
    _id: string;
    sampleId: string;
    patientId: { firstName: string; lastName: string };
    orderId: { orderId: string; tests: string[] };
    processedAt: string;
    notes?: string;
}

export default function ProcessingStatus() {
    const [samples, setSamples] = useState<Sample[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedSample, setSelectedSample] = useState<Sample | null>(null);
    const [stage, setStage] = useState("Analysis");
    const [notes, setNotes] = useState("");

    useEffect(() => {
        fetchProcessingSamples();
    }, []);

    const fetchProcessingSamples = async () => {
        try {
            const res = await fetch("/api/pathology/processing");
            if (res.ok) {
                const data = await res.json();
                setSamples(data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async () => {
        if (!selectedSample) return;

        try {
            const res = await fetch("/api/pathology/processing", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    sampleId: selectedSample._id,
                    stage,
                    notes
                })
            });

            if (res.ok) {
                fetchProcessingSamples();
                setSelectedSample(null);
                setNotes("");
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Processing Status</h1>
                <p className="text-slate-500 font-medium mt-1">Track and update ongoing analysis.</p>
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                            <tr>
                                <th className="px-6 py-4">Sample ID</th>
                                <th className="px-6 py-4">Patient</th>
                                <th className="px-6 py-4">Tests</th>
                                <th className="px-6 py-4">Started At</th>
                                <th className="px-6 py-4">Latest Notes</th>
                                <th className="px-6 py-4">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr><td colSpan={6} className="p-8 text-center text-slate-400">Loading active processing...</td></tr>
                            ) : samples.length === 0 ? (
                                <tr><td colSpan={6} className="p-8 text-center text-slate-400">No samples in processing.</td></tr>
                            ) : (
                                samples.map((sample) => (
                                    <tr key={sample._id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4 font-bold text-slate-700 font-mono">
                                            {sample.sampleId}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-slate-900">{sample.patientId?.firstName} {sample.patientId?.lastName}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-1">
                                                {sample.orderId?.tests.map(t => (
                                                    <span key={t} className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded-md">
                                                        {t}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-500">
                                            {new Date(sample.processedAt).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-xs text-slate-500 max-w-xs truncate">
                                            {sample.notes || "-"}
                                        </td>
                                        <td className="px-6 py-4">
                                            {selectedSample?._id === sample._id ? (
                                                <div className="flex flex-col gap-2 p-2 bg-slate-50 rounded-xl border border-slate-100 animate-in fade-in zoom-in duration-200">
                                                    <select
                                                        className="p-1.5 text-xs rounded-lg border border-slate-200 outline-none"
                                                        value={stage}
                                                        onChange={(e) => setStage(e.target.value)}
                                                    >
                                                        <option>Analysis</option>
                                                        <option>Review</option>
                                                        <option>Verification</option>
                                                    </select>
                                                    <input
                                                        className="p-1.5 text-xs rounded-lg border border-slate-200 outline-none"
                                                        placeholder="Add remarks..."
                                                        value={notes}
                                                        onChange={(e) => setNotes(e.target.value)}
                                                    />
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={handleUpdate}
                                                            className="flex-1 py-1 bg-slate-900 text-white text-[10px] font-bold rounded-lg uppercase tracking-wider hover:bg-slate-800"
                                                        >
                                                            Update
                                                        </button>
                                                        <button
                                                            onClick={() => setSelectedSample(null)}
                                                            className="px-2 py-1 bg-slate-200 text-slate-600 text-[10px] font-bold rounded-lg uppercase tracking-wider hover:bg-slate-300"
                                                        >
                                                            X
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => setSelectedSample(sample)}
                                                    className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-50 hover:border-slate-300 transition-all"
                                                >
                                                    <Play size={12} className="text-olive-500" />
                                                    Log Update
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
