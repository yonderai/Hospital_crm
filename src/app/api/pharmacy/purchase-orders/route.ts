import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import PurchaseOrder from "@/lib/models/PurchaseOrder";
import InventoryItem from "@/lib/models/InventoryItem";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const data = await req.json();

        if (!data.poNumber) {
            data.poNumber = `PO-${Date.now().toString().slice(-8)}`;
        }

        const po = await PurchaseOrder.create(data);
        return NextResponse.json(po, { status: 201 });
    } catch (error: any) {
        console.error("Purchase Order Creation Error:", error);
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const { searchParams } = new URL(req.url);
        const supplierId = searchParams.get("supplierId");
        const status = searchParams.get("status");

        let filter: any = {};
        if (supplierId) filter.supplierId = supplierId;
        if (status) filter.status = status;

        const pos = await PurchaseOrder.find(filter)
            .populate("supplierId", "name")
            .sort({ createdAt: -1 });

        return NextResponse.json(pos);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// Special route for receiving a PO (updating inventory)
export async function PATCH(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const mongoose = require('mongoose');
    const dbSession = await mongoose.startSession();
    dbSession.startTransaction();

    try {
        await dbConnect();
        const { poId, status } = await req.json();

        if (status !== "received") {
            return NextResponse.json({ error: "Invalid status for PATCH" }, { status: 400 });
        }

        const po = await PurchaseOrder.findById(poId).session(dbSession);
        if (!po || po.status === "received") {
            throw new Error("Invalid PO or already received");
        }

        // Update inventory for each item in PO
        for (const item of po.items) {
            await InventoryItem.findByIdAndUpdate(
                item.itemId,
                { $inc: { quantityOnHand: item.quantity } },
                { session: dbSession }
            );
        }

        po.status = "received";
        po.receivedAt = new Date();
        await po.save({ session: dbSession });

        await dbSession.commitTransaction();
        dbSession.endSession();

        return NextResponse.json(po);
    } catch (error: any) {
        await dbSession.abortTransaction();
        dbSession.endSession();
        console.error("PO Receiving Error:", error);
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
