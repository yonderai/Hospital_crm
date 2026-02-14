"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
    Users,
    Search,
    UserPlus,
    Briefcase,
    Calendar,
    GraduationCap,
    MoreVertical,
    ChevronRight,
    MapPin,
    Activity,
    X,
    Loader2
} from "lucide-react";

export default function HRPersonnelPage() {
    const [staff, setStaff] = useState<any[]>([]);
    const [stats, setStats] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchStaff = async () => {
        try {
            const res = await fetch('/api/hr/staff');
            const data = await res.json();
            if (data.data) {
                setStaff(data.data.map((s: any) => ({
                    id: s.id,
                    name: s.name,
                    role: s.value,
                    dept: 'HR',
                    status: s.status,
                    joined: s.date,
                    type: 'Full-time'
                })));
            }
            if (data.stats) {
                setStats(data.stats);
            }
        } catch (error) {
            console.error("Failed to fetch staff", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStaff();
    }, []);

    // Helper to get stat value
    const getStat = (label: string) => stats.find(s => s.label === label)?.value || "0";

    return (
        <DashboardLayout>
            <div className="space-y-10">
                {/* Header Section */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Personnel Management</h2>
                        <p className="text-slate-500 text-sm font-medium mt-1 uppercase tracking-widest">HUMAN RESOURCES CORE • ENTERPRISE NODE</p>
                    </div>
                    <div className="flex gap-4">
                        <button className="flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-xs uppercase tracking-widest shadow-sm hover:bg-slate-50 transition-all">
                            Payroll Logs
                        </button>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center gap-2 px-6 py-2.5 bg-olive-700 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-olive-600/20 hover:bg-olive-800 transition-all"
                        >
                            <UserPlus size={16} /> Add Personnel
                        </button>
                    </div>
                </div>

                {/* Personnel Insights */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <HRStat label="Total Hospital Staff" value={getStat("Total Staff")} detail={`+${getStat("Total Staff")} in ecosystem`} icon={Users} />
                    <HRStat label="Doctors" value={getStat("Doctors")} detail="Medical Personnel" icon={Activity} />
                    <HRStat label="Nurses" value={getStat("Nurses")} detail="Nursing Division" icon={Activity} />
                    <HRStat label="Other Roles" value={getStat("Other")} detail="Compliance Dept" icon={GraduationCap} />
                </div>

                {/* Staff Directory */}
                <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden min-h-[500px]">
                    <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/20">
                        <div className="flex items-center gap-6">
                            <h3 className="text-xl font-black text-slate-900 tracking-tight">Staff Registry</h3>
                            <div className="flex items-center gap-3 bg-white border border-slate-100 px-4 py-2.5 rounded-2xl w-80 shadow-sm">
                                <Search size={18} className="text-slate-400" />
                                <input placeholder="Search Name, Role, or ID..." className="bg-transparent border-none outline-none text-sm font-medium text-slate-900 w-full" />
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <DeptFilter label="All" active />
                            <DeptFilter label="Medical" />
                            <DeptFilter label="Nursing" />
                            <DeptFilter label="Admin" />
                        </div>
                    </div>

                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50">
                                <th className="px-8 py-6">Staff Member</th>
                                <th className="px-8 py-6">Department</th>
                                <th className="px-8 py-6">Status</th>
                                <th className="px-8 py-6">Tenure</th>
                                <th className="px-8 py-6 text-right pr-12">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                [...Array(5)].map((_, i) => <tr key={i}><td colSpan={5} className="h-20 animate-pulse bg-slate-50/30" /></tr>)
                            ) : (
                                staff.map((s, idx) => (
                                    <tr key={idx} className="group hover:bg-slate-50/50 transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300 font-bold text-xs uppercase group-hover:bg-white group-hover:border-olive-200 transition-all">
                                                    {s.name.split(' ').map((n: string) => n[0]).join('')}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-slate-900 tracking-tight">{s.name}</p>
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{s.role}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                                                <MapPin size={12} className="text-slate-300" />
                                                {s.dept}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2">
                                                <span className={`w-2 h-2 rounded-full ${s.status === 'On Duty' ? 'bg-green-500' : s.status === 'On Leave' ? 'bg-yellow-500' : 'bg-slate-300'}`} />
                                                <p className="text-[10px] font-black uppercase text-slate-500 tracking-tight">{s.status}</p>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <p className="text-xs font-bold text-slate-500">{s.joined}</p>
                                            <p className="text-[9px] font-black text-slate-300 uppercase">{s.type}</p>
                                        </td>
                                        <td className="px-8 py-6 text-right pr-8">
                                            <button className="p-2.5 bg-white border border-slate-100 text-slate-400 hover:text-olive-700 rounded-xl shadow-sm transition-all group-hover:border-olive-200">
                                                <ChevronRight size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Staff Modal */}
            {isModalOpen && (
                <AddStaffModal
                    onClose={() => setIsModalOpen(false)}
                    onSuccess={() => {
                        setIsModalOpen(false);
                        fetchStaff();
                    }}
                />
            )}
        </DashboardLayout>
    );
}

function HRStat({ label, value, detail, icon: Icon }: any) {
    return (
        <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-center justify-between group hover:border-olive-400 transition-all">
            <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
                <p className="text-3xl font-black text-slate-900 tracking-tighter mb-1">{value}</p>
                {detail && <p className="text-[10px] font-bold text-olive-600 uppercase tracking-tight">{detail}</p>}
            </div>
            <div className="p-4 bg-slate-50 text-slate-400 rounded-2xl group-hover:bg-olive-50 group-hover:text-olive-600 transition-all">
                <Icon size={24} />
            </div>
        </div>
    );
}

function DeptFilter({ label, active = false }: any) {
    return (
        <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest cursor-pointer transition-all border ${active ? 'bg-olive-700 text-white border-transparent' : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'}`}>
            {label}
        </span>
    );
}

function AddStaffModal({ onClose, onSuccess }: { onClose: () => void, onSuccess: () => void }) {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        role: 'doctor',
        department: 'Cardiology',
        designation: 'Staff Physician',
        baseSalary: '0'
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await fetch('/api/admin/staff', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                onSuccess();
            } else {
                alert('Failed to create staff member');
            }
        } catch (error) {
            console.error(error);
            alert('Error creating staff member');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-sm">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div>
                        <h3 className="text-xl font-black text-slate-900 tracking-tight">Add Personnel</h3>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-widest mt-1">New Staff Registration</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">First Name</label>
                            <input
                                required
                                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:border-olive-500 focus:ring-1 focus:ring-olive-500/20 transition-all placeholder:text-slate-300"
                                placeholder="e.g. John"
                                value={formData.firstName}
                                onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Last Name</label>
                            <input
                                required
                                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:border-olive-500 focus:ring-1 focus:ring-olive-500/20 transition-all placeholder:text-slate-300"
                                placeholder="e.g. Doe"
                                value={formData.lastName}
                                onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email Address</label>
                            <input
                                type="email"
                                required
                                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:border-olive-500 focus:ring-1 focus:ring-olive-500/20 transition-all placeholder:text-slate-300"
                                placeholder="john.doe@medicore.com"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Phone Number</label>
                            <input
                                required
                                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:border-olive-500 focus:ring-1 focus:ring-olive-500/20 transition-all placeholder:text-slate-300"
                                placeholder="+1 (555) 000-0000"
                                value={formData.phone}
                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Role</label>
                            <select
                                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:border-olive-500 focus:ring-1 focus:ring-olive-500/20 transition-all"
                                value={formData.role}
                                onChange={e => setFormData({ ...formData, role: e.target.value })}
                            >
                                <option value="doctor">Doctor</option>
                                <option value="nurse">Nurse</option>
                                <option value="admin">Admin</option>
                                <option value="frontdesk">Front Desk</option>
                                <option value="labtech">Lab Tech</option>
                                <option value="pharmacist">Pharmacist</option>
                                <option value="billing">Billing Officer</option>
                                <option value="hr">HR Manager</option>
                                <option value="finance">Finance Manager</option>
                                <option value="maintenance">Maintenance</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Department</label>
                            <input
                                required
                                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:border-olive-500 focus:ring-1 focus:ring-olive-500/20 transition-all placeholder:text-slate-300"
                                placeholder="e.g. Cardiology"
                                value={formData.department}
                                onChange={e => setFormData({ ...formData, department: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Designation</label>
                            <input
                                required
                                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:border-olive-500 focus:ring-1 focus:ring-olive-500/20 transition-all placeholder:text-slate-300"
                                placeholder="e.g. Senior Resident"
                                value={formData.designation}
                                onChange={e => setFormData({ ...formData, designation: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Base Salary</label>
                            <div className="relative">
                                <span className="absolute left-4 top-3.5 text-slate-400 font-bold">₹</span>
                                <input
                                    type="number"
                                    required
                                    className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-8 pr-4 py-3 text-sm font-bold text-slate-900 outline-none focus:border-olive-500 focus:ring-1 focus:ring-olive-500/20 transition-all placeholder:text-slate-300"
                                    placeholder="0.00"
                                    value={formData.baseSalary}
                                    onChange={e => setFormData({ ...formData, baseSalary: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-3 border-t border-slate-50">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-8 py-3 rounded-xl bg-olive-700 text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-olive-600/20 hover:bg-olive-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                        >
                            {isLoading && <Loader2 size={14} className="animate-spin" />}
                            {isLoading ? 'Creating...' : 'Create Personnel'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
