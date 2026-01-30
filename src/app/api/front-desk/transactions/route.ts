import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Appointment from "@/lib/models/Appointment";
import Patient from "@/lib/models/Patient"; // Ensure Patient model is registered

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        // Fetch appointments with patient details
        // Limit to recent 50 for demo
        const appointments = await Appointment.find({ 'payment.totalAmount': { $exists: true } })
            .sort({ createdAt: -1 })
            .limit(50)
            .populate("patientId", "firstName lastName");

        const transactions = appointments.map(apt => ({
            id: apt.appointmentId,
            patient: apt.patientId ? `${apt.patientId.firstName} ${apt.patientId.lastName}` : "Unknown",
            type: apt.type,
            totalAmount: apt.payment?.totalAmount || 0,
            paidAmount: apt.payment?.paidAmount || 0,
            dueAmount: apt.payment?.dueAmount || 0,
            status: apt.payment?.status === 'partial' ? 'Advance Paid' : (apt.payment?.status === 'paid' ? 'Fully Paid' : 'Pending'),
            rawStatus: apt.payment?.status,
            time: new Date(apt.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            date: new Date(apt.createdAt).toLocaleDateString()
        }));

        return NextResponse.json({ transactions });

    } catch (error: any) {
        console.error("Transactions Fetch Error:", error);
        return NextResponse.json({ error: error.message || "Failed to fetch transactions" }, { status: 500 });
    }
}
