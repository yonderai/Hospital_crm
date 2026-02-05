
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
    Calendar,
    Clock,
    User,
    FileText,
    CheckCircle,
    AlertCircle
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function BookingPage() {
    const { data: session } = useSession();
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    // Form State
    const [formData, setFormData] = useState({
        providerId: "",
        date: "",
        time: "",
        type: "consultation",
        reason: ""
    });

    const [doctors, setDoctors] = useState<any[]>([]);

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const res = await fetch("/api/doctors");
                if (res.ok) {
                    const data = await res.json();
                    setDoctors(data);
                }
            } catch (err) {
                console.error("Failed to fetch doctors", err);
            }
        };
        fetchDoctors();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess(false);

        try {
            if (!formData.providerId) {
                throw new Error("Please select a doctor");
            }

            // Combine date and time
            const startTime = new Date(`${formData.date}T${formData.time}`);

            const res = await fetch("/api/appointments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    providerId: formData.providerId,
                    startTime: startTime.toISOString(),
                    type: formData.type,
                    reason: formData.reason
                })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Booking failed");

            setSuccess(true);
            setTimeout(() => {
                router.push("/patient/dashboard");
            }, 2000);

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-8">
            <div className="bg-white rounded-2xl border border-olive-200 shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-olive-600 to-olive-500 px-6 py-4 flex items-center gap-3">
                    <Calendar className="text-white" size={24} />
                    <h1 className="text-xl font-bold text-white">Book an Appointment</h1>
                </div>

                <div className="p-8">
                    {success ? (
                        <div className="flex flex-col items-center justify-center text-center py-8">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                <CheckCircle className="text-green-600" size={32} />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-2">Booking Confirmed!</h2>
                            <p className="text-slate-500">Your appointment has been scheduled successfully.</p>
                            <p className="text-sm text-slate-400 mt-4">Redirecting to dashboard...</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 text-red-600">
                                    <AlertCircle size={20} />
                                    <span className="text-sm font-medium">{error}</span>
                                </div>
                            )}

                            {/* Doctor Selection */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                    <User size={16} /> Select Provider
                                </label>
                                <select
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-olive-500 transition-all font-medium text-slate-700"
                                    value={formData.providerId}
                                    onChange={(e) => setFormData({ ...formData, providerId: e.target.value })}
                                    required
                                >
                                    <option value="">-- Choose a Doctor --</option>
                                    {doctors.map((doctor) => (
                                        <option key={doctor._id} value={doctor._id}>
                                            Dr. {doctor.firstName} {doctor.lastName} ({doctor.department || "General"})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                {/* Date */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                        <Calendar size={16} /> Date
                                    </label>
                                    <input
                                        type="date"
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-olive-500 transition-all font-medium text-slate-700"
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                        required
                                        min={new Date().toISOString().split('T')[0]}
                                    />
                                </div>

                                {/* Time */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                        <Clock size={16} /> Time
                                    </label>
                                    <input
                                        type="time"
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-olive-500 transition-all font-medium text-slate-700"
                                        value={formData.time}
                                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Type */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                    Appointment Type
                                </label>
                                <div className="grid grid-cols-4 gap-2">
                                    {['consultation', 'follow-up', 'procedure', 'emergency'].map((type) => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, type })}
                                            className={`px-3 py-2 text-xs font-bold rounded-lg border uppercase tracking-wider transition-all ${formData.type === type
                                                ? 'bg-olive-600 text-white border-olive-600'
                                                : 'bg-white text-slate-500 border-slate-200 hover:border-olive-300'
                                                }`}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Reason */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                    <FileText size={16} /> Reason for Visit
                                </label>
                                <textarea
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-olive-500 transition-all font-medium text-slate-700 min-h-[100px]"
                                    placeholder="Please describe your symptoms or reason for appointment..."
                                    value={formData.reason}
                                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-4 bg-olive-600 hover:bg-olive-700 text-white font-bold rounded-xl shadow-lg shadow-olive-600/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <span>Processing...</span>
                                    ) : (
                                        <>Confirm Booking</>
                                    )}
                                </button>
                            </div>

                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
