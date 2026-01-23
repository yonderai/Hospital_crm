import mongoose, { Schema, Document } from "mongoose";

export interface ILabOrder extends Document {
    orderId: string;
    patientId: mongoose.Types.ObjectId;
    orderingProviderId: mongoose.Types.ObjectId;
    encounterId?: mongoose.Types.ObjectId;
    tests: string[];
    priority: "routine" | "urgent" | "stat";
    status: "ordered" | "collected" | "in-progress" | "completed" | "cancelled";
    sampleCollectedAt?: Date;
    results: {
        testName: string;
        value: string;
        unit: string;
        referenceRange: string;
        abnormalFlag: boolean;
        notes?: string;
    }[];
    resultDate?: Date;
    reviewedBy?: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const LabOrderSchema = new Schema<ILabOrder>(
    {
        orderId: { type: String, required: true, unique: true },
        patientId: { type: Schema.Types.ObjectId, ref: "Patient", required: true, index: true },
        orderingProviderId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
        encounterId: { type: Schema.Types.ObjectId, ref: "Encounter" },
        tests: { type: [String], required: true },
        priority: {
            type: String,
            default: "routine",
            enum: ["routine", "urgent", "stat"]
        },
        status: {
            type: String,
            default: "ordered",
            enum: ["ordered", "collected", "in-progress", "completed", "cancelled"]
        },
        sampleCollectedAt: { type: Date },
        results: [
            {
                testName: { type: String, required: true },
                value: { type: String, required: true },
                unit: { type: String, required: true },
                referenceRange: { type: String, required: true },
                abnormalFlag: { type: Boolean, default: false },
                notes: { type: String },
            },
        ],
        resultDate: { type: Date },
        reviewedBy: { type: Schema.Types.ObjectId, ref: "User" },
    },
    { timestamps: true }
);

export default mongoose.models.LabOrder || mongoose.model<ILabOrder>("LabOrder", LabOrderSchema);
