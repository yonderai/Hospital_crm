"use client";
import { useState } from "react";

const IMAGING_TYPES = [
    { type: "X-Ray", parts: ["Chest", "Abdomen", "Spine", "Knee", "Shoulder"] },
    { type: "CT Scan", parts: ["Head", "Abdomen", "Pelvis", "Chest"] },
    { type: "MRI", parts: ["Brain", "Spine", "Knee", "Shoulder"] },
    { type: "Ultrasound", parts: ["Abdomen", "Pelvis", "Thyroid"] }
];

export default function RadiologyOrderForm({ patientId, appointmentId, encounterId, onSuccess }: { patientId: string; appointmentId?: string; encounterId?: string; onSuccess: () => void }) {
    const [loading, setLoading] = useState(false);
    const [selectedType, setSelectedType] = useState(IMAGING_TYPES[0].type);
    const [selectedPart, setSelectedPart] = useState(IMAGING_TYPES[0].parts[0]);
    const [priority, setPriority] = useState("routine");
    const [reason, setReason] = useState("");

    const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newType = e.target.value;
        setSelectedType(newType);
        setSelectedPart(IMAGING_TYPES.find(t => t.type === newType)?.parts[0] || "");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch("/api/doctor/radiology-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    patientId,
                    appointmentId,
                    encounterId,
                    imagingType: selectedType,
                    bodyPart: selectedPart,
                    priority,
                    reasonForStudy: reason
                })
            });
            if (res.ok) {
                alert("Radiology Order Sent!");
                setReason("");
                onSuccess();
            } else {
                alert("Error saving radiology order");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 p-4 bg-white rounded-lg shadow border border-blue-100">
            <h3 className="text-xl font-bold text-blue-800">Radiology Referral</h3>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Modality</label>
                    <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        value={selectedType} onChange={handleTypeChange}>
                        {IMAGING_TYPES.map(t => <option key={t.type} value={t.type}>{t.type}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Body Part</label>
                    <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        value={selectedPart} onChange={e => setSelectedPart(e.target.value)}>
                        {IMAGING_TYPES.find(t => t.type === selectedType)?.parts.map(p => (
                            <option key={p} value={p}>{p}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Reason for Severity / Clinical History</label>
                <textarea required rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={reason} onChange={e => setReason(e.target.value)} />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Priority</label>
                <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={priority} onChange={e => setPriority(e.target.value)}>
                    <option value="routine">Routine</option>
                    <option value="urgent">Urgent</option>
                    <option value="stat">STAT (Immediate)</option>
                </select>
            </div>

            <div className="flex justify-end">
                <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
                    {loading ? "Ordering..." : "Order Imaging"}
                </button>
            </div>
        </form>
    );
}
