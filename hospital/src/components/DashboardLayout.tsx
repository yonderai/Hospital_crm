"use client";

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

    // Detect role from pathname if not in session/demoState
    const pathRole = pathname?.split('/')[1];
    const role = (session?.user as any)?.role || demoState?.role || (["doctor", "nurse", "admin", "front-desk", "patient", "lab-tech", "pharmacist", "billing", "hr", "inventory"].includes(pathRole) ? pathRole : "doctor");
    const userName = session?.user?.name || demoState?.name || "Initializing...";

    // Role-based navigation mapping
    const navConfig: Record<string, string[]> = {
        doctor: ["Overview", "Patients", "Schedule", "Clinical", "Surgery", "ICU Tracking", "Laboratory", "Pharmacy", "Radiology", "Analytics"],
        nurse: ["Overview", "Patients", "Schedule", "Clinical", "ICU Tracking", "Laboratory"],
        admin: ["Overview", "Analytics", "Compliance", "HR", "Finance", "Settings", "Audit Logs"],
        "front-desk": ["Overview", "Patients", "Schedule", "Billing"],
        patient: ["Overview", "Schedule", "Clinical", "Pharmacy", "Billing"],
        "lab-tech": ["Overview", "Laboratory", "Research"],
        pharmacist: ["Overview", "Pharmacy", "Inventory"],
        billing: ["Overview", "Billing", "Analytics"],
        hr: ["Overview", "HR", "Compliance"],
        inventory: ["Overview", "Inventory", "Pharmacy"]
    };

    const navigationItems = [
        { name: "Overview", href: `/${role}/dashboard`, icon: LayoutGrid },
        { name: "Patients", href: `/${role}/patients`, icon: Users },
        { name: "Schedule", href: `/${role}/schedule`, icon: Calendar },
        { name: "Clinical", href: `/${role}/clinical`, icon: FileText },
        { name: "Surgery", href: `/${role}/or-management`, icon: Activity },
        { name: "ICU Tracking", href: `/${role}/icu-tracking`, icon: Wind },
        { name: "Laboratory", href: `/${role}/laboratory`, icon: Beaker },
        { name: "Pharmacy", href: `/${role}/pharmacy`, icon: Package },
        { name: "Billing", href: `/${role}/billing`, icon: DollarSign },
        { name: "Finance", href: `/${role}/finance`, icon: DollarSign },
        { name: "Radiology", href: `/${role}/radiology`, icon: Aperture },
        { name: "Engineering", href: `/${role}/engineering`, icon: Wrench },
        { name: "HR", href: `/${role}/hr`, icon: Users },
        { name: "Research", href: `/${role}/research`, icon: FlaskConical },
        { name: "Compliance", href: `/${role}/compliance`, icon: ShieldCheck },
        { name: "Analytics", href: `/${role}/analytics`, icon: BarChart3 },
        { name: "Inventory", href: `/${role}/inventory`, icon: Package },
        { name: "Settings", href: `/${role}/settings`, icon: Settings },
        { name: "Audit Logs", href: `/${role}/audit`, icon: FileText },
    ];

    const navigation = navigationItems.filter(item =>
        navConfig[role]?.includes(item.name)
    );

    return (
        <div className="flex h-screen w-full bg-[#F8FAFC] overflow-hidden">
            {/* SIDEBAR (Light Olive #F5F7F0) */}
            <aside className="w-72 bg-olive-50 flex flex-col border-r border-olive-200 h-full shrink-0">
                {/* Scrollable Navigation Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    {/* Logo */}
                    <Link href={`/${role}/dashboard`} className="flex items-center gap-3 px-2">
                        <div className="w-10 h-10 bg-gradient-to-tr from-olive-600 to-olive-400 rounded-xl flex items-center justify-center shadow-lg shadow-olive-600/20">
                            <Heart className="text-white" size={24} fill="currentColor" />
                        </div>
                        <div>
                            <h1 className="text-xl font-black text-olive-900 tracking-tighter uppercase leading-none">Medicore</h1>
                            <p className="text-[8px] font-bold text-olive-600 tracking-[0.4em] uppercase mt-1">Enterprise</p>
                        </div>
                    </Link>

                    {/* Navigation */}
                    <nav className="space-y-1.5">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${isActive
                                        ? "bg-olive-600 text-white shadow-lg shadow-olive-600/20"
                                        : "text-slate-500 hover:text-olive-900 hover:bg-olive-100"
                                        }`}
                                >
                                    <item.icon size={20} className={isActive ? "text-olive-100" : "text-slate-400 group-hover:text-olive-700"} />
                                    <span className="text-sm font-bold tracking-tight">{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Logout Button */}
                <div className="p-6 border-t border-olive-200 mt-auto">
                    <button
                        onClick={() => {
                            sessionStorage.clear();
                            signOut({ callbackUrl: "/login" });
                        }}
                        className="flex items-center gap-3 text-red-500 hover:text-red-700 transition-colors font-bold text-sm"
                    >
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <div className="flex-1 flex flex-col h-full overflow-hidden relative">
                {/* Top Header */}
                <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between shrink-0 z-10">
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

                        {/* User Profile & Logout */}
                        <div className="flex items-center gap-4">
                            <div className="text-right hidden md:block">
                                <p className="text-sm font-bold text-slate-900 leading-none">{userName}</p>
                                <p className="text-[10px] font-black text-olive-600 uppercase tracking-widest mt-1">{role}</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-olive-100 flex items-center justify-center text-olive-700 font-black text-sm uppercase ring-2 ring-white shadow-sm">
                                {userName?.[0] || "U"}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Dashboard Area */}
                <main className="flex-1 overflow-y-auto p-12 scroll-smooth">
                    {children}
                </main>

                {/* Internal Footer Statistics */}
                <footer className="h-10 bg-white border-t border-slate-100 px-8 flex items-center justify-between shrink-0 z-10">
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
