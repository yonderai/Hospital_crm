"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { useState, useEffect } from "react";
import { Search, Filter, Users } from "lucide-react";

export default function PayrollPage() {
    const [payrolls, setPayrolls] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await fetch("/api/finance/payroll");
            const data = await res.json();

            if (Array.isArray(data) && data.length > 0) {
                setPayrolls(data);
            } else {
                // Demo Data
                setPayrolls([
                    {
                        _id: "demo-1",
                        staffId: { firstName: "Sarah", lastName: "Connor", role: "Nurse", department: "ICU" },
                        month: 1,
                        year: 2026,
                        baseSalary: 4500,
                        netPay: 4100,
                        status: "paid"
                    },
                    {
                        _id: "demo-2",
                        staffId: { firstName: "James", lastName: "Rodriguez", role: "Surgeon", department: "Surgical" },
                        month: 1,
                        year: 2026,
                        baseSalary: 12000,
                        netPay: 10500,
                        status: "paid"
                    },
                    {
                        _id: "demo-3",
                        staffId: { firstName: "Emily", lastName: "Blunt", role: "Lab Tech", department: "Pathology" },
                        month: 1,
                        year: 2026,
                        baseSalary: 3800,
                        netPay: 3400,
                        status: "pending"
                    },
                    {
                        _id: "demo-4",
                        staffId: { firstName: "Michael", lastName: "Chang", role: "Pharmacist", department: "Pharmacy" },
                        month: 1,
                        year: 2026,
                        baseSalary: 4200,
                        netPay: 3900,
                        status: "paid"
                    },
                    {
                        _id: "demo-5",
                        staffId: { firstName: "David", lastName: "Kim", role: "Radiologist", department: "Radiology" },
                        month: 1,
                        year: 2026,
                        baseSalary: 9500,
                        netPay: 8200,
                        status: "processing"
                    }
                ]);
            }
        } catch (error) {
            console.error("Failed to load payroll records");
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight italic uppercase">Payroll Overview</h2>
                        <p className="text-slate-500 text-[10px] font-black mt-1 uppercase tracking-[0.4em]">Staff Salary & Compensation (View Only)</p>
                    </div>
                </div>

                <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                        <h3 className="text-xl font-black text-slate-900 tracking-tight">Salary Records</h3>
                        <div className="flex gap-2">
                            <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl">
                                <Search size={16} className="text-slate-400" />
                                <input type="text" placeholder="Search..." className="bg-transparent text-sm font-bold outline-none" />
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50 border-b border-slate-100">
                                <tr>
                                    <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Employee</th>
                                    <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Role</th>
                                    <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Period</th>
                                    <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Base Salary</th>
                                    <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Net Pay</th>
                                    <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan={6} className="px-8 py-8 text-center font-bold text-slate-500">Loading payroll data...</td></tr>
                                ) : payrolls.length === 0 ? (
                                    <tr><td colSpan={6} className="px-8 py-8 text-center font-bold text-slate-500">No payroll records found.</td></tr>
                                ) : (
                                    payrolls.map((record) => (
                                        <tr key={record._id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-all">
                                            <td className="px-8 py-4">
                                                <p className="text-sm font-black text-slate-900">
                                                    {record.staffId?.firstName} {record.staffId?.lastName}
                                                </p>
                                            </td>
                                            <td className="px-8 py-4">
                                                <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-wider">
                                                    {record.staffId?.role || 'Staff'}
                                                </span>
                                            </td>
                                            <td className="px-8 py-4 text-sm font-bold text-slate-600">
                                                {record.month}/{record.year}
                                            </td>
                                            <td className="px-8 py-4 text-sm font-bold text-slate-600">
                                                ₹{record.baseSalary.toLocaleString()}
                                            </td>
                                            <td className="px-8 py-4 text-sm font-black text-slate-900">
                                                ₹{record.netPay.toLocaleString()}
                                            </td>
                                            <td className="px-8 py-4">
                                                <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${record.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                                                    }`}>
                                                    {record.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
