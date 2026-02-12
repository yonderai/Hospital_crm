import React from 'react';
import { Heart, Stethoscope, Calendar, Clock, MapPin, Phone, Mail, Globe, Activity } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';

interface ReceiptProps {
    data: {
        appointmentId: string;
        patientName: string;
        patientPhone: string;
        doctorName: string;
        department: string;
        date: string;
        time: string;
        paymentMethod: string;
        amount: number;
        status: string;
    }
}

export const AppointmentReceipt: React.FC<ReceiptProps> = ({ data }) => {
    return (
        <div className="w-full max-w-3xl mx-auto bg-white p-12 shadow-2xl print:shadow-none print:p-0 text-slate-800 font-sans" id="appointment-receipt">

            {/* --- HEADER --- */}
            <div className="flex justify-between items-start border-b-2 border-slate-100 pb-8 mb-8">
                <div className="flex items-center gap-5">
                    <div className="bg-emerald-600 p-4 rounded-2xl shadow-lg shadow-emerald-100 print:shadow-none">
                        <Activity className="text-white w-10 h-10" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none">MEDICORE</h1>
                        <p className="text-emerald-600 text-xs font-bold uppercase tracking-[0.3em] mt-1">ENTERPRISE</p>
                    </div>
                </div>
                <div className="text-right">
                    <h2 className="text-xl font-bold text-slate-300 uppercase tracking-widest">Receipt</h2>
                    <p className="text-sm font-semibold text-slate-400 mt-1">APPT CONFIRMATION</p>
                </div>
            </div>

            {/* --- PATIENT & APPOINTMENT DETAILS --- */}
            <div className="bg-slate-50/50 rounded-2xl p-8 border border-slate-100 mb-8 print:bg-white print:border-slate-200">
                <div className="grid grid-cols-2 gap-y-8 gap-x-12">

                    {/* Appointment ID */}
                    <div className="col-span-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Appointment Reference</label>
                        <div className="inline-block bg-emerald-50 text-emerald-700 px-4 py-2 rounded-lg border border-emerald-100 font-mono font-bold text-lg">
                            #{data.appointmentId}
                        </div>
                    </div>

                    {/* Left Column */}
                    <div className="space-y-6">
                        <div>
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Patient Name</label>
                            <p className="text-lg font-bold text-slate-900">{data.patientName}</p>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Contact Number</label>
                            <p className="text-base font-semibold text-slate-700">{data.patientPhone || "N/A"}</p>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        <div>
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Consulting Doctor</label>
                            <div className="flex items-center gap-2">
                                <Stethoscope className="w-4 h-4 text-emerald-600" />
                                <p className="text-lg font-bold text-slate-900">{data.doctorName}</p>
                            </div>
                            <p className="text-sm text-slate-500 font-medium">{data.department} Dept.</p>
                        </div>
                        <div className="flex gap-6">
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Date</label>
                                <div className="flex items-center gap-2 text-slate-700 font-semibold">
                                    <Calendar className="w-4 h-4 text-slate-400" />
                                    {new Date(data.date).toLocaleDateString()}
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Time</label>
                                <div className="flex items-center gap-2 text-slate-700 font-semibold">
                                    <Clock className="w-4 h-4 text-slate-400" />
                                    {data.time}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- PAYMENT SECTION --- */}
            <div className="mb-10">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Payment Details</h3>
                <div className="flex justify-between items-center bg-emerald-50/30 p-5 rounded-xl border border-emerald-100/50 print:bg-transparent print:border-slate-200">
                    <div>
                        <p className="text-xs text-slate-500 font-bold uppercase mb-1">Payment Method</p>
                        <p className="text-slate-900 font-bold capitalize">{data.paymentMethod}</p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 font-bold uppercase mb-1">Status</p>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                            {data.status}
                        </span>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-slate-500 font-bold uppercase mb-1">Total Amount</p>
                        <p className="text-2xl font-black text-slate-900">₹{data.amount.toLocaleString()}</p>
                    </div>
                </div>
            </div>

            {/* --- DOCTOR NOTES & PRESCRIPTION AREA --- */}
            <div className="mb-12">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                    Doctor's Notes / Prescription
                    <span className="text-[10px] text-slate-400 font-normal normal-case">(For clinical use only)</span>
                </h3>
                <div className="border border-slate-200 rounded-xl p-6 bg-white min-h-[200px] relative">
                    {/* Lined Background using CSS Gradients */}
                    <div className="absolute inset-0 w-full h-full pointer-events-none"
                        style={{
                            backgroundImage: 'linear-gradient(transparent 95%, #e2e8f0 95%)',
                            backgroundSize: '100% 40px',
                            marginTop: '39px'
                        }}>
                    </div>
                </div>
            </div>

            {/* --- VERIFICATION & SIGNATURE --- */}
            <div className="flex justify-between items-end mb-12">

                {/* QR Code */}
                <div className="text-center">
                    <div className="bg-white p-2 border border-slate-200 rounded-lg inline-block mb-2">
                        <QRCodeCanvas value={`MEDICORE-APPT-${data.appointmentId}`} size={80} level={"H"} />
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Scan to Verify</p>
                </div>

                {/* Signature Box */}
                <div className="w-64">
                    <div className="border-b-2 border-slate-300 pb-2 mb-2"></div>
                    <p className="text-xs font-bold text-slate-900 text-right">Authorized Signature</p>
                    <p className="text-[10px] text-slate-400 text-right">Dr. {data.doctorName}</p>
                </div>
            </div>

            {/* --- FOOTER --- */}
            <div className="border-t border-slate-100 pt-8 text-center">
                <div className="flex justify-center gap-8 mb-4">
                    <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
                        <MapPin className="w-3 h-3" />
                        123 Health Avenue, Medical District
                    </div>
                    <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
                        <Phone className="w-3 h-3" />
                        +91 (800) 123-4567
                    </div>
                    <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
                        <Globe className="w-3 h-3" />
                        www.medicore-enterprise.com
                    </div>
                </div>
                <p className="text-[10px] text-slate-300 font-medium">
                    This is a computer-generated receipt and requires no physical signature for payment validation.
                    <br />Generated on {new Date().toLocaleString()}
                </p>
            </div>
        </div>
    );
};
