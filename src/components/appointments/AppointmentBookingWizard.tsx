"use client";

import { useState } from "react";
import { Search, Calendar, Clock, CreditCard, User, ChevronRight, ChevronLeft, CheckCircle, Stethoscope } from "lucide-react";

export default function AppointmentBookingWizard() {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    // Booking State
    const [selectedPatient, setSelectedPatient] = useState<any>(null);
    const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [selectedSlot, setSelectedSlot] = useState<string>("");
    const [details, setDetails] = useState({ type: "consultation", reason: "", chiefComplaint: "", notes: "" });
    const [payment, setPayment] = useState({ amount: 800, method: "upi" });
    const [successData, setSuccessData] = useState<any>(null);

    // Mock Data for UI
    const doctors = [
        { id: "65b2a0c8e4b0a1a1a1a1a1a1", name: "Dr. Amit Sharma", specialty: "Cardiology", fees: 800, exp: "15 years" },
        { id: "65b2a0c8e4b0a1a1a1a1a1a2", name: "Dr. Priya Verma", specialty: "Dermatology", fees: 700, exp: "12 years" },
        { id: "65b2a0c8e4b0a1a1a1a1a1a3", name: "Dr. Rajesh Koothrappali", specialty: "General Medicine", fees: 500, exp: "8 years" },
    ];

    const slots = [
        "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
        "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"
    ];

    // --- STEP 1: PATIENT SEARCH ---
    const [searchQuery, setSearchQuery] = useState("");
    const [patientResults, setPatientResults] = useState<any[]>([]);

    const handleSearch = async () => {
        // Mock Search - in real app, fetch from API
        // For UI demo, simulate finding a patient if query is "Rajesh" or similar
        if (!searchQuery) return;
        setLoading(true);
        try {
            // In production: const res = await fetch(\`/api/frontdesk/patients/search?q=\${searchQuery}\`);
            // Simulating delay
            setTimeout(() => {
                setPatientResults([
                    { _id: "pat_123", firstName: "Rajesh", lastName: "Kumar", mrn: "MRN-2025-000123", phone: "9876543210" },
                    { _id: "pat_456", firstName: "Anita", lastName: "Sharma", mrn: "MRN-2025-000456", phone: "9123456780" }
                ]);
                setLoading(false);
            }, 500);
        } catch (e) { setLoading(false); }
    };

    // --- STEP 5: FINAL SUBMISSION ---
    const handleBookAppointment = async () => {
        setLoading(true);
        try {
            const payload = {
                patientId: selectedPatient._id,
                doctorId: selectedDoctor.id,
                date: selectedDate,
                timeSlot: selectedSlot,
                ...details,
                payment: { ...payment, amount: selectedDoctor.fees }
            };

            const res = await fetch('/api/appointments/book', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            setSuccessData(data);
            setStep(6); // Success View
        } catch (err: any) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    // --- RENDER STEPS ---

    // Success View
    if (step === 6 && successData) {
        return (
            <div className="bg-white rounded-[32px] p-8 text-center space-y-8 animate-in zoom-in">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle size={40} />
                </div>
                <div>
                    <h2 className="text-3xl font-black text-slate-900">Appointment Booked!</h2>
                    <p className="text-slate-500">ID: <span className="font-mono font-bold">{successData.appointment.appointmentId}</span></p>
                </div>

                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-left space-y-4 shadow-inner">
                    <div className="flex justify-between border-b border-slate-200 pb-2">
                        <span className="text-slate-500 text-sm">Patient</span>
                        <span className="font-bold text-slate-900">{successData.details.patientName}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 pb-2">
                        <span className="text-slate-500 text-sm">Doctor</span>
                        <span className="font-bold text-slate-900">{successData.details.doctorName}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 pb-2">
                        <span className="text-slate-500 text-sm">Date & Time</span>
                        <span className="font-bold text-slate-900">{successData.details.date} at {successData.details.time}</span>
                    </div>
                    <div className="flex justify-between pt-2">
                        <span className="text-slate-500 text-sm">Receipt</span>
                        <span className="font-mono font-bold text-olive-600">{successData.details.receiptNo}</span>
                    </div>
                </div>

                <div className="flex gap-4">
                    <button onClick={() => window.location.reload()} className="flex-1 py-3 bg-olive-600 text-white font-bold rounded-xl hover:bg-olive-700">Book Another</button>
                    <button onClick={() => window.print()} className="flex-1 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50">Print Slip</button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden min-h-[600px] flex flex-col">
            {/* Header / Stepper */}
            <div className="bg-slate-50 p-6 border-b border-slate-100">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-black text-slate-800">New Appointment</h2>
                    <span className="px-3 py-1 bg-olive-100 text-olive-700 text-xs font-bold rounded-full">Step {step} of 5</span>
                </div>
                {/* Progress Bar */}
                <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(s => (
                        <div key={s} className={`h-1 flex-1 rounded-full transition-all ${s <= step ? 'bg-olive-500' : 'bg-slate-200'}`} />
                    ))}
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 p-8">

                {/* STEP 1: PATIENT */}
                {step === 1 && (
                    <div className="space-y-6">
                        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <User size={20} className="text-olive-500" /> Select Patient
                        </h3>
                        <div className="flex gap-2">
                            <input
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                placeholder="Search by Name, MRN, or Phone..."
                                className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-olive-500"
                            />
                            <button onClick={handleSearch} className="px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800">
                                {loading ? "..." : <Search size={20} />}
                            </button>
                        </div>

                        <div className="space-y-2">
                            {patientResults.map(p => (
                                <div key={p._id}
                                    onClick={() => setSelectedPatient(p)}
                                    className={`p-4 rounded-xl border border-slate-100 cursor-pointer flex justify-between items-center hover:bg-slate-50 ${selectedPatient?._id === p._id ? 'bg-olive-50 border-olive-500 ring-1 ring-olive-500' : ''}`}
                                >
                                    <div>
                                        <p className="font-bold text-slate-900">{p.firstName} {p.lastName}</p>
                                        <p className="text-xs text-slate-500 font-mono">{p.mrn} • {p.phone}</p>
                                    </div>
                                    {selectedPatient?._id === p._id && <CheckCircle size={20} className="text-olive-600" />}
                                </div>
                            ))}
                            {patientResults.length === 0 && !loading && (
                                <div className="text-center py-8 text-slate-400">Search results will appear here</div>
                            )}
                        </div>
                    </div>
                )}

                {/* STEP 2: DOCTOR */}
                {step === 2 && (
                    <div className="space-y-6">
                        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <Stethoscope size={20} className="text-olive-500" /> Select Doctor
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {doctors.map(doc => (
                                <div key={doc.id}
                                    onClick={() => setSelectedDoctor(doc)}
                                    className={`p-4 rounded-xl border border-slate-100 cursor-pointer hover:shadow-md transition-all ${selectedDoctor?.id === doc.id ? 'bg-olive-50 border-olive-500 ring-1 ring-olive-500' : ''}`}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-bold text-slate-900">{doc.name}</h4>
                                        <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">{doc.specialty}</span>
                                    </div>
                                    <p className="text-xs text-slate-500">Exp: {doc.exp} • Fee: ₹{doc.fees}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* STEP 3: SLOT */}
                {step === 3 && (
                    <div className="space-y-6">
                        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <Calendar size={20} className="text-olive-500" /> Select Date & Time
                        </h3>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={e => setSelectedDate(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                        />

                        <div>
                            <p className="text-xs font-bold text-slate-400 mb-3 uppercase tracking-widest">Available Slots</p>
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                {slots.map(slot => (
                                    <button key={slot}
                                        onClick={() => setSelectedSlot(slot)}
                                        className={`py-2 rounded-lg text-sm font-bold border ${selectedSlot === slot ? 'bg-olive-600 text-white border-olive-600' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                                    >
                                        {slot}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* STEP 4: DETAILS */}
                {step === 4 && (
                    <div className="space-y-6">
                        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <Clock size={20} className="text-olive-500" /> Visit Details
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">Type</label>
                                <select
                                    value={details.type}
                                    onChange={e => setDetails({ ...details, type: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                                >
                                    <option value="consultation">Consulation</option>
                                    <option value="follow-up">Follow-up</option>
                                    <option value="emergency">Emergency</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">Chief Complaint</label>
                                <input
                                    value={details.chiefComplaint}
                                    onChange={e => setDetails({ ...details, chiefComplaint: e.target.value })}
                                    placeholder="e.g. Chest pain, Fever..."
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">Notes</label>
                                <textarea
                                    value={details.notes}
                                    onChange={e => setDetails({ ...details, notes: e.target.value })}
                                    placeholder="Additional notes..."
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none h-24 resize-none"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* STEP 5: PAYMENT */}
                {step === 5 && (
                    <div className="space-y-6">
                        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <CreditCard size={20} className="text-olive-500" /> Payment
                        </h3>

                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Consultation Fee</span>
                                <span className="font-bold text-slate-900">₹{selectedDoctor?.fees}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Registration Fee</span>
                                <span className="font-bold text-slate-900">₹100</span>
                            </div>
                            <div className="flex justify-between text-lg font-black border-t border-slate-200 pt-2 mt-2">
                                <span className="text-slate-900">Total</span>
                                <span className="text-olive-600">₹{selectedDoctor?.fees + 100}</span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-2">Payment Method</label>
                            <div className="grid grid-cols-2 gap-2">
                                {['cash', 'card', 'upi', 'insurance'].map(m => (
                                    <button key={m}
                                        onClick={() => setPayment({ ...payment, method: m })}
                                        className={`py-3 rounded-xl border text-sm font-bold capitalize ${payment.method === m ? 'bg-slate-900 text-white border-slate-900' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                                    >
                                        {m}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

            </div>

            {/* Footer / Navigation */}
            <div className="p-6 border-t border-slate-100 flex justify-between bg-white">
                <button
                    onClick={() => setStep(step - 1)}
                    disabled={step === 1 || loading}
                    className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-50 disabled:opacity-50 flex items-center gap-2"
                >
                    <ChevronLeft size={18} /> Back
                </button>

                {step < 5 ? (
                    <button
                        onClick={() => setStep(step + 1)}
                        // Validation logic
                        disabled={
                            (step === 1 && !selectedPatient) ||
                            (step === 2 && !selectedDoctor) ||
                            (step === 3 && !selectedSlot)
                        }
                        className="px-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-slate-200"
                    >
                        Next <ChevronRight size={18} />
                    </button>
                ) : (
                    <button
                        onClick={handleBookAppointment}
                        disabled={loading}
                        className="px-8 py-3 bg-olive-600 text-white font-bold rounded-xl hover:bg-olive-700 disabled:opacity-50 shadow-lg shadow-olive-200 flex items-center gap-2"
                    >
                        {loading ? "Processing..." : "Confirm & Pay"}
                    </button>
                )}
            </div>
        </div>
    );
}
