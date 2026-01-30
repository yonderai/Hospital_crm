"use client";

import { useState, useRef } from "react";
import { Camera, Upload, Send, CheckCircle, AlertCircle } from "lucide-react";

export default function SelfRegistrationForm() {
    const [step, setStep] = useState(1); // 1: Photo, 2: OTP, 3: Details, 4: Success
    const [loading, setLoading] = useState(false);
    const [photo, setPhoto] = useState<string | null>(null);
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [otpSent, setOtpSent] = useState(false);

    const [formData, setFormData] = useState({
        firstName: "", lastName: "", dob: "", gender: "Male",
        email: "", address: "", emergencyName: "", emergencyPhone: "", emergencyRelation: "",
        hasInsurance: "no",
        allergies: [] as string[], chronicConditions: [] as string[]
    });

    const [successData, setSuccessData] = useState<any>(null);

    // Camera Handlers
    const fileInputRef = useRef<HTMLInputElement>(null);
    const handlePhotoCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setPhoto(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    // OTP Handlers
    const sendOTP = () => {
        if (phone.length < 10) return alert("Please enter a valid phone number");
        setLoading(true);
        setTimeout(() => {
            setOtpSent(true);
            setLoading(false);
            alert("OTP sent to " + phone + ": 1234"); // Mock OTP
        }, 1500);
    };

    const verifyOTP = () => {
        if (otp === "1234") {
            setStep(3);
        } else {
            alert("Invalid OTP");
        }
    };

    // Form Submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = { ...formData, phone, photo }; // Include photo if API handles it (omitted in this simplified API)
            const res = await fetch('/api/public/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            setSuccessData(data);
            setStep(4);
        } catch (err: any) {
            alert("Registration Failed: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // --- STEPS ---

    if (step === 1) { // Photo Step
        return (
            <div className="space-y-6 text-center">
                <div className="space-y-2">
                    <h2 className="text-2xl font-black text-slate-900">Welcome!</h2>
                    <p className="text-slate-500">Let's start with a quick photo for your file.</p>
                </div>

                <div className="mx-auto w-48 h-48 bg-slate-100 rounded-full flex items-center justify-center border-4 border-dashed border-slate-200 overflow-hidden relative">
                    {photo ? (
                        <img src={photo} className="w-full h-full object-cover" />
                    ) : (
                        <Camera size={48} className="text-slate-300" />
                    )}
                    <input
                        type="file"
                        accept="image/*"
                        capture="user"
                        ref={fileInputRef}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={handlePhotoCapture}
                    />
                </div>

                <button onClick={() => fileInputRef.current?.click()} className="px-6 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 flex items-center gap-2 mx-auto shadow-sm hover:bg-slate-50">
                    <Camera size={18} /> Take Photo
                </button>

                <div className="pt-4">
                    <button onClick={() => setStep(2)} className="w-full py-4 bg-olive-600 text-white font-bold rounded-2xl shadow-lg shadow-olive-200 hover:bg-olive-700 transition-all">
                        Check My Phone Number
                    </button>
                    <p className="text-xs text-slate-400 mt-4">Takes less than 2 minutes</p>
                </div>
            </div>
        );
    }

    if (step === 2) { // Phone & OTP
        return (
            <div className="space-y-6">
                <div className="space-y-2 text-center">
                    <h2 className="text-2xl font-black text-slate-900">Verification</h2>
                    <p className="text-slate-500">We need to verify your phone number.</p>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-widest">Phone Number</label>
                        <div className="flex gap-2">
                            <input
                                value={phone}
                                onChange={e => setPhone(e.target.value)}
                                placeholder="9876543210"
                                className="flex-1 h-14 px-4 bg-slate-50 border border-slate-200 rounded-xl font-bold text-lg outline-none focus:border-olive-500"
                            />
                            {!otpSent && (
                                <button onClick={sendOTP} disabled={loading} className="px-6 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 disabled:opacity-50">
                                    {loading ? "..." : "OTP"}
                                </button>
                            )}
                        </div>
                    </div>

                    {otpSent && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                            <label className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-widest">Enter OTP</label>
                            <input
                                value={otp}
                                onChange={e => setOtp(e.target.value)}
                                placeholder="1234"
                                className="w-full h-14 px-4 bg-slate-50 border border-slate-200 rounded-xl font-bold text-lg outline-none focus:border-olive-500 text-center tracking-[1em]"
                            />
                            <p className="text-xs text-center text-slate-400 mt-2">Mock OTP is 1234</p>

                            <button onClick={verifyOTP} className="w-full mt-6 py-4 bg-olive-600 text-white font-bold rounded-2xl shadow-lg shadow-olive-200 hover:bg-olive-700 transition-all flex items-center justify-center gap-2">
                                Verify & Continue
                            </button>
                        </div>
                    )}
                </div>
                <button onClick={() => setStep(1)} className="w-full text-sm font-bold text-slate-400">Back</button>
            </div>
        );
    }

    if (step === 3) { // Details Form
        return (
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2 text-center mb-6">
                    <h2 className="text-2xl font-black text-slate-900">Details</h2>
                    <p className="text-slate-500">Tell us a bit about yourself.</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">First Name *</label>
                        <input name="firstName" required onChange={handleChange} className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">Last Name *</label>
                        <input name="lastName" required onChange={handleChange} className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Date of Birth *</label>
                    <input type="date" name="dob" required onChange={handleChange} className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">Gender *</label>
                        <select name="gender" onChange={handleChange} className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl outline-none">
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">Insurance?</label>
                        <select name="hasInsurance" onChange={handleChange} className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl outline-none">
                            <option value="no">No</option>
                            <option value="yes">Yes</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Address</label>
                    <input name="address" placeholder="Start typing address..." onChange={handleChange} className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Emergency Contact</p>
                    <div className="space-y-3">
                        <input name="emergencyName" placeholder="Name" required onChange={handleChange} className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg outline-none text-sm" />
                        <input name="emergencyPhone" placeholder="Phone" required onChange={handleChange} className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg outline-none text-sm" />
                    </div>
                </div>

                <button type="submit" disabled={loading} className="w-full py-4 bg-olive-600 text-white font-bold rounded-2xl shadow-lg shadow-olive-200 hover:bg-olive-700 transition-all flex items-center justify-center gap-2">
                    {loading ? "Registering..." : "Submit Registration"}
                </button>
            </form>
        );
    }

    if (step === 4 && successData) {
        return (
            <div className="text-center space-y-8 animate-in zoom-in duration-300">
                <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                    <CheckCircle size={48} />
                </div>

                <div className="space-y-2">
                    <h2 className="text-3xl font-black text-slate-900">Registration Successful!</h2>
                    <p className="text-slate-500 font-medium">You are now registered with Medicore.</p>
                </div>

                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-4">
                    <div>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Your Patient ID</p>
                        <p className="text-2xl font-mono font-bold text-olive-600">{successData.mrn}</p>
                    </div>
                    <div>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Login Credentials</p>
                        <p className="text-sm text-slate-500">Sent to <strong>{phone}</strong></p>
                        <div className="bg-white p-3 rounded-xl border border-slate-200 mt-2 text-sm text-slate-800">
                            Pass: <span className="font-mono font-bold">{successData.credentials.password}</span>
                        </div>
                    </div>
                </div>

                <button className="w-full py-4 bg-white border border-slate-200 text-slate-700 font-bold rounded-2xl hover:bg-slate-50 transition-all">
                    Book Appointment
                </button>
            </div>
        );
    }

    return null;
}
