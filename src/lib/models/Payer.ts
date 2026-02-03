import mongoose, { Schema, Document } from "mongoose";

export interface IPayer extends Document {
    name: string;
    payerType: "insurance" | "government" | "self-pay";
    contactPhone?: string;
    contactEmail?: string;
    address?: string;
    taxId?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const PayerSchema = new Schema<IPayer>(
    {
        name: { type: String, required: true },
        payerType: {
            type: String,
            required: true,
            enum: ["insurance", "government", "self-pay"]
        },
        contactPhone: { type: String, minlength: 10, maxlength: 10 },
        contactEmail: { type: String },
        address: { type: String },
        taxId: { type: String },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export default mongoose.models.Payer || mongoose.model<IPayer>("Payer", PayerSchema);
