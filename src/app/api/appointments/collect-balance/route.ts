import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Appointment from "@/lib/models/Appointment";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const { appointmentId } = await req.json();

        if (!appointmentId) {
            return NextResponse.json({ error: "Appointment ID is required" }, { status: 400 });
        }

        const appointment = await Appointment.findOne({ appointmentId });
        if (!appointment) {
            return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
        }

        if (appointment.payment.status === 'paid') {
            return NextResponse.json({ error: "Payment already completed" }, { status: 400 });
        }

        // Update Payment Details
        appointment.payment.paidAmount = appointment.payment.totalAmount;
        appointment.payment.dueAmount = 0;
        appointment.payment.status = "paid";

        // Generate a new receipt for the balance
        const balanceReceipt = `RCP-BAL-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(5, '0')}`;
        appointment.payment.receiptNo = balanceReceipt; // Update to latest receipt

        await appointment.save();

        return NextResponse.json({
            success: true,
            message: "Balance collected successfully",
            appointment
        });

    } catch (error: any) {
        console.error("Collect Balance Error:", error);
        return NextResponse.json({ error: error.message || "Failed to collect balance" }, { status: 500 });
    }
}
