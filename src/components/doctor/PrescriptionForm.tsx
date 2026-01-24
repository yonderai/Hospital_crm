"use client";
import { useState } from "react";
import { Plus, Trash } from "lucide-react";

export default function PrescriptionForm({ patientId, onSuccess }: { patientId: string; onSuccess: () => void }) {
    const [loading, setLoading] = useState(false);
    const [meds, setMeds] = useState([
        { drugName: "", dosage: "", frequency: "1-0-1", route: "Oral", duration: "5 days", quantity: 10, instructions: "" }
    ]);

    const addMed = () => {
        setMeds([...meds, { drugName: "", dosage: "", frequency: "1-0-1", route: "Oral", duration: "5 days", quantity: 10, instructions: "" }]);
    };

    const removeMed = (index: number) => {
        setMeds(meds.filter((_, i) => i !== index));
    };

    const updateMed = (index: number, field: string, value: any) => {
        const newMeds = [...meds];
        (newMeds[index] as any)[field] = value;
        setMeds(newMeds);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch("/api/doctor/prescription", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    patientId,
                    medications: meds
                })
            });
            if (res.ok) {
                alert("Prescription sent to Pharmacy & Billing!");
                setMeds([{ drugName: "", dosage: "", frequency: "1-0-1", route: "Oral", duration: "5 days", quantity: 10, instructions: "" }]);
                onSuccess();
            } else {
                alert("Error saving prescription");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 p-4 bg-white rounded-lg shadow border border-olive-200">
            <h3 className="text-xl font-bold text-olive-800">e-Prescription</h3>

            {meds.map((med, index) => (
                <div key={index} className="grid grid-cols-7 gap-2 items-end border-b border-gray-100 pb-2">
                    <div className="col-span-2">
                        <label className="text-xs font-semibold text-gray-500">Medicine</label>
                        <input required className="w-full text-sm border-gray-300 rounded" placeholder="Drug Name"
                            value={med.drugName} onChange={e => updateMed(index, 'drugName', e.target.value)} />
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-gray-500">Dosage</label>
                        <input required className="w-full text-sm border-gray-300 rounded" placeholder="500mg"
                            value={med.dosage} onChange={e => updateMed(index, 'dosage', e.target.value)} />
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-gray-500">Freq.</label>
                        <select className="w-full text-sm border-gray-300 rounded"
                            value={med.frequency} onChange={e => updateMed(index, 'frequency', e.target.value)}>
                            <option>1-0-1</option>
                            <option>1-1-1</option>
                            <option>1-0-0</option>
                            <option>0-0-1</option>
                            <option>SOS</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-gray-500">Duration</label>
                        <input required className="w-full text-sm border-gray-300 rounded" placeholder="5 days"
                            value={med.duration} onChange={e => updateMed(index, 'duration', e.target.value)} />
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-gray-500">Qty</label>
                        <input type="number" required className="w-full text-sm border-gray-300 rounded"
                            value={med.quantity} onChange={e => updateMed(index, 'quantity', parseInt(e.target.value))} />
                    </div>
                    <div>
                        <button type="button" onClick={() => removeMed(index)} className="text-red-500 hover:text-red-700 p-2">
                            <Trash size={16} />
                        </button>
                    </div>
                </div>
            ))}

            <div className="flex justify-between">
                <button type="button" onClick={addMed} className="flex items-center text-sm text-olive-600 hover:text-olive-800">
                    <Plus size={16} className="mr-1" /> Add Medicine
                </button>
                <button type="submit" disabled={loading} className="px-4 py-2 bg-olive-600 text-white rounded hover:bg-olive-700 disabled:opacity-50">
                    {loading ? "Sending..." : "Send to Pharmacy"}
                </button>
            </div>
        </form>
    );
}
