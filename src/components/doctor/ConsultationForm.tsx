"use client";
import { useState } from "react";

export default function ConsultationForm({ patientId, onSuccess }: { patientId: string; onSuccess: () => void }) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        chiefComplaint: "",
        vitals: { temp: "", bp: "", hr: "", rr: "", spo2: "" },
        soap: { subjective: "", objective: "", assessment: "", plan: "" },
        diagnosis: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch("/api/doctor/consultation", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    patientId,
                    type: "outpatient",
                    chiefComplaint: formData.chiefComplaint,
                    vitals: {
                        temperature: parseFloat(formData.vitals.temp),
                        bloodPressure: formData.vitals.bp,
                        heartRate: parseInt(formData.vitals.hr),
                        respiratoryRate: parseInt(formData.vitals.rr),
                        oxygenSaturation: parseInt(formData.vitals.spo2)
                    },
                    soapNotes: formData.soap,
                    diagnosis: formData.diagnosis.split(",").map(d => d.trim()),
                    status: "closed"
                })
            });
            if (res.ok) {
                alert("Consultation saved & Billing triggered!");
                onSuccess();
            } else {
                alert("Error saving consultation");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 p-4 bg-white rounded-lg shadow border border-olive-200">
            <h3 className="text-xl font-bold text-olive-800">Clinical Consultation (SOAP)</h3>

            {/* Vitals */}
            <div className="grid grid-cols-5 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Temp (°C)</label>
                    <input type="number" step="0.1" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-olive-500 focus:ring-olive-500"
                        value={formData.vitals.temp} onChange={e => setFormData({ ...formData, vitals: { ...formData.vitals, temp: e.target.value } })} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">BP (mmHg)</label>
                    <input type="text" placeholder="120/80" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-olive-500 focus:ring-olive-500"
                        value={formData.vitals.bp} onChange={e => setFormData({ ...formData, vitals: { ...formData.vitals, bp: e.target.value } })} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">HR (bpm)</label>
                    <input type="number" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-olive-500 focus:ring-olive-500"
                        value={formData.vitals.hr} onChange={e => setFormData({ ...formData, vitals: { ...formData.vitals, hr: e.target.value } })} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">RR (/min)</label>
                    <input type="number" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-olive-500 focus:ring-olive-500"
                        value={formData.vitals.rr} onChange={e => setFormData({ ...formData, vitals: { ...formData.vitals, rr: e.target.value } })} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">SpO2 (%)</label>
                    <input type="number" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-olive-500 focus:ring-olive-500"
                        value={formData.vitals.spo2} onChange={e => setFormData({ ...formData, vitals: { ...formData.vitals, spo2: e.target.value } })} />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Chief Complaint</label>
                <input type="text" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-olive-500 focus:ring-olive-500"
                    value={formData.chiefComplaint} onChange={e => setFormData({ ...formData, chiefComplaint: e.target.value })} />
            </div>

            {/* SOAP */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Subjective</label>
                    <textarea rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-olive-500 focus:ring-olive-500"
                        value={formData.soap.subjective} onChange={e => setFormData({ ...formData, soap: { ...formData.soap, subjective: e.target.value } })} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Objective</label>
                    <textarea rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-olive-500 focus:ring-olive-500"
                        value={formData.soap.objective} onChange={e => setFormData({ ...formData, soap: { ...formData.soap, objective: e.target.value } })} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Assessment</label>
                    <textarea rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-olive-500 focus:ring-olive-500"
                        value={formData.soap.assessment} onChange={e => setFormData({ ...formData, soap: { ...formData.soap, assessment: e.target.value } })} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Plan</label>
                    <textarea rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-olive-500 focus:ring-olive-500"
                        value={formData.soap.plan} onChange={e => setFormData({ ...formData, soap: { ...formData.soap, plan: e.target.value } })} />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Diagnosis (comma separated)</label>
                <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-olive-500 focus:ring-olive-500"
                    value={formData.diagnosis} onChange={e => setFormData({ ...formData, diagnosis: e.target.value })} />
            </div>

            <div className="flex justify-end">
                <button type="submit" disabled={loading} className="px-4 py-2 bg-olive-600 text-white rounded hover:bg-olive-700 disabled:opacity-50">
                    {loading ? "Saving..." : "Save Consultation"}
                </button>
            </div>
        </form>
    );
}
