import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import InventoryItem from "@/lib/models/InventoryItem";
import StockLedger from "@/lib/models/StockLedger";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !["pharmacist", "pharmacy", "admin", "doctor"].includes(session.user?.role as string)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        const { searchParams } = new URL(req.url);
        const query = searchParams.get('search');
        const category = searchParams.get('category');

        let filter: any = {};

        // If searching, use regex for case-insensitive partial match
        if (query) {
            filter.name = { $regex: query, $options: 'i' };
        }

        // Optional category filter (defaults to 'medication' for doctors usually, but let's keep it flexible)
        if (category) {
            filter.category = category;
        }

        // Limit results if searching to avoid huge payloads
        const limit = query ? 50 : 0;

        const items = await InventoryItem.find(filter).sort({ name: 1 }).limit(limit);
        return NextResponse.json(items);

    } catch (error) {
        console.error("Inventory Fetch Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !["pharmacist", "pharmacy", "admin"].includes(session.user?.role as string)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const bodyWithId = await req.json();
        const { _id, ...body } = bodyWithId;

        // Basic validation
        if (!body.sku || !body.name || !body.unit || body.unitCost === undefined) {
            return NextResponse.json({ error: "SKU, Name, Unit, and Unit Cost are required" }, { status: 400 });
        }

        // Mandatory Location Validation
        if (!body.location || !body.location.zone || !body.location.block || !body.location.shelf) {
            return NextResponse.json({ error: "Zone, Block, and Shelf are mandatory for storage location" }, { status: 400 });
        }

        // Normalize location data (Uppercase + Trim)
        const location = {
            zone: body.location.zone,
            block: body.location.block.trim().toUpperCase(),
            shelf: body.location.shelf.trim().toUpperCase(),
            drawer: body.location.drawer?.trim().toUpperCase() || ""
        };

        // Check for location occupancy (Case-insensitive)
        const existingAtLocation = await InventoryItem.findOne({
            "location.zone": location.zone,
            "location.block": location.block,
            "location.shelf": location.shelf,
            "location.drawer": location.drawer
        });

        if (existingAtLocation) {
            return NextResponse.json({
                error: `Location already occupied by ${existingAtLocation.name} (SKU: ${existingAtLocation.sku})`
            }, { status: 409 });
        }

        const newItem = await InventoryItem.create({
            ...body,
            location, // Use normalized location
            quantityOnHand: body.quantityOnHand || 0,
            reorderLevel: body.reorderLevel || 10,
            isActive: true
        });

        // Log Initial Stock in Ledger
        if (newItem.quantityOnHand > 0) {
            await StockLedger.create({
                itemId: newItem._id,
                type: "in",
                quantity: newItem.quantityOnHand,
                batchNumber: newItem.lotNumber,
                reason: "Initial Stock Entry",
                recordedBy: session.user.id,
                previousStock: 0,
                newStock: newItem.quantityOnHand
            });
        }

        return NextResponse.json({ success: true, item: newItem });

    } catch (error: any) {
        console.error("Inventory Item Creation Error:", error);
        if (error.code === 11000) {
            return NextResponse.json({ error: "SKU already exists" }, { status: 400 });
        }
        return NextResponse.json({ error: error.message || "Error creating item" }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !["pharmacist", "pharmacy", "admin"].includes(session.user?.role as string)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const { _id, ...updates } = await req.json();

        // Check for location occupancy if location is being updated
        if (updates.location) {
            // Normalize location data
            updates.location = {
                zone: updates.location.zone,
                block: updates.location.block.trim().toUpperCase(),
                shelf: updates.location.shelf.trim().toUpperCase(),
                drawer: updates.location.drawer?.trim().toUpperCase() || ""
            };

            const existingAtLocation = await InventoryItem.findOne({
                _id: { $ne: _id },
                "location.zone": updates.location.zone,
                "location.block": updates.location.block,
                "location.shelf": updates.location.shelf,
                "location.drawer": updates.location.drawer
            });

            if (existingAtLocation) {
                return NextResponse.json({
                    error: `Location already occupied by ${existingAtLocation.name} (SKU: ${existingAtLocation.sku})`
                }, { status: 409 });
            }
        }

        const updatedItem = await InventoryItem.findByIdAndUpdate(_id, updates, { new: true });
        return NextResponse.json({ success: true, item: updatedItem });

    } catch (error) {
        return NextResponse.json({ error: "Error updating item" }, { status: 500 });
    }
}
