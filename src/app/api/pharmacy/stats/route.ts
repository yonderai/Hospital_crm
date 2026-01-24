import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import Prescription from "@/lib/models/Prescription";
import InventoryItem from "@/lib/models/InventoryItem";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user?.role !== "pharmacist") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        // 1. Pending Prescriptions
        const pendingRxCount = await Prescription.countDocuments({ status: "active" });

        // 2. Low Stock Items (e.g. < reorderLevel)
        // Note: Using $expr to compare fields if needed, or simple query if hardcoded. 
        // For accurate reorder check: quantityOnHand <= reorderLevel
        const lowStockCount = await InventoryItem.countDocuments({
            $expr: { $lte: ["$quantityOnHand", "$reorderLevel"] }
        });

        // 3. Expiring Soon (Next 30 days)
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

        const expiringCount = await InventoryItem.countDocuments({
            expiryDate: { $lte: thirtyDaysFromNow, $gte: new Date() }
        });

        // 4. Sales Today (Assuming completed prescriptions today)
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const salesToday = await Prescription.countDocuments({
            status: "completed",
            updatedAt: { $gte: startOfDay }
        });

        return NextResponse.json({
            pendingRx: pendingRxCount,
            lowStock: lowStockCount,
            expiring: expiringCount,
            salesToday: salesToday
        });

    } catch (error) {
        console.error("Error fetching pharmacy stats:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
