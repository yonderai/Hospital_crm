"use client";

import { useState } from "react";
import { Plus, X, Save, AlertCircle, CheckCircle } from "lucide-react";

export default function PatientRegistrationForm({ onSuccess }: { onSuccess?: () => void }) {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        // Basic
        firstName: "", lastName: "", dob: "", gender: "Male", bloodType: "",
        // Contact
        phone: "", email: "", password: "",
        address: "", city: "", state: "", zip: "", country: "India",
        // Emergency
        emergencyName: "", emergencyRelation: "", emergencyPhone: "",
        // Insurance
        hasInsurance: false,
        insuranceProvider: "", policyNumber: "", groupNumber: "", coverageType: "Individual", insuranceValidUntil: "",
        sumInsured: "", coPayment: "", deductible: "", coInsurancePercentage: "",
        // Medical Arrays
        allergies: [] as string[],
        chronicConditions: [] as string[],
        pastSurgeries: [] as { name: string, date: string, hospital: string }[],
        currentMedications: [] as { name: string, dosage: string, frequency: string }[],
        // Family
        familyMedicalHistory: { diabetes: false, heartDisease: false, cancer: false, other: "" },
        // Notes
        notes: "",
        preferredDoctor: "",
        registrationFee: "500" // Default fee
    });

    // Inputs for dynamic fields
    const [tempAllergy, setTempAllergy] = useState("");
    const [tempCondition, setTempCondition] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            if (name.startsWith('family_')) {
                const key = name.replace('family_', '');
                setFormData(prev => ({ ...prev, familyMedicalHistory: { ...prev.familyMedicalHistory, [key]: checked } }));
            } else {
                setFormData(prev => ({ ...prev, [name]: checked }));
            }
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    // Array Helpers
    const addChip = (field: 'allergies' | 'chronicConditions', value: string, setter: (v: string) => void) => {
        if (!value.trim()) return;
        setFormData(prev => ({ ...prev, [field]: [...prev[field], value] }));
        setter("");
    };
    const removeChip = (field: 'allergies' | 'chronicConditions', index: number) => {
        setFormData(prev => ({ ...prev, [field]: prev[field].filter((_, i) => i !== index) }));
    };

    const addSurgery = () => {
        setFormData(prev => ({ ...prev, pastSurgeries: [...prev.pastSurgeries, { name: "", date: "", hospital: "" }] }));
    };
    const updateSurgery = (index: number, field: string, value: string) => {
        const updated = [...formData.pastSurgeries];
        updated[index] = { ...updated[index], [field]: value };
        setFormData(prev => ({ ...prev, pastSurgeries: updated }));
    };

    const addMedication = () => {
        setFormData(prev => ({ ...prev, currentMedications: [...prev.currentMedications, { name: "", dosage: "", frequency: "" }] }));
    };
    const updateMedication = (index: number, field: string, value: string) => {
        const updated = [...formData.currentMedications];
        updated[index] = { ...updated[index], [field]: value };
        setFormData(prev => ({ ...prev, currentMedications: updated }));
    };

    const calculateAge = (dob: string) => {
        if (!dob) return "";
        const diff = Date.now() - new Date(dob).getTime();
        const ageDate = new Date(diff);
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const res = await fetch('/api/frontdesk/patients/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.error);

            setSuccessData(data); // Trigger success view
            if (onSuccess) onSuccess();
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message });
        } finally {
            setLoading(false);
        }
    };

    const [successData, setSuccessData] = useState<any>(null);

    if (successData) {
        return (
            <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-8 text-center space-y-8 animate-in fade-in zoom-in duration-300">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle size={40} />
                </div>

                <div className="space-y-2">
                    <h2 className="text-3xl font-black text-slate-900">Registration Successful!</h2>
                    <p className="text-slate-500 font-medium">Patient has been registered in the system.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left max-w-4xl mx-auto bg-slate-50 p-8 rounded-3xl border border-slate-200">
                    {/* Left: Details */}
                    <div className="space-y-6">
                        <div>
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Patient Name</p>
                            <p className="text-xl font-bold text-slate-900">{successData.patient.firstName} {successData.patient.lastName}</p>
                        </div>
                        <div>
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Patient ID (MRN)</p>
                            <p className="text-xl font-mono font-bold text-olive-600">{successData.patient.mrn}</p>
                        </div>
                        <div>
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Credentials</p>
                            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-sm text-slate-500 font-medium">Username:</span>
                                    <span className="text-sm font-mono font-bold text-slate-900 select-all">{successData.credentials.username}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-slate-500 font-medium">Password:</span>
                                    <span className="text-sm font-mono font-bold text-slate-900 select-all">{successData.credentials.password}</span>
                                </div>
                                <p className="text-[10px] text-red-500 font-bold mt-2 flex items-center gap-1">
                                    <AlertCircle size={10} /> Share securely. Verify password after login.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right: QR Code */}
                    <div className="flex flex-col items-center justify-center space-y-4">
                        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                            <img src={successData.credentials.qrCodeUrl} alt="Patient QR Code" className="w-48 h-48" />
                        </div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Scan for Quick Check-in</p>
                        <div className="flex gap-2 w-full">
                            <button className="flex-1 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50">Print Card</button>
                            <button className="flex-1 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50">Download QR</button>
                        </div>
                    </div>
                </div>

                <div className="flex justify-center gap-4 pt-8 border-t border-slate-100">
                    <button onClick={() => window.location.reload()} className="px-8 py-3 bg-olive-600 text-white font-bold rounded-xl hover:bg-olive-700 shadow-lg shadow-olive-200 transition-all">
                        Register Another Patient
                    </button>
                    <button onClick={() => window.location.href = '/frontdesk/dashboard'} className="px-8 py-3 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-all">
                        Go to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-8 space-y-8">
            {/* Header with Title */}
            <div className="border-b border-slate-100 pb-6 mb-6">
                <h3 className="text-xl font-black text-slate-900">Patient Registration Form</h3>
                <p className="text-slate-500 text-sm">Please fill in all mandatory fields marked with *</p>
                {message && (
                    <div className={`mt-4 p-4 rounded-xl flex items-center gap-2 text-sm font-bold ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                        {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                        {message.text}
                    </div>
                )}
            </div>

            {/* 1. Basic Details */}
            <section className="space-y-4">
                <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-[10px]">1</span>
                    Basic Details
                </h4>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="col-span-2 lg:col-span-1">
                        <label className="block text-xs font-bold text-slate-700 mb-1">First Name *</label>
                        <input name="firstName" required className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-olive-500 outline-none transition-all font-medium text-slate-900" placeholder="John" onChange={handleChange} />
                    </div>
                    <div className="col-span-2 lg:col-span-1">
                        <label className="block text-xs font-bold text-slate-700 mb-1">Last Name *</label>
                        <input name="lastName" required className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-olive-500 outline-none transition-all font-medium text-slate-900" placeholder="Doe" onChange={handleChange} />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Date of Birth *</label>
                        <input type="date" name="dob" required className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-olive-500 outline-none transition-all font-medium text-slate-900" onChange={handleChange} />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Age</label>
                        <input readOnly value={calculateAge(formData.dob)} className="w-full h-12 px-4 bg-slate-100 border-transparent rounded-xl text-slate-500 font-bold" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Gender *</label>
                        <select name="gender" className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-olive-500 outline-none text-slate-900 font-medium" onChange={handleChange}>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Blood Type</label>
                        <select name="bloodType" className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-olive-500 outline-none text-slate-900 font-medium" onChange={handleChange}>
                            <option value="">Select</option>
                            <option value="A+">A+</option> <option value="A-">A-</option>
                            <option value="B+">B+</option> <option value="B-">B-</option>
                            <option value="AB+">AB+</option> <option value="AB-">AB-</option>
                            <option value="O+">O+</option> <option value="O-">O-</option>
                        </select>
                    </div>
                </div>
            </section>

            {/* 2. Contact Info */}
            <section className="space-y-4 pt-4 border-t border-slate-50">
                <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-[10px]">2</span>
                    Contact Information
                </h4>
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number *</label>
                        <input
                            name="phone"
                            required
                            maxLength={10}
                            value={formData.phone}
                            className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-olive-500 outline-none transition-all font-medium text-slate-900"
                            placeholder="10 Digits"
                            onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                                setFormData(prev => ({ ...prev, phone: val }));
                            }}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Email (Optional)</label>
                        <input name="email" type="email" className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-olive-500 outline-none transition-all font-medium text-slate-900" placeholder="patient@example.com" onChange={handleChange} />
                    </div>
                    <div className="col-span-2">
                        <label className="block text-xs font-bold text-slate-700 mb-1">Address</label>
                        <input name="address" className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-olive-500 outline-none transition-all font-medium text-slate-900" placeholder="Street Address" onChange={handleChange} />
                    </div>
                    <div className="grid grid-cols-3 col-span-2 gap-6">
                        <input name="city" placeholder="City" className="h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl outline-none" onChange={handleChange} />
                        <input name="state" placeholder="State" className="h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl outline-none" onChange={handleChange} />
                        <input name="zip" placeholder="PIN Code" className="h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl outline-none" onChange={handleChange} />
                    </div>
                </div>
            </section>

            {/* 3. Emergency Contact */}
            <section className="space-y-4 pt-4 border-t border-slate-50">
                <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-[10px]">3</span>
                    Emergency Contact
                </h4>
                <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-1">
                        <label className="block text-xs font-bold text-slate-700 mb-1">Name *</label>
                        <input name="emergencyName" required className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl outline-none" onChange={handleChange} />
                    </div>
                    <div className="col-span-1">
                        <label className="block text-xs font-bold text-slate-700 mb-1">Relationship</label>
                        <select name="emergencyRelation" className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl outline-none" onChange={handleChange}>
                            <option value="">Select</option>
                            <option value="Parent">Parent</option>
                            <option value="Spouse">Spouse</option>
                            <option value="Sibling">Sibling</option>
                            <option value="Friend">Friend</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div className="col-span-1">
                        <label className="block text-xs font-bold text-slate-700 mb-1">Phone *</label>
                        <input
                            name="emergencyPhone"
                            required
                            maxLength={10}
                            value={formData.emergencyPhone}
                            className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                            onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                                setFormData(prev => ({ ...prev, emergencyPhone: val }));
                            }}
                        />
                    </div>
                </div>
            </section>

            {/* 4. Insurance */}
            <section className="space-y-4 pt-4 border-t border-slate-50">
                <div className="flex justify-between items-center">
                    <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-[10px]">4</span>
                        Insurance
                    </h4>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <span className="text-xs font-bold text-slate-700">Has Insurance?</span>
                        <input type="checkbox" name="hasInsurance" checked={formData.hasInsurance} onChange={handleChange} className="w-5 h-5 rounded border-slate-300 text-olive-600 focus:ring-olive-500" />
                    </label>
                </div>

                {formData.hasInsurance && (
                    <div className="grid grid-cols-2 gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-200">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Provider</label>
                            <select name="insuranceProvider" className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl outline-none" onChange={handleChange}>
                                <option value="">Select Provider</option>
                                <option value="HDFC Ergo">HDFC Ergo</option>
                                <option value="Bajaj Allianz">Bajaj Allianz</option>
                                <option value="Star Health">Star Health</option>
                                <option value="CGHS">CGHS/Govt</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Policy Number</label>
                            <input name="policyNumber" className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl outline-none" onChange={handleChange} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Valid Until</label>
                            <input type="date" name="insuranceValidUntil" className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl outline-none" onChange={handleChange} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Coverage Type</label>
                            <select name="coverageType" className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl outline-none" onChange={handleChange}>
                                <option value="Individual">Individual</option>
                                <option value="Family Floater">Family Floater</option>
                                <option value="Corporate">Corporate</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Sum Insured</label>
                            <input name="sumInsured" type="number" className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl outline-none" onChange={handleChange} placeholder="500000" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Deductible</label>
                            <input name="deductible" type="number" className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl outline-none" onChange={handleChange} placeholder="0" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Co-Pay (Flat)</label>
                            <input name="coPayment" type="number" className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl outline-none" onChange={handleChange} placeholder="0" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Co-Insurance %</label>
                            <input name="coInsurancePercentage" type="number" className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl outline-none" onChange={handleChange} placeholder="10" />
                        </div>
                    </div>
                )}
            </section>

            {/* 5. Medical History */}
            <section className="space-y-6 pt-4 border-t border-slate-50">
                <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-[10px]">5</span>
                    Medical History
                </h4>

                {/* Allergies */}
                <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">Known Allergies</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                        {formData.allergies.map((a, i) => (
                            <span key={i} className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-xs font-bold flex items-center gap-2">
                                {a} <button type="button" onClick={() => removeChip('allergies', i)}><X size={12} /></button>
                            </span>
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <select className="h-10 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none"
                            value={tempAllergy} onChange={e => { addChip('allergies', e.target.value, setTempAllergy); }}>
                            <option value="">Select Common Allergy</option>
                            <option value="Penicillin">Penicillin</option>
                            <option value="Peanuts">Peanuts</option>
                            <option value="Latex">Latex</option>
                        </select>
                        <input className="h-10 flex-1 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none"
                            placeholder="Or type custom allergy"
                            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addChip('allergies', e.currentTarget.value, (v) => e.currentTarget.value = ""); } }} />
                    </div>
                </div>

                {/* Chronic Conditions */}
                <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">Chronic Conditions</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                        {formData.chronicConditions.map((c, i) => (
                            <span key={i} className="px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-xs font-bold flex items-center gap-2">
                                {c} <button type="button" onClick={() => removeChip('chronicConditions', i)}><X size={12} /></button>
                            </span>
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <select className="h-10 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none"
                            value={tempCondition} onChange={e => { addChip('chronicConditions', e.target.value, setTempCondition); }}>
                            <option value="">Select Condition</option>
                            <option value="Diabetes">Diabetes</option>
                            <option value="Hypertension">Hypertension</option>
                            <option value="Asthma">Asthma</option>
                        </select>
                        <input className="h-10 flex-1 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none"
                            placeholder="Or type custom condition"
                            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addChip('chronicConditions', e.currentTarget.value, (v) => e.currentTarget.value = ""); } }} />
                    </div>
                </div>

                {/* Surgeries */}
                <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">Past Surgeries</label>
                    {formData.pastSurgeries.map((s, i) => (
                        <div key={i} className="grid grid-cols-7 gap-2 mb-2">
                            <input placeholder="Surgery Name" className="col-span-3 h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm" value={s.name} onChange={e => updateSurgery(i, 'name', e.target.value)} />
                            <input type="date" className="col-span-2 h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm" value={s.date} onChange={e => updateSurgery(i, 'date', e.target.value)} />
                            <input placeholder="Hospital" className="col-span-2 h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm" value={s.hospital} onChange={e => updateSurgery(i, 'hospital', e.target.value)} />
                        </div>
                    ))}
                    <button type="button" onClick={addSurgery} className="text-xs font-bold text-olive-600 hover:text-olive-700 flex items-center gap-1">
                        <Plus size={14} /> Add Surgery
                    </button>
                </div>
            </section>

            {/* 6. Administrative / Billing */}
            <section className="space-y-4 pt-4 border-t border-slate-50">
                <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-[10px]">6</span>
                    Administrative & Billing
                </h4>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Registration Fee (₹) *</label>
                        <input
                            type="number"
                            name="registrationFee"
                            required
                            value={formData.registrationFee}
                            className="w-full h-12 px-4 bg-olive-50 border border-olive-200 rounded-xl focus:border-olive-500 outline-none transition-all font-black text-slate-900"
                            placeholder="500"
                            onChange={handleChange}
                        />
                    </div>
                </div>
            </section>

            {/* Actions */}
            <div className="pt-8 border-t border-slate-100 flex justify-end gap-4">
                <button type="button" className="px-6 py-3 rounded-xl border border-slate-200 font-bold text-slate-500 hover:bg-slate-50">Cancel</button>
                <button type="submit" disabled={loading} className="px-8 py-3 rounded-xl bg-olive-600 text-white font-bold hover:bg-olive-700 shadow-lg shadow-olive-200 transition-all flex items-center gap-2">
                    {loading ? "Processing..." : <><Save size={18} /> Register Patient & Collect Fee</>}
                </button>
            </div>
        </form>
    );
}
