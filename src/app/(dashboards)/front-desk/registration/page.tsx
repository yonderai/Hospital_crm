import DashboardLayout from "@/components/DashboardLayout";
import AppointmentForm from "@/components/AppointmentForm";

export default function FrontDeskRegistrationPage() {
    return (
        <DashboardLayout>
            <div className="space-y-10">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">REGISTRATION</h2>
                    <p className="text-olive-600 text-[10px] font-black mt-1 uppercase tracking-[0.3em]">PORTAL</p>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                    <div>
                        <AppointmentForm userRole="front-desk" />
                    </div>
                    {/* Placeholder for future Registration Form or Patient List */}
                    <div className="bg-slate-50 rounded-[40px] border border-slate-100 p-8 flex items-center justify-center text-center">
                        <div>
                            <p className="text-slate-400 font-bold mb-2">New Patient?</p>
                            <button className="px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white hover:border-olive-400 hover:text-olive-700 transition-all">
                                Register New Patient
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
