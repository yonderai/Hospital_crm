import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import InventoryItem from "@/lib/models/InventoryItem";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !["pharmacist", "pharmacy", "admin"].includes(session.user?.role as string)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        // Aggregate stock by Zone and Block
        const distribution = await InventoryItem.aggregate([
            {
                $group: {
                    _id: {
                        zone: "$location.zone",
                        block: "$location.block"
                    },
                    itemCount: { $sum: 1 },
                    totalStock: { $sum: "$quantityOnHand" },
                    lowStockItems: {
                        $sum: {
                            $cond: [{ $lte: ["$quantityOnHand", "$reorderLevel"] }, 1, 0]
                        }
                    }
                }
            },
            { $sort: { "_id.zone": 1, "_id.block": 1 } }
        ]);

        return NextResponse.json(distribution);

    } catch (error) {
        console.error("Distribution Fetch Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
