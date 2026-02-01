import mongoose, { Schema, Document } from "mongoose";
import "./Patient";
import "./User";

export interface ILabOrder extends Document {
    orderId: string;
    patientId: mongoose.Types.ObjectId;
    orderingProviderId?: mongoose.Types.ObjectId;
    orderSource: "internal" | "direct";
    encounterId?: mongoose.Types.ObjectId;
    appointmentId?: mongoose.Types.ObjectId;
    tests: string[];
    scheduledAt?: Date;
    technicianId?: mongoose.Types.ObjectId;
    priority: "routine" | "urgent" | "stat";
    status: "ordered" | "scheduled" | "collected" | "in-progress" | "completed" | "cancelled";
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
    reportImages?: string[];
    createdAt: Date;
    updatedAt: Date;
}

const LabOrderSchema = new Schema<ILabOrder>(
    {
        orderId: { type: String, required: true, unique: true },
        patientId: { type: Schema.Types.ObjectId, ref: "Patient", required: true, index: true },
        orderingProviderId: { type: Schema.Types.ObjectId, ref: "User", index: true },
        orderSource: { type: String, enum: ["internal", "direct"], default: "internal" },
        encounterId: { type: Schema.Types.ObjectId, ref: "Encounter" },
        appointmentId: { type: Schema.Types.ObjectId, ref: "Appointment" },
        tests: { type: [String], required: true },
        scheduledAt: { type: Date },
        technicianId: { type: Schema.Types.ObjectId, ref: "User" },
        priority: {
            type: String,
            default: "routine",
            enum: ["routine", "urgent", "stat"]
        },
        status: {
            type: String,
            default: "ordered",
            enum: ["ordered", "scheduled", "collected", "in-progress", "completed", "cancelled"]
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
        reportImages: { type: [String], default: [] },
    },
    { timestamps: true }
);

export default mongoose.models.LabOrder || mongoose.model<ILabOrder>("LabOrder", LabOrderSchema);
