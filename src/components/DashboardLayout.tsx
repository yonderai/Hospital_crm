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
    FlaskConical,
    Scissors,
    Pill,
    Microscope
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

    // Priority: Session Role -> Demo Role -> Path Role (if valid) -> Fallback
    const role = (session?.user as any)?.role || demoState?.role ||
        (["doctor", "nurse", "admin", "frontdesk", "patient", "labtech", "pharmacy_inventory", "billing", "hr"].includes(pathRole) ? pathRole : "doctor");
    const userName = session?.user?.name || demoState?.name || "Initializing...";

    // Role-based navigation mapping - Strictly separated as per requirements
    const navConfig: Record<string, string[]> = {
        doctor: ["Overview", "Patients", "Schedule", "Clinical", "Surgery", "ICU Tracking", "Laboratory", "Pharmacy", "Radiology", "Analytics"],
        pharmacy_inventory: ["Overview", "Dispensing", "Inventory", "Batch & Expiry", "Usage Reports", "Procurement"], // Unified Pharmacy & Inventory
        labtech: ["Overview", "Test Scheduling", "Sample Tracking", "Processing Status", "Digital Reports"], // Diagnostics Hub
        frontdesk: ["Overview", "Registration", "Queue", "Bed Allocation", "Appointments", "Insurance Triage", "Fee Collection"], // Front Desk
        nurse: ["Overview", "Duty Roster", "Assigned Patients", "Ward Management", "ICU Monitor", "Clinical Updates"], // Nurse Portal
        billing: ["Overview", "Cash Payments", "Card/UPI", "Insurance Pre-Auth", "Claims Management", "Split Billing", "Invoices"], // Revenue Office
        finance: ["Overview", "Procurement", "Expenses", "Payroll", "CapEx", "Assets"], // Back Office / Finance Needs Verification if Role Exists
        patient: ["Overview", "Medical Wallet", "Report Viewer", "e-Prescriptions", "Booking", "Queue Status", "Billing & Invoices"], // Patient Portal
        hr: ["Overview", "Staff Management", "Rosters & Attendance", "Complaints", "Compliance", "Payroll Integration"], // HR Module
        admin: ["Overview", "Expense Oversight", "Stock Summary", "Staff Overview", "Salary Overview", "Medical Claims", "Hospital Chain", "Analytics"] // Master Control
    };

    const navigationItems = [
        { name: "Overview", href: `/${role}/dashboard`, icon: LayoutGrid },
        // Doctor
        { name: "Patients", href: `/${role}/patients`, icon: Users },
        { name: "Schedule", href: `/${role}/schedule`, icon: Calendar },
        { name: "Clinical", href: `/${role}/clinical`, icon: FileText },
        { name: "Surgery", href: `/${role}/or-management`, icon: Scissors },
        { name: "ICU Tracking", href: `/${role}/icu-tracking`, icon: Activity },
        { name: "Laboratory", href: `/${role}/laboratory`, icon: Microscope },
        { name: "Pharmacy", href: `/${role}/pharmacy`, icon: Pill },
        { name: "Radiology", href: `/${role}/radiology`, icon: Aperture },
        // Pharmacy & Inventory
        { name: "Dispensing", href: `/${role}/dispensing`, icon: Package },
        { name: "Inventory", href: `/${role}/inventory`, icon: Package },
        { name: "Batch & Expiry", href: `/${role}/expiry`, icon: Activity },
        { name: "Usage Reports", href: `/${role}/reports`, icon: BarChart3 },
        // Diagnostics Hub
        { name: "Test Scheduling", href: `/${role}/test-scheduling`, icon: Calendar },
        { name: "Sample Tracking", href: `/${role}/sample-tracking`, icon: Activity },
        { name: "Processing Status", href: `/${role}/status`, icon: Activity },
        { name: "Digital Reports", href: `/${role}/digital-reports`, icon: FileText },
        // Front Desk
        { name: "Registration", href: `/${role}/registration`, icon: Users },
        { name: "Queue", href: `/${role}/queue`, icon: Activity },
        { name: "Bed Allocation", href: `/${role}/bed-allocation`, icon: Activity },
        { name: "Appointments", href: `/${role}/appointments`, icon: Calendar },
        { name: "Insurance Triage", href: `/${role}/insurance-triage`, icon: ShieldCheck },
        { name: "Fee Collection", href: `/${role}/fees`, icon: DollarSign },
        // Nurse
        { name: "Duty Roster", href: `/${role}/roster`, icon: Calendar },
        { name: "Assigned Patients", href: `/${role}/assigned-patients`, icon: Users },
        { name: "Ward Management", href: `/${role}/ward-management`, icon: Activity },
        { name: "ICU Monitor", href: `/${role}/icu-monitor`, icon: Activity },
        { name: "Clinical Updates", href: `/${role}/clinical-updates`, icon: FileText },
        // Revenue Office
        { name: "Cash Payments", href: `/${role}/cash-payments`, icon: DollarSign },
        { name: "Card/UPI", href: `/${role}/digital-payments`, icon: DollarSign },
        { name: "Insurance Pre-Auth", href: `/${role}/pre-auth`, icon: ShieldCheck },
        { name: "Claims Management", href: `/${role}/claims`, icon: FileText },
        { name: "Split Billing", href: `/${role}/split-billing`, icon: DollarSign },
        { name: "Invoices", href: `/${role}/invoices`, icon: FileText },
        // Back Office / Finance
        { name: "Procurement", href: `/${role}/procurement`, icon: Package },
        { name: "Expenses", href: `/${role}/expenses`, icon: DollarSign },
        { name: "Payroll", href: `/${role}/payroll`, icon: Users },
        { name: "CapEx", href: `/${role}/capex`, icon: BarChart3 },
        { name: "Assets", href: `/${role}/assets`, icon: Wrench },
        // Patient Portal
        { name: "Medical Wallet", href: `/${role}/wallet`, icon: FileText },
        { name: "Report Viewer", href: `/${role}/viewer`, icon: Beaker },
        { name: "e-Prescriptions", href: `/${role}/prescriptions`, icon: Package },
        { name: "Booking", href: `/${role}/booking`, icon: Calendar },
        { name: "Queue Status", href: `/${role}/queue-status`, icon: Activity },
        { name: "Billing & Invoices", href: `/${role}/billing-history`, icon: DollarSign },
        // HR Module
        { name: "Staff Management", href: `/${role}/staff`, icon: Users },
        { name: "Rosters & Attendance", href: `/${role}/attendance`, icon: Calendar },
        { name: "Complaints", href: `/${role}/complaints`, icon: Bell },
        { name: "Compliance", href: `/${role}/compliance`, icon: ShieldCheck },
        { name: "Payroll Integration", href: `/${role}/payroll-data`, icon: DollarSign },
        // Admin Portal
        { name: "Expense Oversight", href: `/${role}/expense-oversight`, icon: DollarSign },
        { name: "Stock Summary", href: `/${role}/stock-summary`, icon: Package },
        { name: "Staff Overview", href: `/${role}/staff-overview`, icon: Users },
        { name: "Salary Overview", href: `/${role}/salary-overview`, icon: DollarSign },
        { name: "Medical Claims", href: `/${role}/claims-overview`, icon: ShieldCheck },
        { name: "Hospital Chain", href: `/${role}/chain-management`, icon: LayoutGrid },
        { name: "Analytics", href: `/${role}/analytics`, icon: BarChart3 },
    ];

    const navigation = navigationItems.filter(item =>
        navConfig[role]?.includes(item.name)
    );

    return (
        <div className="flex h-screen bg-[#F8FAFC]">
            {/* SIDEBAR (Light Olive #F5F7F0) */}
            <aside className="w-72 bg-olive-50 p-8 flex flex-col justify-between border-r border-olive-200">
                <div className="space-y-12">
                    {/* Logo */}
                    <Link href={`/${role}/dashboard`} className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-tr from-olive-600 to-olive-400 rounded-xl flex items-center justify-center">
                            <Heart className="text-white" size={24} fill="currentColor" />
                        </div>
                        <div>
                            <h1 className="text-xl font-black text-olive-900 tracking-tighter uppercase leading-none">Medicore</h1>
                            <p className="text-[8px] font-bold text-olive-600 tracking-[0.4em] uppercase mt-1">Enterprise</p>
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

                {/* Bottom Actions - Logout Button */}
                <div className="mt-auto pt-6 border-t border-olive-200">
                    <button
                        onClick={() => {
                            sessionStorage.clear();
                            signOut({ callbackUrl: "/login" });
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-olive-700 hover:bg-olive-100 rounded-xl transition-all group"
                    >
                        <LogOut size={20} className="group-hover:text-olive-600" />
                        <span className="text-sm font-bold tracking-tight">Logout</span>
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

                        {/* User Profile ONLY */}
                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <p className="text-sm font-bold text-slate-900">{userName}</p>
                                <p className="text-[10px] font-black text-olive-600 uppercase tracking-widest">{role}</p>
                            </div>
                            <div className="w-10 h-10 bg-olive-100 rounded-full flex items-center justify-center text-olive-700 font-black text-xs uppercase border-2 border-white shadow-sm">
                                {userName?.[0] || "U"}
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
