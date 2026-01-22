"use client";

import { User, Calendar, FileText, MessageSquare, BookOpen, Activity, Play, Bell, CreditCard, ChevronRight, PlusCircle } from "lucide-react";

export default function PatientPortal() {
    return (
        <div className="flex flex-col min-h-screen bg-[#fafaf6] font-sans">
            {/* Portal Header */}
            <header className="bg-white border-b border-olive-100 h-20 flex items-center justify-between px-12 sticky top-0 z-50">
                <div className="flex items-center gap-8">
                    <h1 className="text-2xl font-black text-olive-900 tracking-tighter">YONDER<span className="text-olive-600 font-light italic">CARE</span></h1>
                    <nav className="flex gap-6 text-sm font-semibold text-olive-500">
                        <button className="text-olive-900 border-b-2 border-olive-900 pb-1">Dashboard</button>
                        <button className="hover:text-olive-700 transition-colors">My Records</button>
                        <button className="hover:text-olive-700 transition-colors">Billing</button>
                        <button className="hover:text-olive-700 transition-colors">Education</button>
                    </nav>
                </div>
                <div className="flex items-center gap-6">
                    <div className="relative p-2 bg-olive-50 rounded-full text-olive-600 hover:bg-olive-100 transition-colors cursor-pointer">
                        <Bell size={20} />
                        <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                    </div>
                    <div className="flex items-center gap-3 pl-6 border-l border-olive-100">
                        <div className="text-right">
                            <p className="text-xs font-bold text-olive-950">Johnathan Doe</p>
                            <p className="text-[10px] text-olive-500">Member ID: 8820-A</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-olive-200 border-2 border-white shadow-sm overflow-hidden flex items-center justify-center">
                            <User className="text-olive-600" />
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-1 w-full max-w-7xl mx-auto p-12 space-y-12">
                {/* Welcome Banner */}
                <section className="bg-olive-900 rounded-[32px] p-12 text-white relative overflow-hidden flex items-center justify-between">
                    <div className="relative z-10 max-w-lg space-y-6">
                        <h2 className="text-4xl font-bold font-serif leading-tight">Good morning, Johnathan.</h2>
                        <p className="text-olive-200 text-lg leading-relaxed">
                            You have an upcoming appointment today at <span className="text-white font-bold underline decoration-olive-400">02:30 PM</span> with Dr. Yuvraj Singh.
                        </p>
                        <div className="flex gap-4">
                            <button className="px-8 py-4 bg-white text-olive-900 rounded-2xl font-bold flex items-center gap-2 hover:bg-olive-100 transition-all shadow-xl">
                                Schedule New <PlusCircle size={20} />
                            </button>
                            <button className="px-8 py-4 bg-olive-800 text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-olive-700 transition-all border border-olive-700">
                                Join Televisit <Play size={20} fill="currentColor" />
                            </button>
                        </div>
                    </div>
                    <div className="relative z-10 grid grid-cols-2 gap-4 w-96">
                        <PortalStat title="Next Vitals" value="Today" sub="Jan 22" />
                        <PortalStat title="Messages" value="03" sub="Unread" />
                        <PortalStat title="Bills Due" value="$42" sub="Pay now" />
                        <PortalStat title="Labs" value="Ready" sub="View results" />
                    </div>
                    {/* Background Decor */}
                    <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
                        <Activity size={400} strokeWidth={0.5} className="translate-x-1/2 -translate-y-1/4" />
                    </div>
                </section>

                {/* Content Tabs Grid */}
                <div className="grid grid-cols-3 gap-12">
                    {/* Appointments */}
                    <div className="col-span-2 space-y-8">
                        <div className="flex items-center justify-between">
                            <h3 className="text-2xl font-bold text-olive-900 flex items-center gap-3">
                                <Calendar size={24} className="text-olive-600" /> Upcoming Interactions
                            </h3>
                            <button className="text-sm font-bold text-olive-500 hover:text-olive-700">View History →</button>
                        </div>
                        <div className="space-y-4">
                            <InteractionCard
                                title="Comprehensive Wellness Visit"
                                date="Jan 22, 2026"
                                time="02:30 PM"
                                provider="Dr. Yuvraj Singh"
                                location="Virtual / Televisit"
                                active
                            />
                            <InteractionCard
                                title="Lab Visit: Blood Panel"
                                date="Feb 05, 2026"
                                time="08:00 AM"
                                provider="Main Lab Center"
                                location="North Wing, Level 2"
                            />
                        </div>

                        <div className="pt-8">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-2xl font-bold text-olive-900 flex items-center gap-3">
                                    <BookOpen size={24} className="text-olive-600" /> Recommended Education
                                </h3>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <EducationCard
                                    title="Managing Type 2 Diabetes"
                                    desc="Tips for nutrition and glucose monitoring..."
                                    category="Endocrinology"
                                />
                                <EducationCard
                                    title="High Blood Pressure Guide"
                                    desc="Understanding your readings and medications..."
                                    category="Cardiology"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Modules */}
                    <div className="space-y-10">
                        <div className="bg-white p-8 rounded-[24px] shadow-sm border border-olive-100 flex flex-col gap-6 font-serif">
                            <div className="flex items-center justify-between">
                                <h4 className="text-lg font-bold text-olive-900 italic">Bill Summary</h4>
                                <CreditCard size={20} className="text-olive-400" />
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-olive-500">Current Balance</span>
                                    <span className="font-bold text-olive-900">$425.00</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-olive-500">Upcoming Deductible</span>
                                    <span className="font-bold text-olive-900">$1,200.00</span>
                                </div>
                            </div>
                            <button className="w-full bg-olive-900 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-olive-950 transition-all">Make a Payment</button>
                        </div>

                        <div className="bg-white p-8 rounded-[24px] shadow-sm border border-olive-100 flex flex-col gap-6">
                            <h4 className="text-lg font-bold text-olive-900 flex items-center gap-2">
                                <MessageSquare size={20} className="text-olive-600" /> Direct Messages
                            </h4>
                            <div className="space-y-4">
                                <div className="flex gap-4 p-3 bg-olive-50 rounded-xl hover:bg-olive-100 transition-colors cursor-pointer group">
                                    <div className="w-10 h-10 rounded-full bg-olive-600 flex items-center justify-center shrink-0">
                                        <User size={18} className="text-white" />
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-sm font-bold text-olive-900">Dr. Yuvraj Singh</p>
                                        <p className="text-xs text-olive-500 truncate">Your lab results look promising. Let's discuss...</p>
                                    </div>
                                </div>
                                <div className="flex gap-4 p-3 hover:bg-olive-50 rounded-xl transition-colors cursor-pointer group">
                                    <div className="w-10 h-10 rounded-full bg-olive-200 flex items-center justify-center shrink-0">
                                        <User size={18} className="text-olive-700" />
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-sm font-bold text-olive-900">Front Desk</p>
                                        <p className="text-xs text-olive-500 truncate">Please confirm your insurance update...</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="bg-olive-950 py-16 text-white mt-12">
                <div className="max-w-7xl mx-auto px-12 grid grid-cols-4 gap-12">
                    <div className="space-y-4">
                        <h1 className="text-xl font-black">YONDER<span className="text-olive-400 font-light italic">CARE</span></h1>
                        <p className="text-xs text-olive-400 leading-relaxed">Advanced Healthcare ERP & Patient Experience Platform. Secure, HIPAA-compliant patient communication.</p>
                    </div>
                    {['Services', 'Records', 'Legal', 'Support'].map(col => (
                        <div key={col} className="space-y-4">
                            <h5 className="font-bold text-olive-200 uppercase tracking-widest text-xs">{col}</h5>
                            <ul className="space-y-2 text-xs text-olive-500">
                                <li>Link One</li>
                                <li>Link Two</li>
                                <li>Link Three</li>
                            </ul>
                        </div>
                    ))}
                </div>
            </footer>
        </div>
    );
}

function PortalStat({ title, value, sub }: any) {
    return (
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 hover:bg-white/20 transition-all cursor-default">
            <h5 className="text-[10px] font-bold text-olive-300 uppercase mb-1">{title}</h5>
            <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black">{value}</span>
                <span className="text-[10px] text-olive-400 font-medium">{sub}</span>
            </div>
        </div>
    );
}

function InteractionCard({ title, date, time, provider, location, active }: any) {
    return (
        <div className={`p-8 rounded-[24px] shadow-sm border flex items-center justify-between group cursor-pointer transition-all ${active ? 'bg-white border-olive-900 ring-2 ring-olive-900 ring-offset-4 ring-offset-[#fafaf6]' : 'bg-white border-olive-100 hover:border-olive-300'}`}>
            <div className="flex items-center gap-8">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transform group-hover:rotate-6 transition-transform ${active ? 'bg-olive-900 text-white' : 'bg-olive-100 text-olive-600'}`}>
                    <Calendar size={28} />
                </div>
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <h4 className={`text-xl font-bold ${active ? 'text-olive-900' : 'text-olive-700'}`}>{title}</h4>
                        {active && <span className="text-[10px] bg-red-500 text-white px-2 py-0.5 rounded-full font-bold uppercase animate-pulse">In 2 Hours</span>}
                    </div>
                    <div className="flex gap-6 text-sm text-olive-500 font-medium font-serif italic">
                        <span>{date} @ {time}</span>
                        <span>{provider}</span>
                        <span>{location}</span>
                    </div>
                </div>
            </div>
            <ChevronRight className="text-olive-200 group-hover:text-olive-900 transform group-hover:translate-x-1 transition-all" size={24} />
        </div>
    );
}

function EducationCard({ title, desc, category }: any) {
    return (
        <div className="bg-white p-6 rounded-[24px] border border-olive-100 hover:border-olive-600 transition-all group flex flex-col gap-4">
            <div className="h-40 bg-olive-50 rounded-2xl flex items-center justify-center relative overflow-hidden group-hover:bg-olive-100 transition-colors">
                <BookOpen size={48} className="text-olive-200 group-hover:scale-110 transition-transform" />
                <span className="absolute top-4 left-4 text-[10px] font-bold text-olive-400 uppercase tracking-widest">{category}</span>
            </div>
            <div>
                <h4 className="font-bold text-olive-900 group-hover:underline transition-all">{title}</h4>
                <p className="text-xs text-olive-500 mt-1 leading-relaxed">{desc}</p>
            </div>
        </div>
    );
}
