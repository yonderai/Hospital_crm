import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import InventoryItem from "@/lib/models/InventoryItem";
import { DollarSign, FileText, CheckCircle, Activity, Package } from "lucide-react";

export async function GET(req: Request) {
    try {
        await dbConnect();

        const items = await InventoryItem.find().sort({ createdAt: -1 }).limit(100);

        // Calculate Stats
        const totalItems = items.length;
        const lowStock = items.filter(i => i.quantityOnHand <= i.reorderLevel).length;
        const totalValue = items.reduce((acc, curr) => acc + (curr.quantityOnHand * curr.unitCost), 0);

        // Items expiring in 30 days (mocking check based on batch or direct field)
        const now = new Date();
        const thirtyDaysInfo = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
        const expiring = items.filter(i => i.expiryDate && new Date(i.expiryDate) <= thirtyDaysInfo && new Date(i.expiryDate) >= now).length;

        const mappedData = items.map(i => ({
            id: i.sku,
            name: i.name,
            status: i.quantityOnHand <= i.reorderLevel ? 'Reorder' : 'In Stock',
            date: i.expiryDate ? new Date(i.expiryDate).toLocaleDateString() : 'N/A',
            value: `${i.quantityOnHand} units`
        }));

        // Formatter for Currency
        const formatCurrency = (amount: number) => `₹${(amount / 1000).toFixed(1)}k`;

        const stats = [
            { label: "Total Items", value: totalItems.toString(), change: "+12", icon: "Package", color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Low Stock", value: lowStock.toString(), change: "-2", icon: "Activity", color: "text-red-600", bg: "bg-red-50" },
            { label: "Inventory Value", value: formatCurrency(totalValue), change: "+5.1%", icon: "DollarSign", color: "text-green-600", bg: "bg-green-50" },
            { label: "Expiring Soon", value: expiring.toString(), change: "Alert", icon: "FileText", color: "text-orange-600", bg: "bg-orange-50" },
        ];

        return NextResponse.json({
            data: mappedData,
            stats: stats
        });

    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch stock summary" }, { status: 500 });
    }
}
