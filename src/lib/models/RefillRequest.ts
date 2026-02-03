import mongoose, { Schema, Document } from "mongoose";

export interface IRefillRequest extends Document {
    patientId: mongoose.Types.ObjectId;
    prescriptionId: mongoose.Types.ObjectId; // Ref to Prescription _id
    drugName: string;
    doctorId: mongoose.Types.ObjectId;
    status: "pending" | "approved" | "rejected";
    requestDate: Date;
    notes?: string;
}

const RefillRequestSchema = new Schema<IRefillRequest>(
    {
        patientId: { type: Schema.Types.ObjectId, ref: "Patient", required: true },
        prescriptionId: { type: Schema.Types.ObjectId, ref: "Prescription", required: true },
        drugName: { type: String, required: true },
        doctorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending"
        },
        requestDate: { type: Date, default: Date.now },
        notes: { type: String }
    },
    { timestamps: true }
);

export default mongoose.models.RefillRequest || mongoose.model<IRefillRequest>("RefillRequest", RefillRequestSchema);
