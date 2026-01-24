import mongoose, { Schema, Document } from "mongoose";

export interface IPathologyReport extends Document {
    orderId: mongoose.Types.ObjectId;
    patientId: mongoose.Types.ObjectId;
    specimenSource: string;
    grossDescription: string;
    microscopicDescription: string;
    diagnosis: string;
    reportUrl?: string;
    clinicalHistory?: string;
    pathologistId: mongoose.Types.ObjectId;
    status: "draft" | "final";
    signedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const PathologyReportSchema = new Schema<IPathologyReport>(
    {
        orderId: { type: Schema.Types.ObjectId, ref: "LabOrder", required: true, index: true },
        patientId: { type: Schema.Types.ObjectId, ref: "Patient", required: true, index: true },
        specimenSource: { type: String, required: true },
        grossDescription: { type: String, required: true },
        microscopicDescription: { type: String, required: true },
        diagnosis: { type: String, required: true },
        reportUrl: { type: String },
        clinicalHistory: { type: String },
        pathologistId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        status: {
            type: String,
            required: true,
            enum: ["draft", "final"],
            default: "draft"
        },
        signedAt: { type: Date },
    },
    { timestamps: true }
);

export default mongoose.models.PathologyReport || mongoose.model<IPathologyReport>("PathologyReport", PathologyReportSchema);
