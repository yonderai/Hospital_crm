"use client";

import { DollarSign, ShieldCheck, FileText, CreditCard, PieChart, TrendingUp, AlertTriangle, ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function BillingDashboard() {
    return (
        <div className="flex flex-col h-screen bg-olive-50">
            {/* Top Header */}
            <header className="bg-white border-b border-olive-200 h-16 flex items-center justify-between px-8 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="bg-olive-800 p-2 rounded-lg">
                        <DollarSign className="text-white" size={20} />
                    </div>
                    <h1 className="text-xl font-bold text-olive-900 font-serif">Revenue Cycle Management</h1>
                </div>
                <div className="flex gap-4">
                    <button className="px-4 py-2 bg-olive-50 text-olive-700 rounded-lg text-sm font-bold border border-olive-200 hover:bg-olive-100">Financial Reports</button>
                    <button className="px-4 py-2 bg-olive-800 text-white rounded-lg text-sm font-bold hover:bg-olive-900 shadow-lg">New Payment Entry</button>
                </div>
            </header>

            <main className="flex-1 p-8 overflow-y-auto space-y-8">
                {/* KPI Cards */}
                <div className="grid grid-cols-4 gap-6">
                    <StatsCard title="Total Receivables" value="$1,240,500" trend="+12.5%" icon={<DollarSign className="text-olive-600" />} />
                    <StatsCard title="Clean Claim Rate" value="94.2%" trend="+2.1%" icon={<ShieldCheck className="text-green-600" />} />
                    <StatsCard title="Denial Rate" value="4.8%" trend="-1.5%" icon={<AlertTriangle className="text-red-600" />} trendDown />
                    <StatsCard title="Avg Ref. Days" value="18 Days" trend="-2 Days" icon={<TrendingUp className="text-blue-600" />} trendDown />
                </div>

                <div className="grid grid-cols-3 gap-8">
                    {/* Recent Claims */}
                    <div className="col-span-2 bg-white rounded-2xl shadow-sm border border-olive-200 overflow-hidden flex flex-col">
                        <div className="p-6 border-b border-olive-100 flex justify-between items-center">
                            <h2 className="text-lg font-bold text-olive-900">Recent Claims</h2>
                            <span className="text-xs font-bold text-olive-500 uppercase tracking-widest cursor-pointer hover:text-olive-900 transition-colors">View All Claims →</span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-olive-50/50 text-olive-500 text-[10px] font-bold uppercase tracking-widest">
                                        <th className="px-6 py-4">Claim ID</th>
                                        <th className="px-6 py-4">Payer</th>
                                        <th className="px-6 py-4">Amount</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">Submission Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-olive-100">
                                    {[
                                        { id: "CLM-92384", payer: "Aetna (Commercial)", amount: "$4,200", status: "Submitted", date: "Jan 21, 2026" },
                                        { id: "CLM-92385", payer: "Medicare Part B", amount: "$1,850", status: "Pending", date: "Jan 21, 2026" },
                                        { id: "CLM-92386", payer: "Blue Cross Blue Shield", amount: "$12,400", status: "Denied", date: "Jan 20, 2026" },
                                        { id: "CLM-92387", payer: "Self Pay", amount: "$450", status: "Paid", date: "Jan 20, 2026" },
                                        { id: "CLM-92388", payer: "United Healthcare", amount: "$3,100", status: "Submitted", date: "Jan 19, 2026" },
                                    ].map((claim) => (
                                        <tr key={claim.id} className="hover:bg-olive-50/20">
                                            <td className="px-6 py-4 text-sm font-bold text-olive-900">{claim.id}</td>
                                            <td className="px-6 py-4 text-sm text-olive-700">{claim.payer}</td>
                                            <td className="px-6 py-4 text-sm font-bold text-olive-900">{claim.amount}</td>
                                            <td className="px-6 py-4">
                                                <BillingBadge status={claim.status} />
                                            </td>
                                            <td className="px-6 py-4 text-xs text-olive-500">{claim.date}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Payer Mix Chart Mock */}
                    <div className="bg-white rounded-2xl shadow-sm border border-olive-200 p-6 flex flex-col">
                        <h2 className="text-lg font-bold text-olive-900 mb-6">Payer Distribution</h2>
                        <div className="flex-1 flex flex-col items-center justify-center relative">
                            <div className="w-48 h-48 rounded-full border-[20px] border-olive-600 border-l-olive-200 border-b-olive-400 border-t-olive-800 rotate-45 transform"></div>
                            <div className="absolute flex flex-col items-center">
                                <span className="text-2xl font-black text-olive-950">$1.2M</span>
                                <span className="text-[10px] font-bold text-olive-500 uppercase">ARR in AR</span>
                            </div>
                        </div>
                        <div className="mt-8 space-y-3">
                            <LegendItem color="bg-olive-800" label="Medicare" pct="45%" />
                            <LegendItem color="bg-olive-600" label="Commercial" pct="30%" />
                            <LegendItem color="bg-olive-400" label="Government" pct="15%" />
                            <LegendItem color="bg-olive-200" label="Self Pay" pct="10%" />
                        </div>
                    </div>
                </div>

                {/* Audit & Denial Management Section */}
                <div className="grid grid-cols-2 gap-8">
                    <div className="bg-olive-900 rounded-2xl p-8 text-white relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="text-xl font-bold mb-4">Smart Denial Prevention</h3>
                            <p className="text-olive-200 text-sm mb-6 max-w-md">Our AI engine has flagged 14 potential denials in today's submission batch. Review them before transmission to maintain a high clean claim rate.</p>
                            <button className="px-6 py-3 bg-white text-olive-900 rounded-xl font-bold text-sm hover:bg-olive-100 transition-colors flex items-center gap-2">
                                Review Flags <ArrowUpRight size={18} />
                            </button>
                        </div>
                        <div className="absolute right-[-20px] bottom-[-20px] opacity-10">
                            <ShieldCheck size={200} />
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-olive-200 p-8 flex flex-col justify-center">
                        <div className="flex items-start gap-4">
                            <div className="bg-red-50 p-4 rounded-xl">
                                <AlertTriangle className="text-red-600" size={32} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-olive-900">Urgent: BCBS Credentialing</h3>
                                <p className="text-olive-600 text-sm mt-1">Provider Dr. Yuvraj Singh's BCBS credentials expire in 12 days. This will halt all BCBS claim submissions if not updated.</p>
                                <button className="mt-4 text-red-600 font-bold text-sm hover:underline">Clear Notification →</button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

function StatsCard({ title, value, trend, icon, trendDown }: any) {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-olive-200 group hover:border-olive-400 transition-all cursor-default">
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-olive-50 rounded-xl group-hover:bg-olive-100 transition-colors">
                    {icon}
                </div>
                <div className={`flex items-center gap-1 text-xs font-bold ${trendDown ? 'text-red-500' : 'text-green-500'}`}>
                    {trendDown ? <ArrowDownRight size={14} /> : <ArrowUpRight size={14} />}
                    {trend}
                </div>
            </div>
            <h3 className="text-sm font-medium text-olive-500 mb-1">{title}</h3>
            <p className="text-2xl font-bold text-olive-950">{value}</p>
        </div>
    );
}

function LegendItem({ color, label, pct }: any) {
    return (
        <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${color}`}></div>
                <span className="text-olive-700 font-medium">{label}</span>
            </div>
            <span className="font-bold text-olive-900">{pct}</span>
        </div>
    );
}

function BillingBadge({ status }: { status: string }) {
    const styles: any = {
        'Submitted': 'bg-blue-50 text-blue-700 border-blue-100',
        'Pending': 'bg-yellow-50 text-yellow-700 border-yellow-100',
        'Denied': 'bg-red-50 text-red-700 border-red-100',
        'Paid': 'bg-green-50 text-green-700 border-green-100',
    };
    return (
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${styles[status]}`}>
            {status}
        </span>
    );
}
