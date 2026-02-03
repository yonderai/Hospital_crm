import mongoose, { Schema, Document } from "mongoose";

export interface IBed extends Document {
    bedNumber: string; // e.g., "101-A"
    roomNumber: string; // e.g., "101"
    floor: string; // e.g., "1st Floor"
    ward: string; // e.g., "General Ward", "ICU", "Private"
    type: "general" | "icu" | "private" | "emergency";
    status: "available" | "occupied" | "maintenance" | "cleaning";
    currentPatientId?: mongoose.Types.ObjectId; // Ref to Patient
    dailyRate: number;
    features: string[]; // e.g., "Ventilator", "Oxygen"
}

const BedSchema = new Schema<IBed>(
    {
        bedNumber: { type: String, required: true, unique: true },
        roomNumber: { type: String, required: true },
        floor: { type: String, required: true },
        ward: { type: String, required: true },
        type: {
            type: String,
            enum: ["general", "icu", "private", "emergency"],
            required: true
        },
        status: {
            type: String,
            enum: ["available", "occupied", "maintenance", "cleaning"],
            default: "available"
        },
        currentPatientId: { type: Schema.Types.ObjectId, ref: "Patient" },
        dailyRate: { type: Number, required: true },
        features: { type: [String], default: [] }
    },
    { timestamps: true }
);

export default mongoose.models.HospitalBed || mongoose.model<IBed>("HospitalBed", BedSchema);
