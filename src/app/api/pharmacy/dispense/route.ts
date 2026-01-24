import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import Prescription from "@/lib/models/Prescription";
import Invoice from "@/lib/models/Invoice";
import InventoryItem from "@/lib/models/InventoryItem";

const MEDICINE_PRICE_PER_UNIT = 20;

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user?.role !== "pharmacist") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const { prescriptionId } = await req.json();

        const prescription = await Prescription.findById(prescriptionId);
        if (!prescription) {
            return NextResponse.json({ error: "Prescription not found" }, { status: 404 });
        }

        // 1. Calculate Charges & Deduct Inventory
        let medicineCharges = 0;
        const invoiceItems = [];

        for (const med of prescription.medications) {
            // Find Inventory Item by Name (Loose matching for demo)
            // In prod, Prescription should store InventoryItemID
            const inventoryItem = await InventoryItem.findOne({
                name: { $regex: new RegExp(med.drugName, 'i') }
            });

            if (inventoryItem) {
                if (inventoryItem.quantityOnHand < med.quantity) {
                    return NextResponse.json({
                        error: `Insufficient stock for ${med.drugName}. Available: ${inventoryItem.quantityOnHand}`
                    }, { status: 400 });
                }

                // Deduct Stock
                inventoryItem.quantityOnHand -= med.quantity;
                await inventoryItem.save();
            }

            const total = med.quantity * MEDICINE_PRICE_PER_UNIT;
            medicineCharges += total;

            invoiceItems.push({
                description: `Pharmacy: ${med.drugName} (${med.quantity} units)`,
                quantity: med.quantity,
                unitPrice: MEDICINE_PRICE_PER_UNIT,
                total: total
            });
        }

        // 2. Find or Create Draft Invoice
        let invoice = await Invoice.findOne({
            patientId: prescription.patientId,
            status: "draft"
        });

        if (!invoice) {
            const invoiceNumber = `INV-${Date.now()}`;
            invoice = await Invoice.create({
                patientId: prescription.patientId,
                invoiceNumber,
                items: [],
                totalAmount: 0,
                balanceDue: 0,
                status: "draft",
                dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
            });
        }

        // 3. Update Invoice
        invoice.items.push(...invoiceItems);
        invoice.totalAmount = invoice.items.reduce((sum: number, item: any) => sum + item.total, 0);
        invoice.balanceDue = invoice.totalAmount - invoice.amountPaid;
        await invoice.save();

        // 4. Update Prescription Status
        prescription.status = "completed";
        await prescription.save();

        return NextResponse.json({ success: true, invoice });

    } catch (error) {
        console.error("Error dispensing prescription:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
