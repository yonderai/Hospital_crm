"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    Heart, User, Mail, Lock, Phone, MapPin,
    Calendar, Shield, AlertCircle, CheckCircle2,
    Camera, Upload, ArrowRight, ArrowLeft
} from "lucide-react";

export default function RegisterPage() {
    const router = useRouter();
    const [step, setStep] = useState(1); // 1 to 7
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        // Account
        email: "",
        password: "",
        confirmPassword: "",
        // Personal
        firstName: "",
        lastName: "",
        dob: "",
        gender: "male",
        bloodType: "",
        photoUrl: "", // Logic for upload to be implemented
        // Contact
        phone: "",
        otp: "",
        isPhoneVerified: false,
        address: {
            street: "",
            city: "",
            state: "",
            zipCode: "",
            country: "India"
        },
        // Emergency
        emergencyContact: {
            name: "",
            relation: "",
            phone: ""
        },
        // Medical
        allergies: [] as string[],
        chronicConditions: [] as string[],
        pastSurgeries: [] as any[], // Simple strings for now
        currentMedications: [] as any[],
        // Insurance
        hasInsurance: false,
        insurance: {
            provider: "",
            policyNumber: "",
            groupNumber: "",
            coverageType: "individual",
            sumInsured: "",
            validUntil: "",
            cardFront: null,
            cardBack: null
        },
        // Prefs
        preferredHospital: "Medicore Gurugram",
        preferredDoctor: "",
        agreedToTerms: false
    });

    const updateForm = (key: string, value: any) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const updateNested = (parent: string, key: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [parent]: {
                ...(prev as any)[parent],
                [key]: value
            }
        }));
    };

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);

    const handleSubmit = async () => {
        if (!formData.agreedToTerms) {
            setError("Please agree to the Terms & Conditions.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/patients/self-register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Registration failed");
            }

            // Success!
            router.push("/register/success?mrn=" + data.patient.mrn);
        } catch (err: any) {
            setError(err.message);
            setLoading(false);
        }
    };

    // Helper renderers for steps
    const renderStepIndicator = () => (
        <div className="flex justify-between mb-8">
            {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                <div key={num} className={`w-full h-2 rounded-full mx-1 ${num <= step ? 'bg-olive-600' : 'bg-slate-200'}`} />
            ))}
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center py-10">
            <div className="w-full max-w-3xl bg-white rounded-3xl shadow-xl overflow-hidden">
                {/* Header */}
                <div className="bg-[#0F172A] p-6 text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <div className="w-8 h-8 bg-gradient-to-tr from-olive-600 to-olive-400 rounded-lg flex items-center justify-center">
                            <Heart className="text-white" size={18} fill="currentColor" />
                        </div>
                        <span className="text-xl font-black text-white uppercase tracking-tight">Medicore</span>
                    </div>
                    <h1 className="text-white text-lg font-bold">New Patient Registration</h1>
                </div>

                <div className="p-8">
                    {renderStepIndicator()}

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-700 text-sm font-bold">
                            <AlertCircle size={18} /> {error}
                        </div>
                    )}

                    {/* STEP 1: Account Info */}
                    {step === 1 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                            <h2 className="text-2xl font-bold text-slate-800">Account Information</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Email Address *</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => updateForm("email", e.target.value)}
                                        className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-olive-500 outline-none"
                                        placeholder="patient@email.com"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Create Password *</label>
                                    <input
                                        type="password"
                                        value={formData.password}
                                        onChange={(e) => updateForm("password", e.target.value)}
                                        className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-olive-500 outline-none"
                                        placeholder="Min 8 characters"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Confirm Password *</label>
                                    <input
                                        type="password"
                                        value={formData.confirmPassword}
                                        onChange={(e) => updateForm("confirmPassword", e.target.value)}
                                        className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-olive-500 outline-none"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 2: Personal Info */}
                    {step === 2 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                            <h2 className="text-2xl font-bold text-slate-800">Personal Information</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">First Name *</label>
                                    <input
                                        value={formData.firstName}
                                        onChange={(e) => updateForm("firstName", e.target.value)}
                                        className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-olive-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Last Name *</label>
                                    <input
                                        value={formData.lastName}
                                        onChange={(e) => updateForm("lastName", e.target.value)}
                                        className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-olive-500 outline-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Date of Birth *</label>
                                <input
                                    type="date"
                                    value={formData.dob}
                                    onChange={(e) => updateForm("dob", e.target.value)}
                                    className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-olive-500 outline-none"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Gender *</label>
                                    <select
                                        value={formData.gender}
                                        onChange={(e) => updateForm("gender", e.target.value)}
                                        className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-olive-500 outline-none"
                                    >
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Blood Type</label>
                                    <select
                                        value={formData.bloodType}
                                        onChange={(e) => updateForm("bloodType", e.target.value)}
                                        className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-olive-500 outline-none"
                                    >
                                        <option value="">Select</option>
                                        <option value="A+">A+</option>
                                        <option value="A-">A-</option>
                                        <option value="B+">B+</option>
                                        <option value="B-">B-</option>
                                        <option value="AB+">AB+</option>
                                        <option value="AB-">AB-</option>
                                        <option value="O+">O+</option>
                                        <option value="O-">O-</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 3: Contact Info */}
                    {step === 3 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                            <h2 className="text-2xl font-bold text-slate-800">Contact Information</h2>

                            <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                                <label className="text-xs font-bold text-blue-700 uppercase tracking-wider block mb-1">Phone Number *</label>
                                <div className="flex gap-2">
                                    <div className="p-3 bg-white rounded-lg border border-blue-200 font-bold text-slate-600">+91</div>
                                    <input
                                        value={formData.phone}
                                        onChange={(e) => updateForm("phone", e.target.value)}
                                        className="flex-1 p-3 border border-blue-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="9876543210"
                                    />
                                    <button
                                        onClick={() => updateForm("isPhoneVerified", true)} // Mock verification
                                        className={`px-4 rounded-lg font-bold text-xs uppercase ${formData.isPhoneVerified ? 'bg-green-500 text-white' : 'bg-blue-600 text-white'}`}
                                    >
                                        {formData.isPhoneVerified ? 'Verified' : 'Verify OTP'}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="font-bold text-slate-700">Address</h3>
                                <input
                                    value={formData.address.street}
                                    onChange={(e) => updateNested("address", "street", e.target.value)}
                                    className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-olive-500 outline-none"
                                    placeholder="Street Address"
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        value={formData.address.city}
                                        onChange={(e) => updateNested("address", "city", e.target.value)}
                                        className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-olive-500 outline-none"
                                        placeholder="City"
                                    />
                                    <input
                                        value={formData.address.state}
                                        onChange={(e) => updateNested("address", "state", e.target.value)}
                                        className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-olive-500 outline-none"
                                        placeholder="State"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        value={formData.address.zipCode}
                                        onChange={(e) => updateNested("address", "zipCode", e.target.value)}
                                        className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-olive-500 outline-none"
                                        placeholder="PIN Code"
                                    />
                                    <input
                                        value={formData.address.country}
                                        onChange={(e) => updateNested("address", "country", e.target.value)}
                                        className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-olive-500 outline-none"
                                        placeholder="Country"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 4: Emergency Contact */}
                    {step === 4 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                            <h2 className="text-2xl font-bold text-slate-800">Emergency Contact</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Contact Name *</label>
                                    <input
                                        value={formData.emergencyContact.name}
                                        onChange={(e) => updateNested("emergencyContact", "name", e.target.value)}
                                        className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-olive-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Relationship *</label>
                                    <select
                                        value={formData.emergencyContact.relation}
                                        onChange={(e) => updateNested("emergencyContact", "relation", e.target.value)}
                                        className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-olive-500 outline-none"
                                    >
                                        <option value="">Select Relation</option>
                                        <option value="Spouse">Spouse</option>
                                        <option value="Parent">Parent</option>
                                        <option value="Sibling">Sibling</option>
                                        <option value="Child">Child</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Emergency Phone *</label>
                                    <input
                                        value={formData.emergencyContact.phone}
                                        onChange={(e) => updateNested("emergencyContact", "phone", e.target.value)}
                                        className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-olive-500 outline-none"
                                        placeholder="+91..."
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 5: Medical History (Skipped for brevity in UI mock, but data structures exist) */}
                    {step === 5 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                            <h2 className="text-2xl font-bold text-slate-800">Medical History (Optional)</h2>
                            <p className="text-slate-500">You can add allergies, chronic conditions, and past surgeries in your profile after registration.</p>
                            <div className="p-4 border border-dashed border-slate-300 rounded-xl text-center text-slate-400">
                                Detailed Medical History Form would go here
                            </div>
                        </div>
                    )}

                    {/* STEP 6: Insurance */}
                    {step === 6 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                            <h2 className="text-2xl font-bold text-slate-800">Insurance Information</h2>

                            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                                <div className={`w-12 h-6 rounded-full flex items-center px-1 cursor-pointer transition-colors ${formData.hasInsurance ? 'bg-olive-600 justify-end' : 'bg-slate-300 justify-start'}`}
                                    onClick={() => updateForm("hasInsurance", !formData.hasInsurance)}
                                >
                                    <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
                                </div>
                                <span className="font-bold text-slate-700">Do you have Health Insurance?</span>
                            </div>

                            {formData.hasInsurance && (
                                <div className="space-y-4 animate-in slide-in-from-top-2">
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Provider *</label>
                                        <select
                                            value={formData.insurance.provider}
                                            onChange={(e) => updateNested("insurance", "provider", e.target.value)}
                                            className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-olive-500 outline-none"
                                        >
                                            <option value="">Select Provider</option>
                                            <option value="Bajaj Allianz">Bajaj Allianz</option>
                                            <option value="HDFC Ergo">HDFC Ergo</option>
                                            <option value="Star Health">Star Health</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Policy Number *</label>
                                            <input
                                                value={formData.insurance.policyNumber}
                                                onChange={(e) => updateNested("insurance", "policyNumber", e.target.value)}
                                                className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-olive-500 outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Group Number</label>
                                            <input
                                                value={formData.insurance.groupNumber}
                                                onChange={(e) => updateNested("insurance", "groupNumber", e.target.value)}
                                                className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-olive-500 outline-none"
                                            />
                                        </div>
                                    </div>
                                    {/* File uploads would go here */}
                                </div>
                            )}
                        </div>
                    )}

                    {/* STEP 7: Terms */}
                    {step === 7 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                            <h2 className="text-2xl font-bold text-slate-800">Review & Submit</h2>

                            <div className="space-y-3">
                                <div className="flex gap-3">
                                    <input
                                        type="checkbox"
                                        checked={formData.agreedToTerms}
                                        onChange={(e) => updateForm("agreedToTerms", e.target.checked)}
                                        className="w-5 h-5 accent-olive-600"
                                    />
                                    <span className="text-sm text-slate-600">I agree to the Terms & Conditions and Privacy Policy.</span>
                                </div>
                                <div className="flex gap-3">
                                    <input type="checkbox" className="w-5 h-5 accent-olive-600" defaultChecked />
                                    <span className="text-sm text-slate-600">I consent to processing my medical data as per HIPAA guidelines.</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="mt-10 flex justify-between pt-6 border-t border-slate-100">
                        {step > 1 ? (
                            <button
                                onClick={prevStep}
                                className="px-6 py-3 font-bold text-slate-500 hover:text-slate-800 flex items-center gap-2"
                            >
                                <ArrowLeft size={18} /> Back
                            </button>
                        ) : (
                            <Link href="/login" className="px-6 py-3 font-bold text-slate-500 hover:text-slate-800">
                                Cancel
                            </Link>
                        )}

                        {step < 7 ? (
                            <button
                                onClick={nextStep}
                                className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg transition-all"
                            >
                                Next Step <ArrowRight size={18} />
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="bg-olive-600 hover:bg-olive-700 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-olive-600/20 transition-all disabled:opacity-50"
                            >
                                {loading ? 'Registering...' : 'REGISTER NOW'} <CheckCircle2 size={18} />
                            </button>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}
