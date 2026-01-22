import mongoose, { Schema, Document } from "mongoose";

export interface IRadiologyReport extends Document {
    orderId: mongoose.Types.ObjectId;
    patientId: mongoose.Types.ObjectId;
    interpretedBy: mongoose.Types.ObjectId;
    findings: string;
    impression: string;
    recommendations?: string;
    images?: string[]; // URLs or references to PACs/Storage
    status: "draft" | "preliminary" | "final" | "corrected";
    signedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const RadiologyReportSchema = new Schema<IRadiologyReport>(
    {
        orderId: { type: Schema.Types.ObjectId, ref: "ImagingOrder", required: true, index: true },
        patientId: { type: Schema.Types.ObjectId, ref: "Patient", required: true, index: true },
        interpretedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
        findings: { type: String, required: true },
        impression: { type: String, required: true },
        recommendations: { type: String },
        images: { type: [String], default: [] },
        status: {
            type: String,
            required: true,
            enum: ["draft", "preliminary", "final", "corrected"],
            default: "draft"
        },
        signedAt: { type: Date },
    },
    { timestamps: true }
);

export default mongoose.models.RadiologyReport || mongoose.model<IRadiologyReport>("RadiologyReport", RadiologyReportSchema);
