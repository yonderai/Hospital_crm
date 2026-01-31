import mongoose, { Schema, Document } from "mongoose";

export interface IMedicalDocument extends Document {
    patientId: mongoose.Types.ObjectId;
    appointmentId?: mongoose.Types.ObjectId;
    documentType: 'prescription' | 'lab_report' | 'discharge_summary' | 'insurance_claim' | 'other';
    fileName: string;
    fileUrl: string;
    fileSize: number;
    mimeType: string;
    uploadedBy: 'patient' | 'doctor' | 'staff';
    uploaderId: mongoose.Types.ObjectId;
    verificationStatus: 'pending' | 'verified' | 'rejected';
    notes?: string;
    tags?: string[];
    createdAt: Date;
    updatedAt: Date;
}

const MedicalDocumentSchema = new Schema<IMedicalDocument>(
    {
        patientId: { type: Schema.Types.ObjectId, ref: "Patient", required: true, index: true },
        appointmentId: { type: Schema.Types.ObjectId, ref: "Appointment", index: true },
        documentType: {
            type: String,
            enum: ['prescription', 'lab_report', 'discharge_summary', 'insurance_claim', 'other'],
            default: 'other',
            required: true
        },
        fileName: { type: String, required: true },
        fileUrl: { type: String, required: true },
        fileSize: { type: Number, required: true },
        mimeType: { type: String, required: true },
        uploadedBy: {
            type: String,
            enum: ['patient', 'doctor', 'staff'],
            required: true
        },
        uploaderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        verificationStatus: {
            type: String,
            enum: ['pending', 'verified', 'rejected'],
            default: 'verified'
        },
        notes: { type: String },
        tags: [{ type: String }]
    },
    { timestamps: true }
);

export default mongoose.models.MedicalDocument || mongoose.model<IMedicalDocument>("MedicalDocument", MedicalDocumentSchema);
