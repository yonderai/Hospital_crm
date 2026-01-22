import mongoose, { Schema, Document } from "mongoose";

export interface IMaintenanceLog extends Document {
    assetId: mongoose.Types.ObjectId;
    maintenanceType: "preventive" | "corrective" | "calibration" | "inspection";
    description: string;
    technicianName: string;
    status: "scheduled" | "in-progress" | "completed";
    performedAt?: Date;
    nextScheduledDate?: Date;
    partsReplaced?: string[];
    cost?: number;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

const MaintenanceLogSchema = new Schema<IMaintenanceLog>(
    {
        assetId: { type: Schema.Types.ObjectId, ref: "MedicalAsset", required: true, index: true },
        maintenanceType: {
            type: String,
            required: true,
            enum: ["preventive", "corrective", "calibration", "inspection"],
        },
        description: { type: String, required: true },
        technicianName: { type: String, required: true },
        status: {
            type: String,
            required: true,
            enum: ["scheduled", "in-progress", "completed"],
            default: "scheduled"
        },
        performedAt: { type: Date },
        nextScheduledDate: { type: Date },
        partsReplaced: { type: [String], default: [] },
        cost: { type: Number },
        notes: { type: String },
    },
    { timestamps: true }
);

export default mongoose.models.MaintenanceLog || mongoose.model<IMaintenanceLog>("MaintenanceLog", MaintenanceLogSchema);
