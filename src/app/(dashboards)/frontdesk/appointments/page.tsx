"use client";

import AppointmentBookingWizard from "@/components/appointments/AppointmentBookingWizard";
import { Activity } from "lucide-react";

export default function frontdeskappointmentsPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-slate-800">Appointment Management</h1>
                    <p className="text-slate-500 font-medium">Book, reschedule, and manage patient appointments.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Booking Wizard Area */}
                <div className="lg:col-span-2">
                    <AppointmentBookingWizard />
                </div>

                {/* Sidebar / Quick Actions (Optional placeholder for future) */}
                <div className="space-y-6">
                    <div className="bg-slate-900 text-white rounded-[32px] p-6 shadow-xl shadow-slate-200">
                        <h3 className="font-bold text-lg mb-2">Today's Schedule</h3>
                        <p className="text-slate-400 text-sm mb-4">You have 12 appointments scheduled for today.</p>
                        <button className="w-full py-3 bg-white/10 rounded-xl text-sm font-bold hover:bg-white/20 transition-all">View All Appointments</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
