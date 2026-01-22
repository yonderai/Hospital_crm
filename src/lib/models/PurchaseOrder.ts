import mongoose, { Schema, Document } from "mongoose";

export interface IPOItem {
    itemId: mongoose.Types.ObjectId;
    quantity: number;
    unitCost: number;
    total: number;
}

export interface IPurchaseOrder extends Document {
    poNumber: string;
    supplierId: mongoose.Types.ObjectId;
    items: IPOItem[];
    totalAmount: number;
    status: "draft" | "ordered" | "received" | "cancelled";
    orderedAt?: Date;
    receivedAt?: Date;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

const POItemSchema = new Schema<IPOItem>({
    itemId: { type: Schema.Types.ObjectId, ref: "InventoryItem", required: true },
    quantity: { type: Number, required: true },
    unitCost: { type: Number, required: true },
    total: { type: Number, required: true },
});

const PurchaseOrderSchema = new Schema<IPurchaseOrder>(
    {
        poNumber: { type: String, required: true, unique: true },
        supplierId: { type: Schema.Types.ObjectId, ref: "Supplier", required: true, index: true },
        items: [POItemSchema],
        totalAmount: { type: Number, required: true },
        status: {
            type: String,
            required: true,
            enum: ["draft", "ordered", "received", "cancelled"],
            default: "draft"
        },
        orderedAt: { type: Date },
        receivedAt: { type: Date },
        notes: { type: String },
    },
    { timestamps: true }
);

export default mongoose.models.PurchaseOrder || mongoose.model<IPurchaseOrder>("PurchaseOrder", PurchaseOrderSchema);
