import mongoose, { Schema, Document } from "mongoose";

export interface IDispenseLog extends Document {
    dispenseId: string;
    patientId?: mongoose.Types.ObjectId;
    providerId: mongoose.Types.ObjectId; // Pharmacist who dispensed
    prescriptionId?: mongoose.Types.ObjectId;
    customerDetails?: {
        name: string;
        phone: string;
        email?: string;
    };
    paymentMode?: "cash" | "upi" | "card";
    paymentStatus?: "paid" | "partial" | "pending";
    items: {
        drugName: string;
        sku?: string;
        quantity: number;
        unitPrice: number;
        totalPrice: number;
    }[];
    totalAmount: number;
    dispensedAt: Date;
}

const DispenseLogSchema = new Schema<IDispenseLog>(
    {
        dispenseId: { type: String, required: true, unique: true },
        patientId: { type: Schema.Types.ObjectId, ref: "Patient", index: true }, // Optional for manual/walk-in
        providerId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
        prescriptionId: { type: Schema.Types.ObjectId, ref: "Prescription", index: true },
        customerDetails: {
            name: { type: String },
            phone: { type: String, minlength: 10, maxlength: 10 },
            email: { type: String }
        },
        paymentMode: { type: String, enum: ["cash", "upi", "card"] },
        paymentStatus: { type: String, enum: ["paid", "partial", "pending"], default: "paid" },
        items: [
            {
                drugName: { type: String, required: true },
                sku: { type: String },
                quantity: { type: Number, required: true },
                unitPrice: { type: Number, required: true },
                totalPrice: { type: Number, required: true },
            },
        ],
        totalAmount: { type: Number, required: true },
        dispensedAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

export default mongoose.models.DispenseLog || mongoose.model<IDispenseLog>("DispenseLog", DispenseLogSchema);
