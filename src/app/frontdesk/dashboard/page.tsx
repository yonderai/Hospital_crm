"use client";

import { Calendar, Clock, User, CheckCircle, XCircle, AlertCircle, Plus, Search, Filter } from "lucide-react";

const appointments = [
    { id: 1, patient: "Alice Cooper", time: "09:00 AM", type: "Follow up", provider: "Dr. Smith", status: "Checked-in" },
    { id: 2, patient: "Bob Marley", time: "09:30 AM", type: "New Patient", provider: "Dr. Singh", status: "Waiting" },
    { id: 3, patient: "Charlie Brown", time: "10:00 AM", type: "Annual Physical", provider: "Dr. Smith", status: "Confirmed" },
    { id: 4, patient: "Diana Ross", time: "10:45 AM", type: "Consultation", provider: "Dr. Adams", status: "Delayed" },
    { id: 5, patient: "Elvis Presley", time: "11:30 AM", type: "Vaccination", provider: "Dr. Singh", status: "Scheduled" },
];

export default function FrontDeskDashboard() {
    return (
        <div className="flex flex-col h-screen bg-olive-50">
            {/* Top Nav */}
            <header className="bg-white border-b border-olive-200 h-16 flex items-center justify-between px-6 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="bg-olive-600 p-2 rounded-lg">
                        <Calendar className="text-white" size={20} />
                    </div>
                    <h1 className="text-xl font-bold text-olive-900 font-serif">Front Desk Dashboard</h1>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-olive-400" />
                        <input
                            type="text"
                            placeholder="Search patients..."
                            className="pl-10 pr-4 py-2 bg-olive-50 border border-olive-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-olive-500 w-64"
                        />
                    </div>
                    <button className="bg-olive-600 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-olive-700 transition-all shadow-md">
                        <Plus size={16} /> New Appointment
                    </button>
                </div>
            </header>

            <main className="flex-1 p-6 overflow-hidden flex gap-6">
                {/* Left Side: Stats & Filters */}
                <div className="w-80 flex flex-col gap-6">
                    <div className="bg-white rounded-xl shadow-sm border border-olive-200 p-6">
                        <h2 className="text-sm font-bold text-olive-800 uppercase tracking-widest mb-4">Today's Overview</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-olive-50 p-4 rounded-lg border border-olive-100">
                                <span className="text-[10px] font-bold text-olive-500 block">TOTAL</span>
                                <span className="text-2xl font-bold text-olive-900">24</span>
                            </div>
                            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                                <span className="text-[10px] font-bold text-green-600 block">ARRIVED</span>
                                <span className="text-2xl font-bold text-green-700">12</span>
                            </div>
                            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                                <span className="text-[10px] font-bold text-yellow-600 block">PENDING</span>
                                <span className="text-2xl font-bold text-yellow-700">8</span>
                            </div>
                            <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                                <span className="text-[10px] font-bold text-red-600 block">CANCEL</span>
                                <span className="text-2xl font-bold text-red-700">4</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-olive-200 p-6 flex-1 overflow-y-auto">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-sm font-bold text-olive-800 uppercase tracking-widest">Filters</h2>
                            <Filter size={14} className="text-olive-400" />
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-bold text-olive-500 block mb-2">PROVIDER</label>
                                <select className="w-full bg-olive-50 border border-olive-200 rounded p-2 text-sm text-olive-800">
                                    <option>All Providers</option>
                                    <option>Dr. Singh</option>
                                    <option>Dr. Smith</option>
                                    <option>Dr. Adams</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-olive-500 block mb-2">APPOINTMENT TYPE</label>
                                <div className="space-y-2">
                                    {['Check-up', 'Emergency', 'Surgery', 'Virtual'].map(t => (
                                        <label key={t} className="flex items-center gap-2 cursor-pointer group">
                                            <input type="checkbox" className="accent-olive-600" />
                                            <span className="text-sm text-olive-700 group-hover:text-olive-900">{t}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Middle: Appointment List */}
                <div className="flex-1 bg-white rounded-xl shadow-sm border border-olive-200 flex flex-col overflow-hidden">
                    <div className="p-6 border-b border-olive-100 flex items-center justify-between">
                        <div className="flex gap-4 items-center">
                            <button className="text-sm font-bold text-olive-900 border-b-2 border-olive-600 pb-1">Queue View</button>
                            <button className="text-sm font-medium text-olive-400 hover:text-olive-600 pb-1">Calendar View</button>
                        </div>
                        <div className="text-sm text-olive-500 font-medium italic">
                            Thursday, Jan 22, 2026
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-olive-50/50 text-olive-500 text-[10px] font-bold uppercase tracking-wider">
                                    <th className="px-6 py-3">Time</th>
                                    <th className="px-6 py-3">Patient</th>
                                    <th className="px-6 py-3">Provider</th>
                                    <th className="px-6 py-3">Type</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-olive-100">
                                {appointments.map((apt) => (
                                    <tr key={apt.id} className="hover:bg-olive-50/30 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-olive-900 font-semibold">
                                                <Clock size={14} className="text-olive-400" />
                                                {apt.time}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-olive-100 flex items-center justify-center text-olive-600 font-bold text-xs">
                                                    {apt.patient[0]}
                                                </div>
                                                <div className="text-sm font-bold text-olive-900">{apt.patient}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-olive-700">{apt.provider}</td>
                                        <td className="px-6 py-4">
                                            <span className="text-xs bg-olive-100 text-olive-700 px-2 py-0.5 rounded-full font-medium">
                                                {apt.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <StatusBadge status={apt.status} />
                                        </td>
                                        <td className="px-6 py-4">
                                            <button className="text-olive-400 hover:text-olive-600 flex items-center gap-1 font-semibold text-xs">
                                                Details →
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Right Side: Quick Actions / Notifications */}
                <div className="w-80 flex flex-col gap-6">
                    <div className="bg-white rounded-xl shadow-sm border border-olive-200 p-6">
                        <h2 className="text-sm font-bold text-olive-800 uppercase tracking-widest mb-4">Quick Patient Add</h2>
                        <div className="space-y-4">
                            <input className="w-full bg-olive-50 border border-olive-200 rounded p-2 text-sm outline-none focus:border-olive-400" placeholder="First Name" />
                            <input className="w-full bg-olive-50 border border-olive-200 rounded p-2 text-sm outline-none focus:border-olive-400" placeholder="Last Name" />
                            <input className="w-full bg-olive-50 border border-olive-200 rounded p-2 text-sm outline-none focus:border-olive-400" placeholder="Phone Number" />
                            <button className="w-full bg-olive-100 text-olive-700 py-2 rounded-lg text-sm font-bold hover:bg-olive-200 transition-all">
                                Register for Triage
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-olive-200 p-6 flex-1 overflow-y-auto">
                        <h2 className="text-sm font-bold text-olive-800 uppercase tracking-widest mb-4">Notifications</h2>
                        <div className="space-y-3">
                            <div className="flex gap-3 p-2 hover:bg-olive-50 rounded transition-colors border-l-2 border-red-400 bg-red-50/30">
                                <AlertCircle className="text-red-500 shrink-0" size={16} />
                                <div>
                                    <p className="text-xs font-bold text-olive-900">Lab Results Ready</p>
                                    <p className="text-[10px] text-olive-600">Patient John Doe (Rm 4B) results are back.</p>
                                </div>
                            </div>
                            <div className="flex gap-3 p-2 hover:bg-olive-50 rounded transition-colors border-l-2 border-yellow-400">
                                <Clock className="text-yellow-500 shrink-0" size={16} />
                                <div>
                                    <p className="text-xs font-bold text-olive-900">Dr. Smith Delayed</p>
                                    <p className="text-[10px] text-olive-600">Expected 15m delay due to ER consult.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="h-8 bg-olive-900 text-olive-100 px-6 flex items-center justify-between text-[10px] uppercase font-bold tracking-widest">
                <span>Terminal: Front Desk - North Wing</span>
                <span>Version 4.2.0-stable</span>
            </footer>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    switch (status) {
        case 'Checked-in':
            return <div className="flex items-center gap-1.5 text-green-600 font-bold text-xs bg-green-50 px-2 py-0.5 rounded-full border border-green-100"><CheckCircle size={12} /> Checked-in</div>;
        case 'Waiting':
            return <div className="flex items-center gap-1.5 text-blue-600 font-bold text-xs bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100"><Clock size={12} /> In Waiting</div>;
        case 'Delayed':
            return <div className="flex items-center gap-1.5 text-red-600 font-bold text-xs bg-red-50 px-2 py-0.5 rounded-full border border-red-100"><AlertCircle size={12} /> Delayed</div>;
        default:
            return <div className="flex items-center gap-1.5 text-olive-500 font-bold text-xs bg-olive-100 px-2 py-0.5 rounded-full border border-olive-200">Scheduled</div>;
    }
}
