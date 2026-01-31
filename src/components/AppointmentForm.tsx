"use client";

import { useState, useEffect } from "react";
import { Calendar, Clock, User as UserIcon, FileText, CheckCircle, AlertCircle } from "lucide-react";

export default function AppointmentForm({ userRole = 'patient' }: { userRole?: 'patient' | 'front-desk' }) {
    const [doctors, setDoctors] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        patientId: "", // For front-desk to input, or auto-filled for patient
        doctorId: "",
        date: "",
        time: "",
        reason: "",
        type: "consultation"
    });

    useEffect(() => {
        // Fetch doctors for dropdown
        fetch('/api/doctors')
            .then(res => res.json())
            .then(data => setDoctors(data))
            .catch(err => console.error("Failed to load doctors", err));

        // Mock: If patient, pre-fill patient ID (In real app, get from session)
        if (userRole === 'patient') {
            // We'd ideally fetch the logged-in patient's ID here. 
            // For now, we'll leave it empty or hardcode a demo ID if we had one.
        }
    }, [userRole]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess(false);

        try {
            // For demo: if patientId is empty and it's a patient, we might fail or need a mock ID
            // Let's assume the user enters a valid Mongo ID or we handle it gracefully?
            // Actually, let's just send what we have. If it fails, API will return error.

            // Correction: For demo purposes, if front-desk, they likely enter a name or ID. 
            // In a real system, we'd search for a patient first. 
            // To make this work simply: let's pick a random patient ID from the seeded data if none provided? 
            // Or better, let the user pick from a dropdown of patients?
            // Let's keep it simple: Text input for "Patient ID / MRN"

            // Wait, our API expects a Patient Mongo ID reference. 
            // If the user types an MRN string, the API might break casting to ObjectId.
            // We'll need a way to look up the patient first. 
            // For now, to ensure it works, I'll update the API to handle MRN lookup or just basic string if schema allows.
            // The seeds use specific IDs. 

            const res = await fetch('/api/appointments/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Booking failed');

            setSuccess(true);
            setFormData(prev => ({ ...prev, reason: "", date: "", time: "" })); // Reset some fields
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm max-w-2xl mx-auto">
            <div className="mb-8">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Book an Appointment</h3>
                <p className="text-slate-500 font-medium text-sm mt-2">Schedule a consultation with our specialists.</p>
            </div>

            {success && (
                <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-2xl flex items-center gap-3 border border-green-100">
                    <CheckCircle size={20} />
                    <span className="text-sm font-bold">Appointment booked successfully!</span>
                </div>
            )}

            {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-2xl flex items-center gap-3 border border-red-100">
                    <AlertCircle size={20} />
                    <span className="text-sm font-bold">{error}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">

                {/* Patient ID Field - Visible for Front Desk, technically hidden/auto for Patient */}
                <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Patient ID / Reference</label>
                    <div className="flex gap-2">
                        <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-2xl border border-slate-100 focus-within:border-olive-400 focus-within:bg-white transition-all">
                            <UserIcon size={18} className="text-slate-400" />
                            <input
                                type="text"
                                placeholder="Enter Patient MongoDB ID / MRN"
                                className="bg-transparent outline-none w-full text-sm font-bold text-slate-700 placeholder:font-medium placeholder:text-slate-400"
                                value={formData.patientId}
                                onChange={e => setFormData({ ...formData, patientId: e.target.value })}
                                required
                            />
                        </div>
                        <button type="button" className="px-4 bg-olive-50 text-olive-600 rounded-2xl font-bold text-xs uppercase tracking-wider border border-olive-100 hover:bg-olive-100 transition-colors">
                            Check Coverage
                        </button>
                    </div>
                    {/* Mock Insurance Check Result */}
                    {formData.patientId.length > 5 && (
                        <div className="mt-2 p-4 bg-slate-50 rounded-2xl border border-slate-100 animate-in fade-in slide-in-from-top-2">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-bold text-slate-500 uppercase">Coverage Status</span>
                                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-lg text-[10px] font-black uppercase flex items-center gap-1">
                                    <CheckCircle size={10} /> Active Policy
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="font-bold text-slate-700">Est. Consultation Fee</span>
                                <span className="font-black text-slate-900">₹1,500</span>
                            </div>
                            <div className="mt-2 pt-2 border-t border-slate-200 flex justify-between items-center text-xs">
                                <span className="font-bold text-olive-600">Patient Pay: ₹500</span>
                                <span className="font-bold text-slate-400">Insurance: ₹1,000</span>
                            </div>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Department / Doctor</label>
                        <div className="relative">
                            <select
                                className="w-full px-4 py-3 bg-slate-50 rounded-2xl border border-slate-100 outline-none text-sm font-bold text-slate-700 appearance-none focus:border-olive-400 focus:bg-white transition-all"
                                value={formData.doctorId}
                                onChange={e => setFormData({ ...formData, doctorId: e.target.value })}
                                required
                            >
                                <option value="">Select Specialist</option>
                                {doctors.map((doc: any) => (
                                    <option key={doc._id} value={doc._id}>
                                        Dr. {doc.firstName} {doc.lastName} ({doc.department || 'General'})
                                    </option>
                                ))}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                ▼
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Appointment Type</label>
                        <div className="relative">
                            <select
                                className="w-full px-4 py-3 bg-slate-50 rounded-2xl border border-slate-100 outline-none text-sm font-bold text-slate-700 appearance-none focus:border-olive-400 focus:bg-white transition-all"
                                value={formData.type}
                                onChange={e => setFormData({ ...formData, type: e.target.value })}
                            >
                                <option value="consultation">Consultation</option>
                                <option value="follow-up">Follow-up</option>
                                <option value="procedure">Procedure</option>
                                <option value="emergency">Emergency</option>
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                ▼
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Date</label>
                        <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-2xl border border-slate-100 focus-within:border-olive-400 focus-within:bg-white transition-all">
                            <Calendar size={18} className="text-slate-400" />
                            <input
                                type="date"
                                className="bg-transparent outline-none w-full text-sm font-bold text-slate-700"
                                value={formData.date}
                                onChange={e => setFormData({ ...formData, date: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Time</label>
                        <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-2xl border border-slate-100 focus-within:border-olive-400 focus-within:bg-white transition-all">
                            <Clock size={18} className="text-slate-400" />
                            <input
                                type="time"
                                className="bg-transparent outline-none w-full text-sm font-bold text-slate-700"
                                value={formData.time}
                                onChange={e => setFormData({ ...formData, time: e.target.value })}
                                required
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Reason for Visit</label>
                    <div className="flex items-start gap-3 px-4 py-3 bg-slate-50 rounded-2xl border border-slate-100 focus-within:border-olive-400 focus-within:bg-white transition-all">
                        <FileText size={18} className="text-slate-400 mt-1" />
                        <textarea
                            rows={3}
                            placeholder="Briefly describe your symptoms or reason..."
                            className="bg-transparent outline-none w-full text-sm font-bold text-slate-700 placeholder:font-medium placeholder:text-slate-400 resize-none"
                            value={formData.reason}
                            onChange={e => setFormData({ ...formData, reason: e.target.value })}
                            required
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-olive-700 hover:bg-olive-800 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-olive-600/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {loading ? 'Processing...' : 'Confirm Booking'}
                </button>
            </form>
        </div>
    );
}
