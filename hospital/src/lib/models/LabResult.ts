import mongoose, { Schema, Document } from "mongoose";

export interface ILabResult extends Document {
    orderId: mongoose.Types.ObjectId;
    patientId: mongoose.Types.ObjectId;
    testType: string;
    resultValue: string;
    unit: string;
    referenceRange: string;
    abnormalFlag: boolean;
    status: "preliminary" | "final" | "corrected";
    performedBy: mongoose.Types.ObjectId;
    verifiedBy?: mongoose.Types.ObjectId;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

const LabResultSchema = new Schema<ILabResult>(
    {
        orderId: { type: Schema.Types.ObjectId, ref: "LabOrder", required: true, index: true },
        patientId: { type: Schema.Types.ObjectId, ref: "Patient", required: true, index: true },
        testType: { type: String, required: true },
        resultValue: { type: String, required: true },
        unit: { type: String, required: true },
        referenceRange: { type: String, required: true },
        abnormalFlag: { type: Boolean, default: false },
        status: {
            type: String,
            required: true,
            enum: ["preliminary", "final", "corrected"],
            default: "preliminary"
        },
        performedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
        verifiedBy: { type: Schema.Types.ObjectId, ref: "User" },
        notes: { type: String },
    },
    { timestamps: true }
);

export default mongoose.models.LabResult || mongoose.model<ILabResult>("LabResult", LabResultSchema);
