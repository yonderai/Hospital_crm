import mongoose, { Schema, Document } from "mongoose";

export interface IStockLedger extends Document {
    itemId: mongoose.Types.ObjectId;
    type: "in" | "out" | "adjustment" | "transfer";
    quantity: number; // Positive for in, Negative for out
    batchNumber?: string;
    reason: string;
    recordedBy: mongoose.Types.ObjectId;
    previousStock: number;
    newStock: number;
    transactionId?: string; // Reference to DispenseId or PurchaseOrderId
    createdAt: Date;
}

const StockLedgerSchema = new Schema<IStockLedger>(
    {
        itemId: { type: Schema.Types.ObjectId, ref: "InventoryItem", required: true, index: true },
        type: {
            type: String,
            required: true,
            enum: ["in", "out", "adjustment", "transfer"],
            index: true
        },
        quantity: { type: Number, required: true },
        batchNumber: { type: String },
        reason: { type: String, required: true },
        recordedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
        previousStock: { type: Number, required: true },
        newStock: { type: Number, required: true },
        transactionId: { type: String },
    },
    { timestamps: true }
);

export default mongoose.models.StockLedger || mongoose.model<IStockLedger>("StockLedger", StockLedgerSchema);
