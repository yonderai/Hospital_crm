"use client";
import { useState } from "react";

const LAB_TESTS = [
    "Complete Blood Count (CBC)", "Lipid Profile", "Liver Function Test (LFT)",
    "Kidney Function Test (KFT)", "Blood Sugar (Fasting)", "Blood Sugar (PP)",
    "Thyroid Profile", "Urine Routine", "X-Ray Chest PA", "MRI Brain", "CT Scan Abdomen"
];

export default function LabOrderForm({ patientId, onSuccess }: { patientId: string; onSuccess: () => void }) {
    const [loading, setLoading] = useState(false);
    const [selectedTests, setSelectedTests] = useState<string[]>([]);
    const [priority, setPriority] = useState("routine");

    const toggleTest = (test: string) => {
        if (selectedTests.includes(test)) {
            setSelectedTests(selectedTests.filter(t => t !== test));
        } else {
            setSelectedTests([...selectedTests, test]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedTests.length === 0) return alert("Select at least one test");

        setLoading(true);
        try {
            const res = await fetch("/api/doctor/lab-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    patientId,
                    tests: selectedTests,
                    priority
                })
            });
            if (res.ok) {
                alert("Lab Order sent!");
                setSelectedTests([]);
                onSuccess();
            } else {
                alert("Error saving lab order");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 p-4 bg-white rounded-lg shadow border border-olive-200">
            <h3 className="text-xl font-bold text-olive-800">Lab & Radiology Orders</h3>

            <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">Select Tests</label>
                <div className="grid grid-cols-2 gap-2">
                    {LAB_TESTS.map(test => (
                        <label key={test} className="flex items-center space-x-2 p-2 border rounded hover:bg-gray-50 cursor-pointer">
                            <input type="checkbox" checked={selectedTests.includes(test)} onChange={() => toggleTest(test)}
                                className="rounded text-olive-600 focus:ring-olive-500" />
                            <span className="text-sm">{test}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Priority</label>
                <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-olive-500 focus:ring-olive-500"
                    value={priority} onChange={e => setPriority(e.target.value)}>
                    <option value="routine">Routine</option>
                    <option value="urgent">Urgent</option>
                    <option value="stat">STAT (Immediate)</option>
                </select>
            </div>

            <div className="flex justify-end">
                <button type="submit" disabled={loading} className="px-4 py-2 bg-olive-600 text-white rounded hover:bg-olive-700 disabled:opacity-50">
                    {loading ? "Ordering..." : "Order Tests"}
                </button>
            </div>
        </form>
    );
}
