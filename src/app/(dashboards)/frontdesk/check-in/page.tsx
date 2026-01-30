"use client";

import { useState } from "react";
import {
    QrCode,
    Search,
    CheckCircle2,
    Calendar,
    User,
    ArrowRight,
    Loader2
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function CheckInPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // State
    const [scanMode, setScanMode] = useState(true);
    const [identifier, setIdentifier] = useState(searchParams.get("mrn") || "");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [scanResult, setScanResult] = useState<any>(null);
    const [checkInSuccess, setCheckInSuccess] = useState<any>(null);

    // Handlers
    const handleScan = async (mockQrData?: string) => {
        setLoading(true);
        setError("");
        setScanResult(null);
        setCheckInSuccess(null);

        const data = mockQrData || identifier;

        try {
            const res = await fetch("/api/qr/scan", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(mockQrData ? { qrCode: mockQrData } : { mrn: identifier })
            });
            const result = await res.json();

            if (result.error) {
                setError(result.error);
            } else {
                setScanResult(result);
            }
        } catch (err) {
            setError("Failed to process scan. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleCheckIn = async () => {
        if (!scanResult?.appointment?.id) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/appointments/${scanResult.appointment.id}/check-in`, {
                method: "POST"
            });
            const data = await res.json();

            if (data.error) {
                setError(data.error);
            } else {
                setCheckInSuccess({
                    token: data.token,
                    room: "205" // Mock logic for room allocation
                });
                setScanResult(null); // Clear scan result to show success screen
            }
        } catch (err) {
            setError("Check-in failed.");
        } finally {
            setLoading(false);
        }
    };

    // --- RENDER SUCCESS ---
    if (checkInSuccess) {
        return (
            <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-3xl border border-slate-200 shadow-xl text-center">
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 size={40} className="animate-bounce" />
                </div>
                <h1 className="text-2xl font-black text-slate-900">Check-in Successful</h1>
                <p className="text-slate-500 font-medium mb-8">Patient has been marked as present.</p>

                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 mb-8">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Token Number</p>
                    <p className="text-5xl font-black text-slate-900">{checkInSuccess.token}</p>
                    <div className="mt-4 pt-4 border-t border-slate-200">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Proceed To</p>
                        <p className="text-lg font-bold text-slate-700">Room {checkInSuccess.room}, 2nd Floor</p>
                    </div>
                </div>

                <div className="space-y-3">
                    <button onClick={() => window.print()} className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors">
                        Print Token Slip
                    </button>
                    <button onClick={() => { setCheckInSuccess(null); setIdentifier(""); }} className="w-full py-3 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-colors">
                        Check-in Another Patient
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div>
                <Link href="/frontdesk/dashboard" className="text-sm font-bold text-slate-500 hover:text-slate-900 mb-4 inline-block">
                    &larr; Back to Dashboard
                </Link>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                    <QrCode size={32} className="text-olive-600" />
                    Patient Check-in
                </h1>
                <p className="text-slate-500 font-medium mt-1">Scan QR code or enter MRN manually.</p>
            </div>

            {/* --- SCANNER CARD --- */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                {/* Tabs */}
                <div className="flex border-b border-slate-100">
                    <button
                        onClick={() => setScanMode(true)}
                        className={`flex-1 py-4 text-sm font-bold transition-all ${scanMode ? 'bg-olive-50 text-olive-700 border-b-2 border-olive-600' : 'text-slate-400 hover:bg-slate-50'}`}
                    >
                        Scan QR Code
                    </button>
                    <button
                        onClick={() => setScanMode(false)}
                        className={`flex-1 py-4 text-sm font-bold transition-all ${!scanMode ? 'bg-olive-50 text-olive-700 border-b-2 border-olive-600' : 'text-slate-400 hover:bg-slate-50'}`}
                    >
                        Manual Entry
                    </button>
                </div>

                <div className="p-8">
                    {scanMode ? (
                        <div className="text-center space-y-6">
                            <div className="w-64 h-64 bg-slate-900 rounded-3xl mx-auto flex items-center justify-center relative overflow-hidden group border-4 border-slate-200">
                                {/* Simulated Camera View */}
                                <div className="absolute inset-0 opacity-50 bg-[url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=2070&ixlib=rb-4.0.3')] bg-cover bg-center grayscale mix-blend-overlay"></div>
                                <QrCode size={64} className="text-white/20" />
                                <div className="absolute inset-0 border-2 border-white/50 m-8 rounded-xl flex items-center justify-center">
                                    <div className="w-full h-0.5 bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)] animate-[scan_2s_ease-in-out_infinite]"></div>
                                </div>
                            </div>
                            <p className="text-sm font-bold text-slate-500">Point camera at patient's QR code</p>

                            {/* SIMULATION BUTTON */}
                            <button
                                onClick={() => handleScan("MRN-2025-000123")}
                                disabled={loading}
                                className="px-6 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-200 transition-colors"
                            >
                                {loading ? "Scanning..." : "[DEV] Simulate Scan"}
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <label className="block text-sm font-bold text-slate-700">Enter MRN or Appointment ID</label>
                            <div className="flex gap-2">
                                <input
                                    value={identifier}
                                    onChange={(e) => setIdentifier(e.target.value)}
                                    placeholder="e.g. MRN-2026-XXXXXX"
                                    className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold outline-none focus:ring-2 focus:ring-olive-500/20"
                                />
                                <button
                                    onClick={() => handleScan()}
                                    disabled={loading || !identifier}
                                    className="px-6 bg-olive-600 hover:bg-olive-700 disabled:opacity-50 text-white rounded-xl font-bold transition-colors"
                                >
                                    {loading ? <Loader2 className="animate-spin" /> : <Search />}
                                </button>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="mt-6 p-4 bg-red-50 text-red-600 text-sm font-bold rounded-xl border border-red-100 text-center">
                            {error}
                        </div>
                    )}
                </div>
            </div>

            {/* --- RESULT CARD --- */}
            {scanResult && (
                <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="p-6 bg-olive-50 border-b border-olive-100 flex items-center gap-4">
                        <div className="w-12 h-12 bg-white text-olive-600 rounded-xl flex items-center justify-center font-black text-xl shadow-sm">
                            <CheckCircle2 size={24} />
                        </div>
                        <div>
                            <h2 className="text-lg font-black text-slate-900">Patient Identified</h2>
                            <p className="text-sm font-bold text-olive-700">Ready for Check-in</p>
                        </div>
                    </div>

                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Patient Details</p>
                            <div className="space-y-3">
                                <div className="bg-slate-50 p-3 rounded-xl">
                                    <p className="text-xs font-bold text-slate-400">Name</p>
                                    <p className="font-bold text-slate-900 text-lg">{scanResult.patient.name}</p>
                                </div>
                                <div className="bg-slate-50 p-3 rounded-xl">
                                    <p className="text-xs font-bold text-slate-400">MRN</p>
                                    <p className="font-bold text-slate-900">{scanResult.patient.mrn}</p>
                                </div>
                                <div className="bg-slate-50 p-3 rounded-xl">
                                    <p className="text-xs font-bold text-slate-400">Phone</p>
                                    <p className="font-bold text-slate-900">{scanResult.patient.phone}</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Today's Appointment</p>
                            {scanResult.appointment ? (
                                <div className="space-y-3">
                                    <div className="bg-blue-50 p-3 rounded-xl border border-blue-100">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Calendar size={14} className="text-blue-500" />
                                            <p className="text-xs font-bold text-blue-500 uppercase">Time</p>
                                        </div>
                                        <p className="font-black text-blue-900 text-xl">{scanResult.appointment.time}</p>
                                    </div>
                                    <div className="bg-slate-50 p-3 rounded-xl">
                                        <p className="text-xs font-bold text-slate-400">Doctor</p>
                                        <p className="font-bold text-slate-900">{scanResult.appointment.doctor}</p>
                                        <p className="text-xs font-bold text-slate-500">{scanResult.appointment.department}</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center p-4 bg-amber-50 rounded-xl border border-amber-100 text-center">
                                    <p className="font-bold text-amber-800">No scheduled appointment found for today.</p>
                                    <Link href="/frontdesk/appointments/book" className="mt-2 text-xs font-bold text-amber-600 underline">Book Now</Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {scanResult.appointment && (
                        <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
                            <button className="px-6 py-3 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-colors">
                                Update Info
                            </button>
                            <button
                                onClick={handleCheckIn}
                                disabled={loading || scanResult.appointment.status === 'checked-in'}
                                className="px-8 py-3 bg-olive-600 hover:bg-olive-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg shadow-olive-200 transition-all transform hover:scale-[1.02]"
                            >
                                {loading ? "Processing..." :
                                    scanResult.appointment.status === 'checked-in' ? "Already Checked In" : "Confirm Check-in"}
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
