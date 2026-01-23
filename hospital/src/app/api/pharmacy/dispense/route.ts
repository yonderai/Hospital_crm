import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import InventoryItem from "@/lib/models/InventoryItem";
import Prescription from "@/lib/models/Prescription";
import { protectRoute } from "@/lib/api-guard";

export async function POST(req: NextRequest) {
    const auth = await protectRoute(["pharmacist", "admin"]);
    if (auth.error) {
        return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    try {
        await dbConnect();
        const { prescriptionId } = await req.json();

        const prescription = await Prescription.findOne({ prescriptionId });
        if (!prescription) {
            return NextResponse.json({ error: "Prescription not found" }, { status: 404 });
        }

        if (prescription.status !== "active") {
            return NextResponse.json({ error: "Prescription is not active" }, { status: 400 });
        }

        // Stock Deduction Logic
        for (const med of prescription.medications) {
            const item = await InventoryItem.findOne({ name: med.drugName });
            if (!item) {
                return NextResponse.json({ error: `Drug not found in inventory: ${med.drugName}` }, { status: 404 });
            }
            if (item.quantityOnHand < med.quantity) {
                return NextResponse.json({ error: `Insufficient stock for: ${med.drugName}. Available: ${item.quantityOnHand}` }, { status: 400 });
            }
            item.quantityOnHand -= med.quantity;
            await item.save();
        }

        prescription.status = "completed";
        await prescription.save();

        return NextResponse.json({ message: "Dispensed successfully", prescription });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
