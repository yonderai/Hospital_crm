import mongoose, { Schema, Document } from "mongoose";

export interface IEmergencyCase extends Document {
    patientId?: mongoose.Types.ObjectId; // Optional if unknown
    tempName?: string; // e.g., "Doe, John (Trauma A)"
    mrn?: string; // If known
    age?: number;
    gender?: string;
    triageLevel: "P1" | "P2" | "P3" | "P4" | "P5";
    vitals: {
        recordedAt: Date;
        bp: string;
        pulse: number;
        spo2: number;
        temp: number;
        gcs?: number;
        painScale?: number; // 1-10
        takenBy: string; // Staff Name
    }[];
    status: "triage" | "treatment" | "observation" | "admitted" | "discharged" | "expired";
    assignedDoctorId?: mongoose.Types.ObjectId;
    chiefComplaint: string;
    notes?: string;
    arrivalMode: "ambulance" | "walk-in" | "referral" | "police";
    ambulanceId?: mongoose.Types.ObjectId; // If arrived by ambulance
    createdAt: Date;
    updatedAt: Date;
}

const EmergencyCaseSchema = new Schema<IEmergencyCase>(
    {
        patientId: { type: Schema.Types.ObjectId, ref: "Patient" },
        tempName: { type: String },
        mrn: { type: String },
        age: { type: Number },
        gender: { type: String },
        triageLevel: {
            type: String,
            required: true,
            enum: ["P1", "P2", "P3", "P4", "P5"],
            default: "P3"
        },
        vitals: [
            {
                recordedAt: { type: Date, default: Date.now },
                bp: String,
                pulse: Number,
                spo2: Number,
                temp: Number,
                gcs: Number,
                painScale: Number,
                takenBy: String
            }
        ],
        status: {
            type: String,
            required: true,
            enum: ["triage", "treatment", "observation", "admitted", "discharged", "expired"],
            default: "triage"
        },
        assignedDoctorId: { type: Schema.Types.ObjectId, ref: "User" },
        chiefComplaint: { type: String, required: true },
        notes: { type: String },
        arrivalMode: {
            type: String,
            required: true,
            enum: ["ambulance", "walk-in", "referral", "police"],
            default: "walk-in"
        },
        ambulanceId: { type: Schema.Types.ObjectId, ref: "Ambulance" },
    },
    { timestamps: true }
);

export default mongoose.models.EmergencyCase || mongoose.model<IEmergencyCase>("EmergencyCase", EmergencyCaseSchema);
