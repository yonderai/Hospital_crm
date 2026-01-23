import mongoose, { Schema, Document } from "mongoose";

export interface IPayment extends Document {
    patientId: mongoose.Types.ObjectId;
    invoiceId?: mongoose.Types.ObjectId;
    claimId?: mongoose.Types.ObjectId;
    amount: number;
    paymentDate: Date;
    method: "cash" | "credit_card" | "debit_card" | "eft" | "check" | "insurance_eft";
    status: "pending" | "completed" | "failed" | "refunded";
    transactionReference?: string;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
    {
        patientId: { type: Schema.Types.ObjectId, ref: "Patient", required: true, index: true },
        invoiceId: { type: Schema.Types.ObjectId, ref: "Invoice", index: true },
        claimId: { type: Schema.Types.ObjectId, ref: "Claim", index: true },
        amount: { type: Number, required: true },
        paymentDate: { type: Date, default: Date.now },
        method: {
            type: String,
            required: true,
            enum: ["cash", "credit_card", "debit_card", "eft", "check", "insurance_eft"]
        },
        status: {
            type: String,
            required: true,
            enum: ["pending", "completed", "failed", "refunded"],
            default: "completed"
        },
        transactionReference: { type: String },
        notes: { type: String },
    },
    { timestamps: true }
);

export default mongoose.models.Payment || mongoose.model<IPayment>("Payment", PaymentSchema);
