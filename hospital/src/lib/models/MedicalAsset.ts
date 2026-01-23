import mongoose, { Schema, Document } from "mongoose";

export interface IMedicalAsset extends Document {
    assetTag: string;
    name: string;
    category: "imaging" | "monitoring" | "surgical" | "laboratory" | "facility";
    manufacturer: string;
    modelNumber: string;
    serialNumber: string;
    status: "operational" | "under-repair" | "decommissioned" | "calibration-due";
    location: {
        wardId?: mongoose.Types.ObjectId;
        department: string;
        roomNumber?: string;
    };
    purchaseDate: Date;
    warrantyExpiry: Date;
    lastMaintenanceDate?: Date;
    nextMaintenanceDate?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const MedicalAssetSchema = new Schema<IMedicalAsset>(
    {
        assetTag: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        category: {
            type: String,
            required: true,
            enum: ["imaging", "monitoring", "surgical", "laboratory", "facility"],
        },
        manufacturer: { type: String, required: true },
        modelNumber: { type: String, required: true },
        serialNumber: { type: String, required: true },
        status: {
            type: String,
            required: true,
            enum: ["operational", "under-repair", "decommissioned", "calibration-due"],
            default: "operational"
        },
        location: {
            wardId: { type: Schema.Types.ObjectId, ref: "Ward" },
            department: { type: String, required: true },
            roomNumber: { type: String },
        },
        purchaseDate: { type: Date, required: true },
        warrantyExpiry: { type: Date, required: true },
        lastMaintenanceDate: { type: Date },
        nextMaintenanceDate: { type: Date },
    },
    { timestamps: true }
);

export default mongoose.models.MedicalAsset || mongoose.model<IMedicalAsset>("MedicalAsset", MedicalAssetSchema);
