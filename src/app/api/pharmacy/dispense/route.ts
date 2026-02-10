
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from '@/lib/db';
import Prescription from "@/lib/models/Prescription";
import Invoice from "@/lib/models/Invoice";
import DispenseLog from "@/lib/models/DispenseLog";
import InventoryItem from "@/lib/models/InventoryItem";
import StockLedger from "@/lib/models/StockLedger";
import Payment from "@/lib/models/Payment";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !["pharmacist", "pharmacy", "admin", "doctor", "billing", "finance"].includes(session.user?.role as string)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        const body = await req.json();
        const { prescriptionId, items, patientId, customerDetails, paymentDetails } = body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json({ error: "No items to dispense" }, { status: 400 });
        }

        let prescription;
        if (prescriptionId) {
            prescription = await Prescription.findById(prescriptionId);
            if (!prescription) {
                return NextResponse.json({ error: "Prescription not found" }, { status: 404 });
            }
        }

        interface InvoiceItem {
            description: string;
            quantity: number;
            unitPrice: number;
            total: number;
            isInsuranceCovered: boolean;
        }

        const invoiceItems: InvoiceItem[] = [];
        let totalAmount = 0;

        // Phase 1: Verify Stock & Prepare Invoice Items
        for (const item of items) {
            let inventoryItem;
            if (item.sku) {
                inventoryItem = await InventoryItem.findOne({ sku: item.sku });
            } else if (item.drugName) {
                inventoryItem = await InventoryItem.findOne({
                    $or: [
                        { name: { $regex: new RegExp(`^${item.drugName}$`, 'i') } },
                        { name: { $regex: new RegExp(item.drugName, 'i') } }
                    ]
                });
            }

            if (!inventoryItem) {
                if (!prescriptionId) { // Strict for manual
                    return NextResponse.json({ error: `Item not found: ${item.drugName || item.sku}` }, { status: 400 });
                }
                console.warn(`Skipping stock deduction for ${item.drugName} (Not linked)`);
                return NextResponse.json({ error: `Inventory item not found for ${item.drugName}` }, { status: 400 });
            }

            if (inventoryItem.quantityOnHand < item.quantity) {
                return NextResponse.json({ error: `Insufficient stock for ${inventoryItem.name}. Available: ${inventoryItem.quantityOnHand}` }, { status: 400 });
            }

            // Deduct Stock
            if (!body.dryRun) {
                const previousStock = inventoryItem.quantityOnHand;
                inventoryItem.quantityOnHand -= item.quantity;
                await inventoryItem.save();

                // Log Movement in Ledger
                await StockLedger.create({
                    itemId: inventoryItem._id,
                    type: "out",
                    quantity: -item.quantity,
                    batchNumber: item.batchNumber || inventoryItem.lotNumber,
                    reason: prescriptionId ? "Prescription Dispense" : "Manual Sale",
                    recordedBy: session.user.id,
                    previousStock: previousStock,
                    newStock: inventoryItem.quantityOnHand,
                    transactionId: `DSP-${Date.now()}` // Will be refined by actual ID in Phase 4 if needed
                });
            }

            // Use Item Price or Manual Price
            const unitPrice = inventoryItem.sellingPrice || (inventoryItem.unitCost * 1.2) || 0;
            const lineTotal = item.quantity * unitPrice;

            invoiceItems.push({
                description: `Pharmacy: ${inventoryItem.name} (${item.quantity} ${inventoryItem.unit})`,
                quantity: item.quantity,
                unitPrice: unitPrice,
                total: lineTotal,
                isInsuranceCovered: false
            });

            totalAmount += lineTotal;
        }

        if (body.dryRun) {
            return NextResponse.json({ success: true, valid: true });
        }

        // Phase 2: Create/Update Invoice
        const targetPatientId = prescription ? prescription.patientId : patientId;

        let invoice;

        // If we have a patient, try to find an existing draft invoice
        if (targetPatientId) {
            invoice = await Invoice.findOne({
                patientId: targetPatientId,
                status: "draft"
            });
        }

        // Calculate Payment Fields
        const isPaid = paymentDetails?.amount >= totalAmount;
        const amountPaid = paymentDetails?.amount || (targetPatientId ? 0 : totalAmount);
        const invoiceStatus = isPaid ? "paid" : (amountPaid > 0 ? "partial" : "draft");

        // If no invoice found OR anonymous (manual sale), create new,
        if (!invoice) {
            const invoiceNumber = `INV-${Date.now()}`;
            invoice = await Invoice.create({
                patientId: targetPatientId || undefined,
                encounterId: prescription?.encounterId,
                customerDetails: customerDetails ? { name: customerDetails.name, phone: customerDetails.phone } : undefined,
                invoiceNumber,
                items: [],
                totalAmount: 0,
                balanceDue: 0,
                status: invoiceStatus,
                amountPaid: 0,
                dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            });
        }

        invoice.items.push(...invoiceItems);
        invoice.totalAmount = totalAmount; // Ensure matches
        invoice.amountPaid = (invoice.amountPaid || 0) + amountPaid;
        invoice.balanceDue = invoice.totalAmount - invoice.amountPaid;
        invoice.status = invoice.balanceDue <= 0 ? "paid" : (invoice.amountPaid > 0 ? "partial" : "draft");

        // Record Payment Split if payment details present
        if (paymentDetails) {
            invoice.paymentSplit.push({
                payer: targetPatientId ? "patient" : "third_party",
                amount: paymentDetails.amount,
                status: "paid",
                method: paymentDetails.mode,
                date: new Date()
            });
        }

        await invoice.save();

        // Phase 2.5: Create Payment Record for Billing Portal
        try {
            if (paymentDetails && paymentDetails.amount > 0) {
                // Map Pharmacy payment modes to Billing Payment methods
                let billingMethod: "cash" | "credit_card" | "debit_card" | "eft" = "cash";
                if (paymentDetails.mode === "card") billingMethod = "credit_card";
                if (paymentDetails.mode === "upi") billingMethod = "eft";

                await Payment.create({
                    patientId: targetPatientId || undefined,
                    customerName: !targetPatientId ? (customerDetails?.name || "Walk-in Customer") : undefined,
                    invoiceId: invoice._id,
                    amount: paymentDetails.amount,
                    paymentDate: new Date(),
                    method: billingMethod,
                    status: "completed",
                    notes: `Pharmacy Dispense: ${invoice.invoiceNumber}`
                });
            }
        } catch (paymentError: any) {
            console.error("Payment Record Creation Failed (Non-blocking):", paymentError);
            // We don't throw here to avoid failing the whole dispense if billing sync fails
        }

        // Phase 3: Archive Prescription if needed
        if (prescriptionId) {
            await Prescription.updateOne(
                { _id: prescriptionId },
                { $set: { status: "completed" } }
            );
        }

        // Phase 4: Create Dispense Log for Reports
        const logItems = invoiceItems.map(invItem => ({
            drugName: invItem.description.replace(/^Pharmacy: /, "").split(" (")[0],
            quantity: invItem.quantity,
            unitPrice: invItem.unitPrice,
            totalPrice: invItem.total
        }));

        await DispenseLog.create({
            dispenseId: `DSP-${Date.now()}`,
            patientId: targetPatientId || undefined,
            providerId: session.user.id,
            prescriptionId: prescription?._id,
            customerDetails: customerDetails || undefined,
            paymentMode: paymentDetails?.mode || undefined,
            paymentStatus: paymentDetails?.status || (invoice.status === 'paid' ? 'paid' : 'pending'),
            items: logItems,
            totalAmount: invoice.totalAmount,
            dispensedAt: new Date()
        });

        return NextResponse.json({ success: true, invoice });

    } catch (error: any) {
        console.error("Dispense Error:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
