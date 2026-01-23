import mongoose, { Schema, Document } from "mongoose";

export interface IWard extends Document {
    name: string;
    type: "general" | "icu" | "emergency" | "maternity" | "pediatric" | "surgical";
    capacity: number;
    wing: string;
    floor: string;
    status: "active" | "under-maintenance" | "closed";
    createdAt: Date;
    updatedAt: Date;
}

export interface IBed extends Document {
    bedNumber: string;
    wardId: mongoose.Types.ObjectId;
    type: "standard" | "ventilator" | "isolation" | "bariatric";
    status: "available" | "occupied" | "maintenance" | "reserved" | "cleaning";
    patientId?: mongoose.Types.ObjectId;
    currentEncounterId?: mongoose.Types.ObjectId;
    lastCleanedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const WardSchema = new Schema<IWard>(
    {
        name: { type: String, required: true, unique: true },
        type: {
            type: String,
            required: true,
            enum: ["general", "icu", "emergency", "maternity", "pediatric", "surgical"],
            default: "general"
        },
        capacity: { type: Number, required: true },
        wing: { type: String, required: true },
        floor: { type: String, required: true },
        status: {
            type: String,
            required: true,
            enum: ["active", "under-maintenance", "closed"],
            default: "active"
        },
    },
    { timestamps: true }
);

const BedSchema = new Schema<IBed>(
    {
        bedNumber: { type: String, required: true },
        wardId: { type: Schema.Types.ObjectId, ref: "Ward", required: true, index: true },
        type: {
            type: String,
            required: true,
            enum: ["standard", "ventilator", "isolation", "bariatric"],
            default: "standard"
        },
        status: {
            type: String,
            required: true,
            enum: ["available", "occupied", "maintenance", "reserved", "cleaning"],
            default: "available"
        },
        patientId: { type: Schema.Types.ObjectId, ref: "Patient", index: true },
        currentEncounterId: { type: Schema.Types.ObjectId, ref: "Encounter" },
        lastCleanedAt: { type: Date },
    },
    { timestamps: true }
);

// Compound index for unique bed numbers within a ward
BedSchema.index({ bedNumber: 1, wardId: 1 }, { unique: true });

export const Ward = mongoose.models.Ward || mongoose.model<IWard>("Ward", WardSchema);
export const Bed = mongoose.models.Bed || mongoose.model<IBed>("Bed", BedSchema);
