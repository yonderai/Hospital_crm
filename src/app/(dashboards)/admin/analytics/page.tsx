"use client";

import DashboardLayout from "@/components/DashboardLayout";
import {
    BarChart3,
    PieChart as PieChartIcon,
    TrendingUp,
    Users,
    DollarSign,
    Activity,
    Calendar,
    Filter,
    Download,
    ArrowUpRight,
    ArrowDownRight,
    ArrowRight,
    Target
} from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line
} from "recharts";

const performanceData = [
    { name: "Jan", revenue: 420000, efficiency: 88 },
    { name: "Feb", revenue: 480000, efficiency: 91 },
    { name: "Mar", revenue: 620000, efficiency: 86 },
    { name: "Apr", revenue: 580000, efficiency: 94 },
    { name: "May", revenue: 750000, efficiency: 97 },
    { name: "Jun", revenue: 820000, efficiency: 95 },
];

const demographicData = [
    { name: "Pediatrics", value: 25 },
    { name: "Adults", value: 55 },
    { name: "Geriatrics", value: 20 },
];

const COLORS = ["#6B8E23", "#0F172A", "#14B8A6", "#6366F1"];

export default function AnalyticsDashboard() {
    return (
        <DashboardLayout>
            <div className="space-y-10">
                {/* Header Section */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight italic uppercase">Enterprise Intelligence</h2>
                        <p className="text-slate-500 text-sm font-bold mt-1 uppercase tracking-[0.3em]">HOSPITAL ANALYTICS & INSIGHTS</p>
                    </div>
                    <div className="flex gap-4">
                        <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">
                            <Download size={16} /> Export Data
                        </button>
                        <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-teal-400 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-900/20 hover:bg-slate-800 transition-all">
                            <Filter size={16} /> Advanced Filters
                        </button>
                    </div>
                </div>

                {/* KPI Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <KPIComponent title="Lifetime Revenue" value="₹4.82M" change="+14.2%" up icon={DollarSign} />
                    <KPIComponent title="Active Patients" value="12,405" change="+5.7%" up icon={Users} />
                    <KPIComponent title="Avg. Length of Stay" value="4.2 Days" change="-0.8%" down icon={Activity} />
                    <KPIComponent title="Clinical Efficiency" value="96.4%" change="+2.1%" up icon={Target} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* Revenue & Efficiency Chart */}
                    <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-10 flex flex-col h-[500px]">
                        <div className="flex justify-between items-center mb-10">
                            <div>
                                <h3 className="text-xl font-black text-slate-900 tracking-tight">Financial Velocity</h3>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Monthly Revenue vs Efficiency Index</p>
                            </div>
                        </div>
                        <div className="flex-1 w-full mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={performanceData}>
                                    <defs>
                                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6B8E23" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#6B8E23" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} tick={{ fontWeight: 800 }} />
                                    <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} tick={{ fontWeight: 800 }} tickFormatter={(value) => `₹${value / 1000}k`} />
                                    <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontSize: '10px' }} />
                                    <Area type="monotone" dataKey="revenue" stroke="#6B8E23" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Department Performance List */}
                    <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-10 flex flex-col h-[500px]">
                        <div className="flex justify-between items-center mb-10">
                            <div>
                                <h3 className="text-xl font-black text-slate-900 tracking-tight">Clinical Hotspots</h3>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Real-time Department Utilization</p>
                            </div>
                        </div>
                        <div className="flex-1 space-y-6 overflow-y-auto pr-2">
                            <DeptPerf name="Emergency Medicine" load={92} capacity="High" />
                            <DeptPerf name="Intensive Care (ICU)" load={78} capacity="Stable" />
                            <DeptPerf name="Radiology & Imaging" load={64} capacity="Healthy" />
                            <DeptPerf name="Surgical Theatre" load={85} capacity="Busy" />
                            <DeptPerf name="Outpatient Clinic" load={45} capacity="Low" />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Demographics */}
                    <div className="bg-[#0F172A] rounded-[40px] p-10 text-white shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[400px]">
                        <div className="relative z-10 space-y-8">
                            <div className="flex items-center gap-3">
                                <Users className="text-teal-400" size={24} />
                                <h4 className="text-xl font-black tracking-tight leading-none uppercase italic border-l-2 border-teal-500 pl-4">Patient Locus</h4>
                            </div>

                            <div className="flex-1 flex items-center justify-center relative py-6">
                                <ResponsiveContainer width="100%" height={180}>
                                    <PieChart>
                                        <Pie data={demographicData} innerRadius={50} outerRadius={80} paddingAngle={10} dataKey="value">
                                            {demographicData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', fontSize: '10px' }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                {demographicData.map((d, i) => (
                                    <div key={i} className="text-center">
                                        <p className="text-lg font-black">{d.value}%</p>
                                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{d.name}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <CircleDecor className="absolute bottom-[-10%] right-[-10%] text-white/5" />
                    </div>

                    {/* Operational Insights */}
                    <div className="lg:col-span-2 bg-white rounded-[40px] border border-slate-100 shadow-sm p-10">
                        <h3 className="text-xl font-black text-slate-900 tracking-tight mb-8">System Directives</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <DirectiveCard
                                title="Revenue Optimization"
                                desc="Claim denial rate decreased by 4.2% following AI automated pre-scrubbing. Recommended: Increase Payer EDI audits."
                                priority="High"
                            />
                            <DirectiveCard
                                title="Capacity Advisory"
                                desc="ER flow predicted to surge by 15% in next 48h. Recommended: Transition ward 2B to flexible surge staffing."
                                priority="Critical"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

function KPIComponent({ title, value, change, up, icon: Icon }: any) {
    return (
        <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm group hover:border-olive-400 transition-all flex flex-col justify-between">
            <div className={`p-4 bg-slate-50 text-slate-400 rounded-3xl w-14 h-14 flex items-center justify-center group-hover:bg-olive-600 group-hover:text-white transition-all`}>
                <Icon size={24} />
            </div>
            <div className="mt-8">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
                <div className="flex items-end justify-between">
                    <p className="text-4xl font-black text-slate-900 tracking-tighter">{value}</p>
                    <div className={`flex items-center gap-0.5 text-[10px] font-black ${up ? 'text-green-600' : 'text-red-600'}`}>
                        {change} {up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    </div>
                </div>
            </div>
        </div>
    );
}

function DeptPerf({ name, load, capacity }: any) {
    return (
        <div className="flex items-center justify-between p-5 bg-slate-50/50 rounded-3xl border border-slate-100 hover:bg-white transition-all">
            <div className="flex-1 space-y-2">
                <div className="flex justify-between items-center pr-4">
                    <p className="text-xs font-black text-slate-800 uppercase tracking-widest">{name}</p>
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${capacity === 'High' ? 'bg-red-50 text-red-600' : capacity === 'Busy' ? 'bg-orange-50 text-orange-600' : 'bg-olive-50 text-olive-600'}`}>
                        {capacity}
                    </span>
                </div>
                <div className="w-full h-1.5 bg-slate-200/50 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${load > 85 ? 'bg-red-500' : load > 70 ? 'bg-orange-500' : 'bg-olive-600'}`} style={{ width: `${load}%` }} />
                </div>
            </div>
            <div className="ml-6 text-right">
                <p className="text-lg font-black text-slate-900 leading-none">{load}%</p>
                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter mt-1">Load Factor</p>
            </div>
        </div>
    );
}

function DirectiveCard({ title, desc, priority }: any) {
    return (
        <div className="p-8 rounded-[32px] border border-slate-100 bg-slate-50/50 hover:bg-white transition-all group">
            <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">{title}</h4>
                <span className={`text-[8px] font-black px-2 py-1 rounded-full uppercase ${priority === 'Critical' ? 'bg-red-500 text-white' : 'bg-slate-900 text-teal-400'}`}>
                    {priority}
                </span>
            </div>
            <p className="text-xs text-slate-500 font-medium leading-relaxed italic">"{desc}"</p>
            <button className="flex items-center gap-2 text-[9px] font-black text-olive-700 uppercase tracking-widest mt-6 group-hover:underline">
                View Intervention Plan <ArrowRight size={12} />
            </button>
        </div>
    );
}

const CircleDecor = ({ className }: { className: string }) => (
    <div className={className}>
        <div className="w-64 h-64 border-[32px] border-white/5 rounded-full" />
    </div>
);
