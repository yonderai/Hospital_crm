import mongoose, { Schema, Document } from "mongoose";

export interface IEncounter extends Document {
    encounterId: string;
    patientId: mongoose.Types.ObjectId;
    providerId: mongoose.Types.ObjectId;
    appointmentId?: mongoose.Types.ObjectId;
    encounterDate: Date;
    type: "outpatient" | "inpatient" | "emergency" | "telemedicine";
    chiefComplaint: string;
    vitals: {
        temperature?: number;
        bloodPressure?: string;
        heartRate?: number;
        respiratoryRate?: number;
        oxygenSaturation?: number;
        weight?: number;
        height?: number;
        bmi?: number;
    };
    soapNotes: {
        subjective: string;
        objective: string;
        assessment: string;
        plan: string;
    };
    diagnosis: string[]; // ICD-10
    status: "open" | "closed";
    createdAt: Date;
    updatedAt: Date;
}

const EncounterSchema = new Schema<IEncounter>(
    {
        encounterId: { type: String, required: true, unique: true },
        patientId: { type: Schema.Types.ObjectId, ref: "Patient", required: true, index: true },
        providerId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
        appointmentId: { type: Schema.Types.ObjectId, ref: "Appointment" },
        encounterDate: { type: Date, default: Date.now },
        type: {
            type: String,
            required: true,
            enum: ["outpatient", "inpatient", "emergency", "telemedicine"]
        },
        chiefComplaint: { type: String, required: true },
        vitals: {
            temperature: { type: Number },
            bloodPressure: { type: String },
            heartRate: { type: Number },
            respiratoryRate: { type: Number },
            oxygenSaturation: { type: Number },
            weight: { type: Number },
            height: { type: Number },
            bmi: { type: Number },
        },
        soapNotes: {
            subjective: { type: String, default: "" },
            objective: { type: String, default: "" },
            assessment: { type: String, default: "" },
            plan: { type: String, default: "" },
        },
        diagnosis: { type: [String], default: [] },
        status: { type: String, default: "open", enum: ["open", "closed"] },
    },
    { timestamps: true }
);

export default mongoose.models.Encounter || mongoose.model<IEncounter>("Encounter", EncounterSchema);
