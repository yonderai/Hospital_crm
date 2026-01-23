
import mongoose, { Schema, Document } from "mongoose";

export interface IClinicalRecord extends Document {
    patientId: mongoose.Types.ObjectId;
    providerId: mongoose.Types.ObjectId; // Nurse or Doctor
    type: "Vitals" | "Note" | "Assessment";
    data: any; // Flexible structure for now: { bp: "120/80", heartRate: 80, temp: 98.6, spo2: 99 }
    recordedAt: Date;
}

const ClinicalRecordSchema = new Schema<IClinicalRecord>(
    {
        patientId: { type: Schema.Types.ObjectId, ref: "Patient", required: true, index: true },
        providerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        type: { type: String, enum: ["Vitals", "Note", "Assessment"], required: true },
        data: { type: Schema.Types.Mixed, required: true },
        recordedAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

export default mongoose.models.ClinicalRecord || mongoose.model<IClinicalRecord>("ClinicalRecord", ClinicalRecordSchema);
