import mongoose, { Schema, Document } from "mongoose";

export interface IInventoryItem extends Document {
    sku: string;
    name: string;
    description?: string;
    category: "medication" | "supply" | "equipment";
    unit: string; // e.g., "tablet", "bottle", "box"
    quantityOnHand: number;
    reorderLevel: number;
    unitCost: number;
    sellingPrice?: number;
    location?: {
        zone: string;
        block: string;
        shelf: string;
        drawer?: string;
    }; // Structured Storage Location
    lotNumber?: string;
    expiryDate?: Date;
    supplierId?: mongoose.Types.ObjectId;
    isActive: boolean;
    batches?: {
        lotNumber: string;
        expiryDate: Date;
        quantity: number;
    }[];
    createdAt: Date;
    updatedAt: Date;
}

const InventoryItemSchema = new Schema<IInventoryItem>(
    {
        sku: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        description: { type: String },
        category: {
            type: String,
            required: true,
            enum: ["medication", "supply", "equipment"],
            default: "medication"
        },
        unit: { type: String, required: true },
        quantityOnHand: { type: Number, required: true, default: 0 },
        reorderLevel: { type: Number, required: true, default: 10 },
        unitCost: { type: Number, required: true },
        sellingPrice: { type: Number },
        location: {
            zone: { type: String, required: true, enum: ["Tablet", "Syrup", "Injection", "Ointment", "Drops", "Surgical", "Others"] },
            block: { type: String, required: true }, // e.g., B1, B2
            shelf: { type: String, required: true }, // e.g., S3
            drawer: { type: String }, // Optional
        },
        lotNumber: { type: String },
        expiryDate: { type: Date },
        supplierId: { type: Schema.Types.ObjectId, ref: "Supplier" },
        isActive: { type: Boolean, default: true },
        batches: [{
            lotNumber: { type: String, required: true },
            expiryDate: { type: Date, required: true },
            quantity: { type: Number, required: true, default: 0 },
            location: {
                zone: { type: String },
                block: { type: String },
                shelf: { type: String }
            }
        }]
    },
    { timestamps: true }
);

// In Next.js, models can sometimes be cached with old schemas during development.
// This ensures we always use the latest definition.
if (mongoose.models.InventoryItem) {
    delete mongoose.models.InventoryItem;
}

export default mongoose.model<IInventoryItem>("InventoryItem", InventoryItemSchema);

