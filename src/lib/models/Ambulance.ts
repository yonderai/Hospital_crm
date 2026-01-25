import mongoose, { Schema, Document } from "mongoose";

export interface IAmbulance extends Document {
    plateNumber: string;
    driverName: string;
    driverContact: string;
    status: "available" | "busy" | "maintenance";
    currentLocation?: string;
    eta?: string; // e.g. "10 mins"
    activeCaseId?: mongoose.Types.ObjectId;
    equipmentLevel: "basic" | "als" | "icu"; // Basic, Advanced Life Support, Mobile ICU
    createdAt: Date;
    updatedAt: Date;
}

const AmbulanceSchema = new Schema<IAmbulance>(
    {
        plateNumber: { type: String, required: true, unique: true },
        driverName: { type: String, required: true },
        driverContact: { type: String, required: true },
        status: {
            type: String,
            required: true,
            enum: ["available", "busy", "maintenance"],
            default: "available"
        },
        currentLocation: { type: String },
        eta: { type: String },
        activeCaseId: { type: Schema.Types.ObjectId, ref: "EmergencyCase" },
        equipmentLevel: {
            type: String,
            required: true,
            enum: ["basic", "als", "icu"],
            default: "basic"
        }
    },
    { timestamps: true }
);

export default mongoose.models.Ambulance || mongoose.model<IAmbulance>("Ambulance", AmbulanceSchema);
