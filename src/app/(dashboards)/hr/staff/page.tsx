"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { UserPlus, Search, Filter, Stethoscope, User, Calendar, Mail, Phone, Hash, IndianRupee, Clock, MapPin, X, Loader2, CheckCircle, AlertCircle, Activity } from "lucide-react";

// Interface for Staff Member
interface StaffMember {
    name: string;
    id: string;
    value: string;
    status: string;
    date: string;
}

interface Stat {
    label: string;
    value: string;
    change: string;
    bg: string;
    color: string;
}

export default function HRStaffPage() {
    const [staff, setStaff] = useState<StaffMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    // Stats
    const [stats, setStats] = useState<Stat[]>([]);

    const fetchStaff = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/hr/staff');
            const data = await res.json();
            if (data.data) setStaff(data.data);
            if (data.stats) setStats(data.stats);
        } catch (error) {
            console.error("Failed to fetch staff", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStaff();
    }, []);

    return (
        <DashboardLayout>
            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Staff Management</h1>
                        <p className="text-slate-500 font-medium">Manage hospital workforce, roles, and assignments.</p>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-olive-600 hover:bg-olive-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-olive-600/20 active:scale-95"
                    >
                        <UserPlus size={20} />
                        <span>Register New Staff</span>
                    </button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((stat, i) => (
                        <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                            <div className="flex justify-between items-start mb-2">
                                <span className={`p-2 rounded-lg ${stat.bg} ${stat.color}`}>
                                    {/* Icon placeholder logic could go here, but using text for now or generic icon */}
                                    <User size={20} />
                                </span>
                                <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.change.includes('+') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                    {stat.change}
                                </span>
                            </div>
                            <h3 className="text-2xl font-black text-slate-900">{stat.value}</h3>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Main Content */}
                <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/30">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search by name, ID, or role..."
                                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-olive-500/20 focus:border-olive-500 transition-all placeholder:text-slate-400"
                            />
                        </div>
                        <div className="flex gap-2">
                            <button className="px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-600 font-bold text-sm flex items-center gap-2 hover:bg-slate-50">
                                <Filter size={16} /> Filter
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                                    <th className="px-8 py-5">Employee</th>
                                    <th className="px-8 py-5">Role & Dept</th>
                                    <th className="px-8 py-5">Status</th>
                                    <th className="px-8 py-5">Joined</th>
                                    <th className="px-8 py-5 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {loading ? (
                                    [...Array(5)].map((_, i) => (
                                        <tr key={i} className="animate-pulse">
                                            <td className="px-8 py-6"><div className="h-4 w-32 bg-slate-100 rounded"></div></td>
                                            <td className="px-8 py-6"><div className="h-4 w-24 bg-slate-100 rounded"></div></td>
                                            <td className="px-8 py-6"><div className="h-4 w-16 bg-slate-100 rounded"></div></td>
                                            <td className="px-8 py-6"><div className="h-4 w-20 bg-slate-100 rounded"></div></td>
                                            <td className="px-8 py-6"></td>
                                        </tr>
                                    ))
                                ) : (
                                    staff.map((member, i) => (
                                        <tr key={i} className="hover:bg-slate-50/80 transition-colors group">
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold">
                                                        {member.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-900">{member.name}</p>
                                                        <p className="text-xs text-slate-500 font-medium">{member.id}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <span className="font-semibold text-slate-700 block">{member.value}</span>
                                            </td>
                                            <td className="px-8 py-5">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${member.status === 'Active' ? 'bg-olive-50 text-olive-600 border border-olive-100' : 'bg-slate-100 text-slate-500'
                                                    }`}>
                                                    {member.status}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5 text-sm font-semibold text-slate-600">
                                                {member.date}
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <button className="text-slate-400 hover:text-olive-600 font-bold text-xs uppercase tracking-wider transition-colors">
                                                    View Profile
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Registration Modal */}
            {showModal && (
                <RegistrationModal
                    onClose={() => setShowModal(false)}
                    onSuccess={() => {
                        setShowModal(false);
                        fetchStaff();
                    }}
                />
            )}
        </DashboardLayout>
    );
}

function RegistrationModal({ onClose, onSuccess }: { onClose: () => void, onSuccess: () => void }) {
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "", // User will set this, logic can be improved later
        role: "doctor",
        mobile: "",
        employeeId: "",
        joiningDate: "",
        specialization: "",
        consultationFee: "",
        shift: "",
        ward: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError("");

        try {
            const res = await fetch('/api/hr/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || "Registration failed");

            onSuccess();
        } catch (err) { // implicitly any or unknown, usually safe to cast strictly validation
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unknown error occurred");
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-[32px] w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh]">
                <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Register Staff</h2>
                        <p className="text-sm font-medium text-slate-500">Create a new secure account for hospital staff.</p>
                    </div>
                    <button onClick={onClose} className="p-2 bg-slate-50 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="overflow-y-auto p-8 custom-scrollbar">
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-3 text-sm font-bold animate-in fade-in slide-in-from-top-2">
                            <AlertCircle size={20} />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Personal Info */}
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <InputField label="First Name" name="firstName" icon={User} value={formData.firstName} onChange={handleChange} required />
                                <InputField label="Last Name" name="lastName" icon={User} value={formData.lastName} onChange={handleChange} required />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <InputField label="Email Address" type="email" name="email" icon={Mail} value={formData.email} onChange={handleChange} required />
                                <InputField label="Mobile Number" type="tel" name="mobile" icon={Phone} value={formData.mobile} onChange={handleChange} required />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <InputField label="Employee ID" name="employeeId" icon={Hash} placeholder="E.g. DR-2024-001" value={formData.employeeId} onChange={handleChange} required />
                                <InputField label="Joining Date" type="date" name="joiningDate" icon={Calendar} value={formData.joiningDate} onChange={handleChange} required />
                            </div>
                        </div>

                        <div className="h-px bg-slate-100 my-4" />

                        {/* Account & Role */}
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-black text-slate-700 uppercase tracking-widest mb-2">Role Assignment</label>
                                    <select
                                        name="role"
                                        value={formData.role}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-olive-500/20 focus:border-olive-500 transition-all appearance-none"
                                    >
                                        <option value="doctor">Doctor</option>
                                        <option value="nurse">Nurse</option>
                                        <option value="admin">Administrator</option>
                                        <option value="hr">HR Staff</option>
                                        <option value="receptionist">Receptionist</option>
                                        <option value="pharmacist">Pharmacist</option>
                                        <option value="lab_tech">Lab Technician</option>
                                    </select>
                                </div>
                                <InputField label="Password" type="password" name="password" icon={Hash} value={formData.password} onChange={handleChange} required />
                            </div>
                        </div>

                        {/* Conditional Role Fields */}
                        {formData.role === 'doctor' && (
                            <div className="p-6 bg-olive-50/50 rounded-2xl border border-olive-100 space-y-4 animate-in fade-in slide-in-from-top-4">
                                <h4 className="text-sm font-black text-olive-800 uppercase tracking-widest flex items-center gap-2">
                                    <Stethoscope size={16} /> Doctor Details
                                </h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <InputField label="Specialization" name="specialization" placeholder="e.g. Cardiology" value={formData.specialization} onChange={handleChange} />
                                    <InputField label="Consultation Fee" type="number" name="consultationFee" icon={IndianRupee} value={formData.consultationFee} onChange={handleChange} />
                                </div>
                            </div>
                        )}

                        {formData.role === 'nurse' && (
                            <div className="p-6 bg-blue-50/50 rounded-2xl border border-blue-100 space-y-4 animate-in fade-in slide-in-from-top-4">
                                <h4 className="text-sm font-black text-blue-800 uppercase tracking-widest flex items-center gap-2">
                                    <Activity size={16} /> Nurse Assignment
                                </h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <InputField label="Shift" name="shift" placeholder="Morning / Night" icon={Clock} value={formData.shift} onChange={handleChange} />
                                    <InputField label="Ward Assignment" name="ward" placeholder="Block A - ICU" icon={MapPin} value={formData.ward} onChange={handleChange} />
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="pt-4 flex items-center justify-end gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="px-8 py-3 bg-olive-600 hover:bg-olive-700 text-white rounded-xl font-bold flex items-center gap-2 shadow-xl shadow-olive-600/20 active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {submitting ? <Loader2 size={20} className="animate-spin" /> : <CheckCircle size={20} />}
                                {submitting ? 'Creating...' : 'Register Staff'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

interface InputFieldProps {
    label: string;
    name: string;
    type?: string;
    value: string | number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    icon?: React.ElementType;
    required?: boolean;
}

function InputField({ label, name, type = "text", value, onChange, placeholder, icon: Icon, required }: InputFieldProps) {
    return (
        <div className="space-y-2">
            <label className="block text-xs font-black text-slate-700 uppercase tracking-widest">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <div className="relative">
                {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />}
                <input
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    required={required}
                    className={`w-full ${Icon ? 'pl-11' : 'pl-4'} pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-olive-500/20 focus:border-olive-500 transition-all placeholder:text-slate-400`}
                />
            </div>
        </div>
    );
}

// Removed ActivityIcon function
