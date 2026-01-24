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
    location?: string; // e.g., "Shelf A-1"
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
        location: { type: String },
        lotNumber: { type: String },
        expiryDate: { type: Date },
        supplierId: { type: Schema.Types.ObjectId, ref: "Supplier" },
        isActive: { type: Boolean, default: true },
        batches: [{
            lotNumber: { type: String },
            expiryDate: { type: Date },
            quantity: { type: Number }
        }]
    },
    { timestamps: true }
);

export default mongoose.models.InventoryItem || mongoose.model<IInventoryItem>("InventoryItem", InventoryItemSchema);
