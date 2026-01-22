"use client";

import {
  Stethoscope,
  Calendar,
  DollarSign,
  Beaker,
  Package,
  ShieldCheck,
  User,
  ArrowRight,
  Activity,
  ChevronRight,
  Video,
  Microscope,
  Users,
  Wind,
  FlaskConical,
  ShieldAlert
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  const modules = [
    {
      title: "Core Clinical",
      desc: "Patient Master, Encounters, SOAP Notes & AI Assistant",
      icon: <Stethoscope size={24} />,
      href: "/clinical/encounter",
      color: "bg-olive-600",
      status: "Ready"
    },
    {
      title: "Front Desk",
      desc: "Scheduling, Appointments & Patient Check-in",
      icon: <Calendar size={24} />,
      href: "/frontdesk/dashboard",
      color: "bg-olive-800",
      status: "Ready"
    },
    {
      title: "Billing & RCM",
      desc: "Claims, Payments, Revenue Cycle & Denial Management",
      icon: <DollarSign size={24} />,
      href: "/billing/dashboard",
      color: "bg-olive-900",
      status: "Ready"
    },
    {
      title: "Pharmacy",
      desc: "Inpatient Pharmacy, Dispensing & Compliance Logs",
      icon: <Beaker size={24} />,
      href: "/pharmacy/dashboard",
      color: "bg-olive-700",
      status: "Ready"
    },
    {
      title: "Inventory",
      desc: "Supply Chain, Procurement & Supplier Management",
      icon: <Package size={24} />,
      href: "/inventory/procurement",
      color: "bg-olive-500",
      status: "Ready"
    },
    {
      title: "AI Governance",
      desc: "Model Registry, Safety Oversight & Ethics Console",
      icon: <ShieldCheck size={24} />,
      href: "/ai-governance/dashboard",
      color: "bg-black",
      status: "Ready"
    },
    {
      title: "Patient Portal",
      desc: "Engagement, Messaging & Health Records",
      icon: <User size={24} />,
      href: "/patient-portal/dashboard",
      color: "bg-olive-400",
      status: "Ready"
    },
    {
      title: "Virtual Clinic",
      desc: "Telehealth, Video Consultations & Remote Monitoring",
      icon: <Video size={24} />,
      href: "/clinical/telehealth",
      color: "bg-olive-600",
      status: "Beta"
    },
    {
      title: "Laboratory (LIS)",
      desc: "Lab Orders, Pathology Reports & Result Verification",
      icon: <Microscope size={24} />,
      href: "/lab/dashboard",
      color: "bg-olive-700",
      status: "Ready"
    },
    {
      title: "Human Resources",
      desc: "Staff Management, Payroll & Shift Scheduling",
      icon: <Users size={24} />,
      href: "/hr/dashboard",
      color: "bg-olive-500",
      status: "Ready"
    },
    {
      title: "Surgical Services",
      desc: "OR Coordination, Anesthesia & Instrument Tracking",
      icon: <Activity size={24} />,
      href: "/doctor/or-management",
      color: "bg-olive-800",
      status: "New"
    },
    {
      title: "Intensive Care (ICU)",
      desc: "Critical Care Monitoring & Hourly Flowsheets",
      icon: <Wind size={24} />,
      href: "/doctor/icu-tracking",
      color: "bg-olive-900",
      status: "New"
    },
    {
      title: "Research Hub",
      desc: "Clinical Trials, Patient Enrollment & IRB Compliance",
      icon: <FlaskConical size={24} />,
      href: "/admin/research",
      color: "bg-olive-600",
      status: "New"
    },
    {
      title: "Quality & Compliance",
      desc: "Incident Reporting, Audit Logs & Infection Control",
      icon: <ShieldAlert size={24} />,
      href: "/admin/compliance",
      color: "bg-olive-700",
      status: "New"
    }
  ];

  return (
    <div className="min-h-screen bg-olive-50 flex flex-col font-sans">
      {/* Hero Header */}
      <header className="bg-white border-b border-olive-200 py-12 px-8 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-olive-600 rounded-xl flex items-center justify-center">
                <Activity className="text-white" size={24} />
              </div>
              <h1 className="text-3xl font-black text-olive-900 tracking-tighter">YONDER<span className="text-olive-500 font-light italic">MEDICORE</span></h1>
            </div>
            <h2 className="text-5xl font-bold text-olive-950 font-serif leading-tight max-w-2xl">
              The Intelligence Layer for Modern Healthcare.
            </h2>
            <p className="text-olive-600 text-lg max-w-xl">
              Welcome to the Hospital/Clinic ERP expanded demonstration. Explore the specialized modules below, each designed with precision and clinical workflows in mind.
            </p>
          </div>
          <div className="hidden lg:block w-96 h-96 bg-olive-100 rounded-full relative overflow-hidden ring-8 ring-white shadow-2xl">
            <div className="absolute inset-0 flex items-center justify-center">
              <Stethoscope size={200} className="text-olive-200 rotate-12" />
            </div>
          </div>
        </div>
      </header>

      {/* Module Grid */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-12 -mt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {modules.map((m, i) => (
            <Link key={i} href={m.href} className="group">
              <div className="h-full bg-white rounded-3xl p-8 border border-olive-100 shadow-sm hover:shadow-2xl hover:border-olive-400 transition-all transform hover:-translate-y-2 flex flex-col">
                <div className="flex justify-between items-start mb-6">
                  <div className={`${m.color} p-4 rounded-2xl text-white shadow-lg`}>
                    {m.icon}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-olive-400 py-1 px-3 bg-olive-50 rounded-full">
                    {m.status}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-olive-900 mb-2">{m.title}</h3>
                <p className="text-olive-600 text-sm leading-relaxed mb-8 flex-1">
                  {m.desc}
                </p>
                <div className="flex items-center gap-2 text-olive-600 font-bold text-sm group-hover:gap-4 transition-all">
                  Launch Module <ArrowRight size={16} />
                </div>
              </div>
            </Link>
          ))}

          {/* Internal Comms Card */}
          <div className="lg:col-span-2 bg-olive-900 rounded-3xl p-10 text-white flex items-center justify-between relative overflow-hidden shadow-2xl">
            <div className="relative z-10 max-w-md">
              <h3 className="text-3xl font-bold mb-4">Enterprise-Ready Infrastructure</h3>
              <p className="text-olive-200 text-sm leading-relaxed opacity-80 mb-6">
                Full FHIR/HL7 integration nodes, secure SQL-schema, and AI-governance consoles come standard. Built for scalability and multi-site clinic networks.
              </p>
              <button className="px-6 py-3 bg-white text-olive-900 rounded-xl font-bold text-sm hover:bg-olive-100 transition-all flex items-center gap-2">
                Review Documentation <ChevronRight size={18} />
              </button>
            </div>
            <ShieldCheck size={200} className="text-white opacity-5 absolute right-[-20px] bottom-[-20px]" />
          </div>
        </div>
      </main>

      {/* Quick Links Footer */}
      <footer className="bg-white border-t border-olive-100 py-8 px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Activity className="text-olive-600" size={18} />
            <span className="text-xs font-bold text-olive-900 tracking-widest uppercase">Yonder Medicore System Node</span>
          </div>
          <div className="flex gap-8 text-[10px] font-black text-olive-400 uppercase tracking-widest">
            <span className="text-olive-900 cursor-pointer">Security Compliance</span>
            <span className="cursor-pointer">API Keys</span>
            <span className="cursor-pointer">Support</span>
          </div>
          <div className="text-[10px] text-olive-500 font-medium">
            © 2026 Yonder Health Technologies.
          </div>
        </div>
      </footer>
    </div>
  );
}
