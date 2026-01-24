"use client";

import { useEffect, useState } from "react";
import {
    TestTube2,
    QrCode,
    Search,
    Plus,
    ArrowRight
} from "lucide-react";

interface Sample {
    _id: string;
    sampleId: string;
    patientId: { firstName: string; lastName: string };
    orderId: { orderId: string; tests: string[] };
    testTypes: string[];
    collectedBy: { firstName: string; lastName: string };
    collectedAt: string;
    status: string;
}

export default function SampleTracking() {
    const [samples, setSamples] = useState<Sample[]>([]);
    const [loading, setLoading] = useState(true);

    // Mock functionality for creating new sample
    // In a real app, this would open a modal to select an order to collect sample for.
    // For now, I'll allow creating a dummy sample for the first available order if needed, but primarily list samples.

    useEffect(() => {
        fetchSamples();
    }, []);

    const fetchSamples = async () => {
        try {
            const res = await fetch("/api/pathology/samples");
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

    const updateStatus = async (sampleId: string, newStatus: string) => {
        try {
            const res = await fetch("/api/pathology/samples", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    sampleId,
                    status: newStatus,
                    processedAt: newStatus === "PROCESSING" ? new Date() : undefined
                })
            });

            if (res.ok) {
                fetchSamples();
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Sample Tracking</h1>
                    <p className="text-slate-500 font-medium mt-1">Monitor sample lifecycle from collection to processing.</p>
                </div>
                <button
                    disabled
                    className="flex items-center gap-2 px-5 py-3 bg-olive-600 text-white rounded-xl font-bold text-sm uppercase tracking-wider hover:bg-olive-700 transition-colors shadow-lg shadow-olive-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Plus size={18} />
                    New Collection
                </button>
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center gap-4">
                    <div className="flex items-center gap-4 bg-slate-50 px-4 py-2 rounded-xl w-96">
                        <Search size={18} className="text-slate-400" />
                        <input
                            type="text"
                            placeholder="Scan Barcode or Search Sample ID..."
                            className="bg-transparent border-none outline-none text-sm font-medium w-full"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                            <tr>
                                <th className="px-6 py-4">Sample ID</th>
                                <th className="px-6 py-4">Patient</th>
                                <th className="px-6 py-4">Tests</th>
                                <th className="px-6 py-4">Collected By</th>
                                <th className="px-6 py-4">Collected At</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr><td colSpan={7} className="p-8 text-center text-slate-400">Loading samples...</td></tr>
                            ) : samples.length === 0 ? (
                                <tr><td colSpan={7} className="p-8 text-center text-slate-400">No samples found.</td></tr>
                            ) : (
                                samples.map((sample) => (
                                    <tr key={sample._id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4 font-bold text-slate-700 font-mono flex items-center gap-2">
                                            <QrCode size={16} className="text-slate-400" />
                                            {sample.sampleId}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-slate-900">{sample.patientId?.firstName} {sample.patientId?.lastName}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-1">
                                                {sample.testTypes.map(t => (
                                                    <span key={t} className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded-md">
                                                        {t}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">
                                            {sample.collectedBy?.firstName} {sample.collectedBy?.lastName}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-500">
                                            {new Date(sample.collectedAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${sample.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-600' :
                                                    sample.status === 'PROCESSING' ? 'bg-purple-50 text-purple-600' :
                                                        sample.status === 'IN_LAB' ? 'bg-blue-50 text-blue-600' :
                                                            'bg-amber-50 text-amber-600'
                                                }`}>
                                                {sample.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {sample.status === 'COLLECTED' && (
                                                <button
                                                    onClick={() => updateStatus(sample._id, "IN_LAB")}
                                                    className="flex items-center gap-1 text-[10px] font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors uppercase tracking-wider"
                                                >
                                                    Receive in Lab <ArrowRight size={12} />
                                                </button>
                                            )}
                                            {sample.status === 'IN_LAB' && (
                                                <button
                                                    onClick={() => updateStatus(sample._id, "PROCESSING")}
                                                    className="flex items-center gap-1 text-[10px] font-bold text-purple-600 bg-purple-50 px-3 py-1.5 rounded-lg hover:bg-purple-100 transition-colors uppercase tracking-wider"
                                                >
                                                    Start Processing <ArrowRight size={12} />
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
