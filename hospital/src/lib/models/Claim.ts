import mongoose, { Schema, Document } from "mongoose";

export interface IClaim extends Document {
    patientId: mongoose.Types.ObjectId;
    encounterId: mongoose.Types.ObjectId;
    payerId: mongoose.Types.ObjectId;
    claimNumber: string;
    status: "draft" | "submitted" | "pending" | "paid" | "denied" | "appealed";
    amountBilled: number;
    amountAllowed?: number;
    adjudicationNotes?: string;
    submittedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const ClaimSchema = new Schema<IClaim>(
    {
        patientId: { type: Schema.Types.ObjectId, ref: "Patient", required: true, index: true },
        encounterId: { type: Schema.Types.ObjectId, ref: "Encounter", required: true, index: true },
        payerId: { type: Schema.Types.ObjectId, ref: "Payer", required: true, index: true },
        claimNumber: { type: String, required: true, unique: true },
        status: {
            type: String,
            required: true,
            enum: ["draft", "submitted", "pending", "paid", "denied", "appealed"],
            default: "draft"
        },
        amountBilled: { type: Number, required: true },
        amountAllowed: { type: Number },
        adjudicationNotes: { type: String },
        submittedAt: { type: Date },
    },
    { timestamps: true }
);

export default mongoose.models.Claim || mongoose.model<IClaim>("Claim", ClaimSchema);
