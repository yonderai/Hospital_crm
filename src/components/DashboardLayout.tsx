import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import {
    Heart,
    LayoutGrid,
    Users,
    Calendar,
    FileText,
    Beaker,
    Package,
    DollarSign,
    ShieldCheck,
    Activity,
    LogOut,
    Bell,
    Search,
    Settings,
    BarChart3,
    Aperture,
    Wrench,
    Wind,
    FlaskConical
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { data: session } = useSession();
    const pathname = usePathname();

    // Demo Mode Fallback: Use sessionStorage if no real session exists
    const [demoState, setDemoState] = useState<{ role: string, name: string } | null>(null);

    useEffect(() => {
        const storedRole = sessionStorage.getItem("userRole");
        const storedName = sessionStorage.getItem("userName");
        if (storedRole) {
            setDemoState({ role: storedRole, name: storedName || "Demo User" });
        }
    }, []);

    const role = (session?.user as any)?.role || demoState?.role || "doctor";
    const userName = session?.user?.name || demoState?.name || "Initializing...";

    const navigation = [
        { name: "Overview", href: `/${role}/dashboard`, icon: LayoutGrid },
        { name: "Patients", href: `/${role}/patients`, icon: Users },
        { name: "Schedule", href: `/${role}/schedule`, icon: Calendar },
        { name: "Clinical", href: `/${role}/clinical`, icon: FileText },
        { name: "Surgery", href: `/${role}/or-management`, icon: Activity },
        { name: "ICU Tracking", href: `/${role}/icu-tracking`, icon: Wind },
        { name: "Laboratory", href: `/lab/dashboard`, icon: Beaker },
        { name: "Pharmacy", href: `/${role}/pharmacy`, icon: Package },
        { name: "Billing", href: `/${role}/billing`, icon: DollarSign },
        { name: "Radiology", href: `/${role}/radiology`, icon: Aperture },
        { name: "Engineering", href: `/assets/dashboard`, icon: Wrench },
        { name: "HR", href: `/hr/dashboard`, icon: Users },
        { name: "Research", href: `/admin/research`, icon: FlaskConical },
        { name: "Compliance", href: `/admin/compliance`, icon: ShieldCheck },
        { name: "Analytics", href: `/${role}/analytics`, icon: BarChart3 },
    ];

    return (
        <div className="flex h-screen bg-[#F8FAFC]">
            {/* SIDEBAR (Dark Navy #0F172A) */}
            <aside className="w-72 bg-[#0F172A] p-8 flex flex-col justify-between border-r border-slate-800">
                <div className="space-y-12">
                    {/* Logo */}
                    <Link href={`/${role}/dashboard`} className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-tr from-olive-600 to-olive-400 rounded-xl flex items-center justify-center">
                            <Heart className="text-white" size={24} fill="currentColor" />
                        </div>
                        <div>
                            <h1 className="text-xl font-black text-white tracking-tighter uppercase leading-none">Medicore</h1>
                            <p className="text-[8px] font-bold text-olive-400 tracking-[0.4em] uppercase mt-1">Enterprise</p>
                        </div>
                    </Link>

                    {/* Navigation */}
                    <nav className="space-y-2">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${isActive
                                        ? "bg-olive-500/10 text-olive-400 border border-olive-500/20"
                                        : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                                        }`}
                                >
                                    <item.icon size={20} className={isActive ? "text-olive-400" : "text-slate-500 group-hover:text-slate-300"} />
                                    <span className="text-sm font-bold tracking-tight">{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Bottom Actions */}
                <div className="space-y-6">
                    <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-olive-600 flex items-center justify-center text-white font-black text-xs uppercase shadow-lg shadow-olive-600/20">
                                {userName?.[0] || "U"}
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <p className="text-sm font-bold text-white truncate">{userName}</p>
                                <p className="text-[10px] font-bold text-olive-500 uppercase tracking-widest">{role}</p>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            sessionStorage.clear();
                            signOut({ callbackUrl: "/login" });
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/5 rounded-xl transition-all border border-transparent hover:border-red-500/10"
                    >
                        <LogOut size={20} />
                        <span className="text-sm font-bold tracking-tight uppercase tracking-widest">Terminate Session</span>
                    </button>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Header */}
                <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between">
                    <div className="flex items-center gap-4 bg-slate-50 border border-slate-100 px-4 py-2.5 rounded-2xl w-96">
                        <Search size={18} className="text-slate-400" />
                        <input
                            type="text"
                            placeholder="Omni Search (Patients, Records, Orders...)"
                            className="bg-transparent border-none outline-none text-sm font-medium text-slate-900 w-full placeholder:text-slate-400"
                        />
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex gap-2">
                            <button className="p-2.5 bg-slate-50 text-slate-500 hover:text-slate-900 rounded-xl transition-all relative">
                                <Bell size={20} />
                                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                            </button>
                            <button className="p-2.5 bg-slate-50 text-slate-500 hover:text-slate-900 rounded-xl transition-all">
                                <Settings size={20} />
                            </button>
                        </div>
                        <div className="h-8 w-px bg-slate-100" />
                        <div className="flex items-center gap-3">
                            <div className="text-right">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">System Node</p>
                                <p className="text-xs font-bold text-slate-900">Medicore-α-01</p>
                            </div>
                            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-olive-400 border border-slate-800 shadow-xl shadow-slate-900/10">
                                <ShieldCheck size={20} />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Dashboard Area */}
                <main className="flex-1 overflow-y-auto p-12">
                    {children}
                </main>

                {/* Internal Footer Statistics */}
                <footer className="h-10 bg-white border-t border-slate-100 px-8 flex items-center justify-between">
                    <div className="flex gap-8">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-olive-500"></div>
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Sentinel-X ACTIVE</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Activity size={12} className="text-slate-400" />
                            <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Network Latency: 42ms</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-olive-50 rounded-full border border-olive-100">
                        <ShieldCheck size={10} className="text-olive-600" />
                        <span className="text-[9px] font-bold text-olive-700 uppercase tracking-widest">Encrypted Clinical Hub</span>
                    </div>
                </footer>
            </div>
        </div>
    );
}
