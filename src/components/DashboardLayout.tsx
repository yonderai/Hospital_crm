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
    Microscope,
    ShoppingBag,
    Ambulance,
    Siren,
    Stethoscope,
    AlertTriangle,

    Hammer,
    ChevronLeft
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { data: session } = useSession();
    const pathname = usePathname();

    // Demo Mode Fallback: Use sessionStorage if no real session exists
    const [demoState, setDemoState] = useState<{ role: string, name: string } | null>(null);
    const [isCollapsed, setIsCollapsed] = useState(false);

    useEffect(() => {
        const storedRole = sessionStorage.getItem("userRole");
        const storedName = sessionStorage.getItem("userName");
        if (storedRole) {
            setDemoState({ role: storedRole, name: storedName || "Demo User" });
        }
    }, []);

    // Detect role from pathname if not in session/demoState
    const rawPathRole = pathname?.split('/')[1];
    const pathRole = rawPathRole === 'pharmacy' ? 'pharmacist' : rawPathRole;

    // Priority: Session Role -> Demo Role -> Path Role (if valid) -> Fallback
    let role = (session?.user as any)?.role || demoState?.role ||
        (["doctor", "nurse", "admin", "frontdesk", "patient", "labtech", "pharmacist", "billing", "hr"].includes(pathRole) ? pathRole : "doctor");

    // Normalize specific roles for navigation config
    if (role === 'pharmacy_inventory') role = 'pharmacist';

    // Keep original role for URL paths before normalization
    const urlRole = role === 'labtech' ? 'lab' : (role === 'pharmacist' ? 'pharmacy' : role);

    // Normalize role for navigation config
    if (role === 'lab') role = 'labtech';
    if (role === 'pharmacy') role = 'pharmacist';
    const userName = session?.user?.name || demoState?.name || "Initializing...";

    // Role-based navigation mapping - Strictly separated as per requirements
    const navConfig: Record<string, string[]> = {
        doctor: ["Overview", "Patients", "Schedule", "Surgery", "ICU Tracking", "Support"],
        pharmacist: ["Overview", "Dispensing", "Inventory", "Batch & Expiry", "Usage Reports", "Purchase Orders"], // Unified Pharmacy & Inventory
        labtech: ["Overview", "Pending Lab Orders", "Radiology", "Test Scheduling", "Sample Tracking", "Digital Reports"], // Diagnostics Hub
        frontdesk: ["Overview", "Registration", "Queue", "Bed Allocation", "Appointments", "Insurance Triage", "Fee Collection"], // Front Desk
        nurse: ["Overview", "Duty Roster", "Assigned Patients", "Ward Management", "ICU Monitor", "Clinical Updates"], // Nurse Portal
        billing: ["Overview", "Cash Payments", "Card/UPI", "Insurance Pre-Auth", "Claims Management", "Split Billing", "Invoices"], // Revenue Office

        finance: ["Overview", "Ticket Approvals", "Procurement", "Expenses", "Utilities", "Maintenance", "Assets", "Payroll", "Compliance"], // Back Office / Finance
        patient: ["Overview", "Report Viewer", "Medical History", "Insurance", "e-Prescriptions", "Booking", "Queue Status", "Billing & Invoices"], // Patient Portal
        hr: ["Overview", "Staff Management", "Rosters & Attendance", "Complaints", "Compliance", "Payroll Integration"], // HR Module
        admin: ["Overview", "User Management", "Staff Overview", "Departments & Services", "Stock Summary", "Billing & Payments", "Expense Oversight", "Salary Overview", "Medical Claims", "Hospital Chain", "Reports", "Analytics", "Settings"], // Master Control
        emergency: ["Overview", "Triage", "Clinical Workspace", "Ambulance", "Alerts"], // Emergency
        maintenance: ["Overview", "My Tickets", "Raise Ticket", "Profile"] // Maintenance Staff
    };

    const navigationItems = [
        { name: "Overview", href: urlRole === 'pharmacy' ? `/${urlRole}/overview` : `/${urlRole}/dashboard`, icon: LayoutGrid },
        // Doctor
        { name: "Patients", href: `/${urlRole}/patients`, icon: Users },
        { name: "Schedule", href: `/${urlRole}/schedule`, icon: Calendar },
        { name: "Clinical", href: `/${urlRole}/clinical`, icon: FileText },
        { name: "Surgery", href: `/${urlRole}/or-management`, icon: Scissors },
        { name: "ICU Tracking", href: `/${urlRole}/icu-tracking`, icon: Activity },
        { name: "Laboratory", href: `/${urlRole}/laboratory`, icon: Microscope },
        { name: "Pharmacy", href: `/${urlRole}/pharmacy`, icon: Pill },
        { name: "Support", href: `/${urlRole}/support`, icon: Hammer }, // New Support Link
        // Pharmacy & Inventory
        { name: "Dispensing", href: `/${urlRole}/dispensing`, icon: Package },
        { name: "Inventory", href: `/${urlRole}/inventory`, icon: Package },
        { name: "Batch & Expiry", href: `/${urlRole}/batch-expiry`, icon: Activity },
        { name: "Usage Reports", href: `/${urlRole}/reports`, icon: BarChart3 },
        { name: "Purchase Orders", href: `/${urlRole}/procurement`, icon: ShoppingBag },
        // Diagnostics Hub
        { name: "Pending Lab Orders", href: `/${urlRole}/pending-orders`, icon: FlaskConical },
        { name: "Radiology", href: `/${urlRole}/radiology`, icon: Aperture },
        { name: "Test Scheduling", href: `/${urlRole}/test-scheduling`, icon: Calendar },
        { name: "Sample Tracking", href: `/${urlRole}/sample-tracking`, icon: Activity },

        { name: "Digital Reports", href: `/${urlRole}/digital-reports`, icon: FileText },
        // Front Desk
        { name: "Registration", href: `/${urlRole}/registration`, icon: Users },
        { name: "Queue", href: `/${urlRole}/queue`, icon: Activity },
        { name: "Bed Allocation", href: `/${urlRole}/bed-allocation`, icon: Activity },
        { name: "Appointments", href: `/${urlRole}/appointments`, icon: Calendar },
        { name: "Insurance Triage", href: `/${urlRole}/insurance-triage`, icon: ShieldCheck },
        { name: "Fee Collection", href: `/${urlRole}/fees`, icon: DollarSign },
        // Nurse
        { name: "Duty Roster", href: `/${urlRole}/roster`, icon: Calendar },
        { name: "Assigned Patients", href: `/${urlRole}/assigned-patients`, icon: Users },
        { name: "Ward Management", href: `/${urlRole}/ward-management`, icon: Activity },
        { name: "ICU Monitor", href: `/${urlRole}/icu-monitor`, icon: Activity },
        { name: "Clinical Updates", href: `/${urlRole}/clinical-updates`, icon: FileText },
        // Revenue Office
        { name: "Cash Payments", href: `/${urlRole}/cash-payments`, icon: DollarSign },
        { name: "Card/UPI", href: `/${urlRole}/digital-payments`, icon: DollarSign },
        { name: "Insurance Pre-Auth", href: `/${urlRole}/pre-auth`, icon: ShieldCheck },
        { name: "Claims Management", href: `/${urlRole}/claims`, icon: FileText },
        { name: "Split Billing", href: `/${urlRole}/split-billing`, icon: DollarSign },
        { name: "Invoices", href: `/${urlRole}/invoices`, icon: FileText },
        // Back Office / Finance

        { name: "Ticket Approvals", href: `/${role}/tickets`, icon: ShieldCheck },
        { name: "Procurement", href: `/${role}/procurement`, icon: Package },
        { name: "Expenses", href: `/${role}/expenses`, icon: DollarSign },
        { name: "Utilities", href: `/${role}/utilities`, icon: Wind },
        { name: "Maintenance", href: `/${role}/maintenance`, icon: Wrench },
        { name: "Assets", href: `/${role}/assets`, icon: Activity },
        { name: "Payroll", href: `/${role}/payroll`, icon: Users },


        // Patient Portal
        { name: "Report Viewer", href: `/${urlRole}/reports`, icon: Microscope },
        { name: "Medical History", href: `/${urlRole}/medical-history`, icon: FileText },
        { name: "Insurance", href: `/${urlRole}/insurance`, icon: ShieldCheck },
        { name: "e-Prescriptions", href: `/${urlRole}/prescriptions`, icon: Package },
        { name: "Booking", href: `/${urlRole}/booking`, icon: Calendar },
        { name: "Queue Status", href: `/${urlRole}/queue-status`, icon: Activity },
        { name: "Billing & Invoices", href: `/${urlRole}/billing-history`, icon: DollarSign },
        // HR Module
        { name: "Staff Management", href: `/${urlRole}/staff`, icon: Users },
        { name: "Rosters & Attendance", href: `/${urlRole}/attendance`, icon: Calendar },
        { name: "Complaints", href: `/${urlRole}/complaints`, icon: Bell },
        { name: "Compliance", href: `/${urlRole}/compliance`, icon: ShieldCheck },
        { name: "Payroll Integration", href: `/${urlRole}/payroll-data`, icon: DollarSign },
        // Admin Portal
        { name: "Expense Oversight", href: `/${urlRole}/expense-oversight`, icon: DollarSign },
        { name: "Stock Summary", href: `/${urlRole}/stock-summary`, icon: Package },
        { name: "Staff Overview", href: `/${urlRole}/staff-overview`, icon: Users },
        { name: "Salary Overview", href: `/${urlRole}/salary-overview`, icon: DollarSign },
        { name: "Medical Claims", href: `/${urlRole}/claims-overview`, icon: ShieldCheck },
        { name: "Hospital Chain", href: `/${urlRole}/chain-management`, icon: LayoutGrid },
        { name: "Analytics", href: `/${urlRole}/analytics`, icon: BarChart3 },
        // Emergency
        { name: "Triage", href: `/${role}/triage`, icon: Activity },
        { name: "Clinical Workspace", href: `/${role}/clinical`, icon: Stethoscope },
        { name: "Ambulance", href: `/${role}/ambulance`, icon: Ambulance },
        { name: "Alerts", href: `/${role}/alerts`, icon: AlertTriangle },
    ];

    const navigation = navigationItems.filter(item =>
        navConfig[role]?.includes(item.name)
    ).map(item => {
        // Handle role-to-path mapping
        let pathRole = role;
        if (role === 'pharmacist') pathRole = 'pharmacy';

        // Fix specific overrides if needed, otherwise use mapping
        let href = item.href;
        if (!href.includes(`/${pathRole}/`)) {
            href = href.replace(`/${role}/`, `/${pathRole}/`);
        }

        return { ...item, href };
    });

    return (
        <div className="flex h-screen bg-[#F8FAFC]">
            {/* SIDEBAR (Light Olive #F5F7F0) */}
            <aside className={`${isCollapsed ? 'w-24 px-4' : 'w-72 px-8'} bg-olive-50 flex flex-col h-screen border-r border-olive-200 transition-all duration-300 relative`}>

                {/* Collapse Toggle */}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="absolute -right-3 top-12 w-6 h-6 bg-white border border-olive-200 rounded-full flex items-center justify-center text-olive-600 hover:text-olive-700 hover:bg-olive-50 shadow-sm z-50"
                >
                    <ChevronLeft size={14} className={`transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
                </button>

                {/* Logo Section */}
                <div className="pt-8 pb-8 shrink-0">
                    <Link href={`/${role}/dashboard`} className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
                        <div className="w-10 h-10 bg-gradient-to-tr from-olive-600 to-olive-400 rounded-xl flex items-center justify-center shrink-0">
                            <Heart className="text-white" size={24} fill="currentColor" />
                        </div>
                        {!isCollapsed && (
                            <div className="overflow-hidden whitespace-nowrap">
                                <h1 className="text-xl font-black text-olive-900 tracking-tighter uppercase leading-none">Medicore</h1>
                                <p className="text-[8px] font-bold text-olive-600 tracking-[0.4em] uppercase mt-1">Enterprise</p>
                            </div>
                        )}
                    </Link>
                </div>

                {/* Scrollable Navigation */}
                <div className="flex-1 overflow-y-auto min-h-0 -mx-4 px-4 space-y-2 scrollbar-thin scrollbar-thumb-olive-200 scrollbar-track-transparent">
                    <nav className="space-y-2 pb-4">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${isActive
                                        ? "bg-olive-600 text-white shadow-lg shadow-olive-600/20"
                                        : "text-slate-500 hover:text-olive-900 hover:bg-olive-100"
                                        } ${isCollapsed ? 'justify-center' : ''}`}
                                    title={isCollapsed ? item.name : ''}
                                >
                                    <item.icon size={20} className={`shrink-0 ${isActive ? "text-olive-100" : "text-slate-400 group-hover:text-olive-700"}`} />
                                    {!isCollapsed && <span className="text-sm font-bold tracking-tight whitespace-nowrap overflow-hidden">{item.name}</span>}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Bottom Actions - Logout Button */}
                <div className="mt-auto py-6 shrink-0 border-t border-olive-200 bg-olive-50 z-10">
                    <button
                        onClick={() => {
                            sessionStorage.clear();
                            signOut({ callbackUrl: "/login" });
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-olive-700 hover:bg-olive-100 rounded-xl transition-all group ${isCollapsed ? 'justify-center' : ''}`}
                        title={isCollapsed ? "Logout" : ''}
                    >
                        <LogOut size={20} className="shrink-0 group-hover:text-olive-600" />
                        {!isCollapsed && <span className="text-sm font-bold tracking-tight">Logout</span>}
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
                        <Link href={`/${role}/profile`} className="flex items-center gap-4 group hover:bg-slate-50 p-2 rounded-2xl transition-all">
                            <div className="text-right">
                                <p className="text-sm font-bold text-slate-900 group-hover:text-olive-700 transition-colors">{userName}</p>
                                <p className="text-[10px] font-black text-olive-600 uppercase tracking-widest">{role}</p>
                            </div>
                            <div className="w-10 h-10 bg-olive-100 rounded-full flex items-center justify-center text-olive-700 font-black text-xs uppercase border-2 border-white shadow-sm group-hover:scale-110 transition-transform">
                                {userName?.[0] || "U"}
                            </div>
                        </Link>
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
                            <Activity size={12} className="text-slate-400" />
                            <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Network Latency: 42ms</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-olive-50 rounded-full border border-olive-100">
                        <ShieldCheck size={10} className="text-olive-600" />
                        <span className="text-[9px] font-bold text-olive-700 uppercase tracking-widest">Encrypted Clinical Hub</span>
                    </div>
                </footer>
            </div >
        </div >
    );
}
