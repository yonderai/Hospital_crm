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
    Save
} from "lucide-react";

export default function HRPersonnelPage() {
    const [staff, setStaff] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchStaff();
    }, []);

    const fetchStaff = async () => {
        try {
            const res = await fetch("/api/staff");
            const data = await res.json();
            if (data.staff) setStaff(data.staff);
            setLoading(false);
        } catch (e) {
            console.error(e);
        }
    };

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
                            onClick={() => setShowModal(true)}
                            className="flex items-center gap-2 px-6 py-2.5 bg-olive-700 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-olive-600/20 hover:bg-olive-800 transition-all">
                            <UserPlus size={16} /> Add Personnel
                        </button>
                    </div>
                </div>

                {/* Personnel Insights */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <HRStat label="Total Staff" value={staff.length} detail="+4 this week" icon={Users} />
                    <HRStat label="On Active Duty" value={staff.filter(s => s.isActive).length} detail="Active Status" icon={Activity} />
                    <HRStat label="Open Reqs" value="15" icon={Briefcase} />
                    <HRStat label="Certifications" value="94%" detail="Compliance Rate" icon={GraduationCap} />
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
                                <th className="px-8 py-6">Role</th>
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
                                                    {(s.firstName?.[0] || "") + (s.lastName?.[0] || "")}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-slate-900 tracking-tight">{s.firstName} {s.lastName}</p>
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{s.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                                                <MapPin size={12} className="text-slate-300" />
                                                {s.department || "General"}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2">
                                                <span className={`w-2 h-2 rounded-full ${s.isActive ? 'bg-green-500' : 'bg-slate-300'}`} />
                                                <p className="text-[10px] font-black uppercase text-slate-500 tracking-tight">{s.isActive ? 'Active' : 'Inactive'}</p>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <p className="text-[9px] font-black text-slate-400 uppercase bg-slate-100 px-2 py-1 rounded-lg inline-block">{s.role}</p>
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

            {/* Add Personnel Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white rounded-[32px] w-full max-w-2xl shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="text-xl font-black text-slate-900">Add New Personnel</h3>
                            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                                <X size={20} className="text-slate-400" />
                            </button>
                        </div>
                        <AddStaffForm close={() => setShowModal(false)} refresh={fetchStaff} />
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}

function AddStaffForm({ close, refresh }: any) {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        role: "doctor",
        department: "General",
        password: "password123" // Default password
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch("/api/staff", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                refresh();
                close();
            } else {
                alert("Failed to create user");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">First Name</label>
                    <input required className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl outline-none text-sm font-bold"
                        value={formData.firstName} onChange={e => setFormData({ ...formData, firstName: e.target.value })} />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Last Name</label>
                    <input required className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl outline-none text-sm font-bold"
                        value={formData.lastName} onChange={e => setFormData({ ...formData, lastName: e.target.value })} />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                <input required type="email" className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl outline-none text-sm font-bold"
                    value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Role</label>
                    <select className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl outline-none text-sm font-bold"
                        value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })}>
                        <option value="doctor">Doctor</option>
                        <option value="nurse">Nurse</option>
                        <option value="front-desk">Front Desk</option>
                        <option value="admin">Admin</option>
                        <option value="hr">HR</option>
                        <option value="billing">Billing</option>
                        <option value="pharmacist">Pharmacist</option>
                        <option value="lab-tech">Lab Tech</option>
                        <option value="inventory">Inventory Manager</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Department</label>
                    <select className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl outline-none text-sm font-bold"
                        value={formData.department} onChange={e => setFormData({ ...formData, department: e.target.value })}>
                        <option value="General">General</option>
                        <option value="Cardiology">Cardiology</option>
                        <option value="Neurology">Neurology</option>
                        <option value="Pediatrics">Pediatrics</option>
                        <option value="Emergency">Emergency</option>
                        <option value="Pharmacy">Pharmacy</option>
                        <option value="Laboratory">Laboratory</option>
                        <option value="Administration">Administration</option>
                    </select>
                </div>
            </div>

            <button type="submit" disabled={loading} className="w-full py-4 bg-olive-700 hover:bg-olive-800 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-olive-600/20 transition-all flex items-center justify-center gap-2">
                {loading ? "Creating..." : <><Save size={16} /> Create User Account</>}
            </button>
        </form>
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
