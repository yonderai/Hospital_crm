"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { UserPlus, Search, Filter, User, Lock, Mail, Phone, Hash, Edit, Key, X, Loader2, CheckCircle, AlertCircle, Shield } from "lucide-react";

interface StaffMember {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    isActive: boolean;
    department?: string;
    mobile?: string;
    employeeId?: string;
}

export default function AdminStaffPage() {
    const [staff, setStaff] = useState<StaffMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
    const [showResetModal, setShowResetModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const [activeFilter, setActiveFilter] = useState<'all' | 'doctor' | 'nurse' | 'active'>('all');

    const filteredStaff = staff.filter(member => {
        const matchesSearch = member.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            member.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (member.role && member.role.toLowerCase().includes(searchQuery.toLowerCase()));

        if (!matchesSearch) return false;

        if (activeFilter === 'all') return true;
        if (activeFilter === 'doctor') return member.role === 'doctor';
        if (activeFilter === 'nurse') return member.role === 'nurse';
        if (activeFilter === 'active') return member.isActive;
        return true;
    });

    // Stats
    const stats = [
        { id: 'all', label: "Total Staff", value: staff.length.toString(), color: "text-slate-900", bg: "bg-slate-50" },
        { id: 'doctor', label: "Doctors", value: staff.filter(s => s.role === 'doctor').length.toString(), color: "text-olive-600", bg: "bg-olive-50" },
        { id: 'nurse', label: "Nurses", value: staff.filter(s => s.role === 'nurse').length.toString(), color: "text-blue-600", bg: "bg-blue-50" },
        { id: 'active', label: "Active", value: staff.filter(s => s.isActive).length.toString(), color: "text-green-600", bg: "bg-green-50" },
    ];

    const fetchStaff = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/staff');
            const data = await res.json();
            if (data.data) setStaff(data.data);
        } catch (error) {
            console.error("Failed to fetch staff", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStaff();
    }, []);

    const toggleStatus = async (id: string, currentStatus: boolean) => {
        try {
            const res = await fetch(`/api/admin/staff/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isActive: !currentStatus })
            });
            if (res.ok) fetchStaff();
        } catch (error) {
            console.error("Failed to toggle status", error);
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Admin Staff Control</h1>
                        <p className="text-slate-500 font-medium">Manage hospital access, roles, and security protocols.</p>
                    </div>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg hover:shadow-xl active:scale-95"
                    >
                        <UserPlus size={20} />
                        <span>Add New Staff</span>
                    </button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((stat, i) => (
                        <div
                            key={i}
                            onClick={() => setActiveFilter(stat.id as any)}
                            className={`p-5 rounded-2xl border shadow-sm cursor-pointer transition-all active:scale-95 ${activeFilter === stat.id
                                    ? 'bg-slate-900 border-slate-900 ring-4 ring-slate-100'
                                    : 'bg-white border-slate-100 hover:border-slate-300'
                                }`}
                        >
                            <h3 className={`text-3xl font-black mb-1 ${activeFilter === stat.id ? 'text-white' : stat.color}`}>{stat.value}</h3>
                            <p className={`text-xs font-bold uppercase tracking-widest ${activeFilter === stat.id ? 'text-slate-400' : 'text-slate-400'}`}>{stat.label}</p>
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
                                placeholder="Search system users..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 transition-all placeholder:text-slate-400"
                            />
                        </div>
                        <div className="flex gap-2">
                            <button className="px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-600 font-bold text-sm flex items-center gap-2 hover:bg-slate-50">
                                {activeFilter !== 'all' && (
                                    <span className="ml-2 bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-black uppercase">
                                        Filtered: {activeFilter}
                                    </span>
                                )}
                                Filter
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                                    <th className="px-8 py-5">User Profile</th>
                                    <th className="px-8 py-5">Role Assignment</th>
                                    <th className="px-8 py-5">Access Status</th>
                                    <th className="px-8 py-5 text-right">Security Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {loading ? (
                                    [...Array(5)].map((_, i) => (
                                        <tr key={i} className="animate-pulse">
                                            <td className="px-8 py-6"><div className="h-4 w-32 bg-slate-100 rounded"></div></td>
                                            <td className="px-8 py-6"><div className="h-4 w-24 bg-slate-100 rounded"></div></td>
                                            <td className="px-8 py-6"><div className="h-4 w-16 bg-slate-100 rounded"></div></td>
                                            <td className="px-8 py-6"></td>
                                        </tr>
                                    ))
                                ) : (
                                    filteredStaff.map((member, i) => (
                                        <tr key={i} className="hover:bg-slate-50/80 transition-colors group">
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold">
                                                        {member.firstName.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-900">{member.firstName} {member.lastName}</p>
                                                        <p className="text-xs text-slate-500 font-medium">{member.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <span className="font-bold text-slate-700 block uppercase text-xs tracking-wider">{member.role}</span>
                                                {member.department && <span className="text-xs text-slate-400 font-medium">{member.department}</span>}
                                            </td>
                                            <td className="px-8 py-5">
                                                <button
                                                    onClick={() => toggleStatus(member._id, member.isActive)}
                                                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-2 transition-all ${member.isActive ? 'bg-green-50 text-green-600 border border-green-100 hover:bg-green-100' : 'bg-red-50 text-red-500 border border-red-100 hover:bg-red-100'
                                                        }`}>
                                                    {member.isActive ? <CheckCircle size={12} /> : <X size={12} />}
                                                    {member.isActive ? 'Active' : 'Disabled'}
                                                </button>
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => { setSelectedStaff(member); setShowResetModal(true); }}
                                                        className="p-2 text-slate-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-all"
                                                        title="Reset Password"
                                                    >
                                                        <Key size={16} />
                                                    </button>
                                                    <div className="h-4 w-px bg-slate-200 mx-1"></div>
                                                    <button className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all">
                                                        <Edit size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Create Modal */}
            {showCreateModal && (
                <CreateUserModal
                    onClose={() => setShowCreateModal(false)}
                    onSuccess={() => {
                        setShowCreateModal(false);
                        fetchStaff();
                    }}
                />
            )}

            {/* Reset Password Modal */}
            {showResetModal && selectedStaff && (
                <ResetPasswordModal
                    user={selectedStaff}
                    onClose={() => { setShowResetModal(false); setSelectedStaff(null); }}
                />
            )}
        </DashboardLayout>
    );
}

function CreateUserModal({ onClose, onSuccess }: { onClose: () => void, onSuccess: () => void }) {
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        role: "doctor",
        password: "",
        department: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError("");

        try {
            const res = await fetch('/api/admin/staff', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to create user");

            onSuccess();
        } catch (err) {
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
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Add Hospital Staff</h2>
                        <p className="text-sm font-medium text-slate-500">Create a secure account access profile.</p>
                    </div>
                    <button onClick={onClose} className="p-2 bg-slate-50 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-8 overflow-y-auto custom-scrollbar">
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-3 text-sm font-bold animate-in fade-in slide-in-from-top-2">
                            <AlertCircle size={20} />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <InputField label="First Name" name="firstName" icon={User} value={formData.firstName} onChange={handleChange} required />
                            <InputField label="Last Name" name="lastName" icon={User} value={formData.lastName} onChange={handleChange} required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <InputField label="Email Address" type="email" name="email" icon={Mail} value={formData.email} onChange={handleChange} required />
                            <InputField label="Phone Number" type="tel" name="phone" icon={Phone} value={formData.phone} onChange={handleChange} />
                        </div>

                        <div className="h-px bg-slate-100" />

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-black text-slate-700 uppercase tracking-widest mb-2">Role Permissions</label>
                                <select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 transition-all appearance-none"
                                >
                                    <option value="doctor">Doctor</option>
                                    <option value="nurse">Nurse</option>
                                    <option value="frontdesk">Front Desk</option>
                                    <option value="hr">HR Staff</option>
                                    <option value="finance">Finance Manager</option>
                                    <option value="emergency">Emergency Manager</option>
                                    <option value="admin">Administrator</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <InputField label="Department" name="department" icon={Shield} placeholder="e.g. Cardiology" value={formData.department} onChange={handleChange} />
                                <InputField label="Initial Password" type="password" name="password" icon={Hash} value={formData.password} onChange={handleChange} required />
                            </div>
                            <p className="text-xs text-orange-600 font-bold flex items-center gap-1">
                                <Lock size={12} />
                                User will be forced to change this password on first login.
                            </p>
                        </div>

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
                                className="px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold flex items-center gap-2 shadow-xl active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {submitting ? <Loader2 size={20} className="animate-spin" /> : <UserPlus size={20} />}
                                {submitting ? 'Creating...' : 'Create Staff'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

function ResetPasswordModal({ user, onClose }: { user: StaffMember, onClose: () => void }) {
    const [newPassword, setNewPassword] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await fetch('/api/admin/staff/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user._id, newPassword })
            });
            if (res.ok) setSuccess(true);
        } catch (error) {
            console.error("Failed", error);
        } finally {
            setSubmitting(false);
        }
    };

    if (success) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                <div className="bg-white p-8 rounded-[32px] text-center max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle size={32} />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 mb-2">Password Reset!</h3>
                    <p className="text-sm text-slate-500 font-medium mb-6">User {user.email} can now login with the new password.</p>
                    <button onClick={onClose} className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all">
                        Close
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white p-8 rounded-[32px] max-w-md w-full shadow-2xl">
                <div className="mb-6">
                    <h3 className="text-xl font-black text-slate-900">Reset Password</h3>
                    <p className="text-sm text-slate-500 font-medium">Set a new temporary password for <span className="text-slate-900 font-bold">{user.firstName}</span>.</p>
                </div>
                <form onSubmit={handleReset} className="space-y-4">
                    <InputField
                        label="New Password"
                        type="password"
                        name="newPassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        icon={Key}
                        required
                        placeholder="Enter secure password"
                    />
                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onClose} className="flex-1 py-3 bg-slate-50 text-slate-500 font-bold rounded-xl hover:bg-slate-100 transition-all">Cancel</button>
                        <button type="submit" disabled={submitting} className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl shadow-lg shadow-orange-500/20 transition-all">
                            {submitting ? 'Resetting...' : 'Confirm Reset'}
                        </button>
                    </div>
                </form>
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
                    className={`w-full ${Icon ? 'pl-11' : 'pl-4'} pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 transition-all placeholder:text-slate-400`}
                />
            </div>
        </div>
    );
}
