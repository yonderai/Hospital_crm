import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import Prescription from "@/lib/models/Prescription";
import Invoice from "@/lib/models/Invoice";
import Appointment from "@/lib/models/Appointment";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user?.role !== "doctor") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const data = await req.json();
        console.log("Creating prescription with data:", JSON.stringify(data, null, 2));

        // 1. Create Prescription
        const prescription = await Prescription.create({
            ...data,
            providerId: session.user.id,
            prescriptionId: `RX-${Date.now()}`,
            status: "active", // Maps to "Pending Dispense" logic
        });
        console.log("Saved prescription encounterId:", prescription.encounterId);

        // 2. Auto-Close Appointment if applicable
        if (data.appointmentId) {
            await Appointment.findByIdAndUpdate(
                data.appointmentId,
                { status: "completed" }
            );
        }

        // 3. Auto-Billing Trigger: Assessment of cost?
        // In a real system, cost comes from Pharmacy module after checks.
        // For this demo/requirement: "Billing system automatically... Adds pharmacy medicine cost".
        // We will add them as "Pending Charge" items to the invoice. Assumed cost for now or 0.

        let invoice = await Invoice.findOne({
            patientId: data.patientId,
            status: "draft"
        });

        if (invoice) {
            // Add medications to invoice
            data.medications.forEach((med: any) => {
                invoice.items.push({
                    description: `Pharmacy: ${med.drugName} (${med.quantity})`,
                    quantity: med.quantity,
                    unitPrice: 10, // Placeholder price
                    total: 10 * med.quantity
                });
            });

            invoice.totalAmount = invoice.items.reduce((sum: number, item: any) => sum + item.total, 0);
            invoice.balanceDue = invoice.totalAmount - invoice.amountPaid;
            await invoice.save();
        }

        return NextResponse.json({ success: true, prescription });

    } catch (error) {
        console.error("Error creating prescription:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
