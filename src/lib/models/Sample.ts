import mongoose, { Schema, Document } from "mongoose";

export interface ISample extends Document {
    sampleId: string;
    orderId: mongoose.Types.ObjectId;
    patientId: mongoose.Types.ObjectId;
    testTypes: string[];
    status: "COLLECTED" | "IN_LAB" | "PROCESSING" | "COMPLETED";
    collectedBy: mongoose.Types.ObjectId;
    collectedAt: Date;
    processedAt?: Date;
    completedAt?: Date;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

const SampleSchema = new Schema<ISample>(
    {
        sampleId: { type: String, required: true, unique: true },
        orderId: { type: Schema.Types.ObjectId, ref: "LabOrder", required: true },
        patientId: { type: Schema.Types.ObjectId, ref: "Patient", required: true },
        testTypes: { type: [String], required: true },
        status: {
            type: String,
            required: true,
            enum: ["COLLECTED", "IN_LAB", "PROCESSING", "COMPLETED"],
            default: "COLLECTED"
        },
        collectedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
        collectedAt: { type: Date, default: Date.now },
        processedAt: { type: Date },
        completedAt: { type: Date },
        notes: { type: String },
    },
    { timestamps: true }
);

export default mongoose.models.Sample || mongoose.model<ISample>("Sample", SampleSchema);
