import DashboardLayout from "@/components/DashboardLayout";
import AppointmentForm from "@/components/AppointmentForm";

export default function PatientBookingPage() {
    return (
        <DashboardLayout>
            <div className="space-y-10">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">BOOKING</h2>
                    <p className="text-olive-600 text-[10px] font-black mt-1 uppercase tracking-[0.3em]">PORTAL</p>
                </div>

                <AppointmentForm userRole="patient" />
            </div>
        </DashboardLayout>
    );
}
