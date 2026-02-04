import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from '@/lib/db';
import Encounter from "@/lib/models/Encounter";
import Invoice from "@/lib/models/Invoice";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user?.role !== "doctor") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const data = await req.json();

        // 1. Create Encounter
        const encounter = await Encounter.create({
            ...data,
            providerId: session.user.id,
            encounterId: `ENC-${Date.now()}`, // Simple ID generation
            status: "closed", // Auto-close for this flow
        });

        // 2. Auto-Close Appointment & Existing Encounter if applicable
        if (data.appointmentId) {
            const Appointment = (await import("@/lib/models/Appointment")).default;
            await Appointment.findByIdAndUpdate(
                data.appointmentId,
                { status: "completed" }
            );
        }

        if (data.encounterId) {
            await Encounter.findByIdAndUpdate(
                data.encounterId,
                { status: "closed" }
            );
        } else {
            // Proactive cleanup: Close any other open encounters for this patient/provider combo
            await Encounter.updateMany(
                {
                    patientId: data.patientId,
                    providerId: session.user.id,
                    status: "open",
                    _id: { $ne: encounter._id }
                },
                { status: "closed" }
            );
        }

        // 3. Auto-Billing Trigger: Consultation Fee
        // Check if there is an open invoice for this patient today? Or just create a new one/add to existing.
        // Simplified: Find draft invoice or create new.

        let invoice = await Invoice.findOne({
            patientId: data.patientId,
            status: "draft"
        });

        if (!invoice) {
            invoice = new Invoice({
                patientId: data.patientId,
                encounterId: encounter._id,
                invoiceNumber: `INV-${Date.now()}`,
                status: "draft",
                dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
                items: [],
                totalAmount: 0,
                balanceDue: 0
            });
        }

        // Add standard consultation fee
        invoice.items.push({
            description: "General Consultation",
            quantity: 1,
            unitPrice: 50, // Standard fee
            total: 50
        });

        // Recalculate totals
        invoice.totalAmount = invoice.items.reduce((sum: number, item: any) => sum + item.total, 0);
        invoice.balanceDue = invoice.totalAmount - invoice.amountPaid;

        await invoice.save();

        return NextResponse.json({ success: true, encounter, invoiceId: invoice._id });

    } catch (error) {
        console.error("Error creating consultation:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
