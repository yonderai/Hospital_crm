import mongoose, { Schema, Document } from "mongoose";

export interface IPrescription extends Document {
    prescriptionId: string;
    patientId: mongoose.Types.ObjectId;
    providerId: mongoose.Types.ObjectId;
    encounterId?: mongoose.Types.ObjectId;
    appointmentId?: mongoose.Types.ObjectId;
    medications: {
        drugName: string;
        dosage: string;
        frequency: string;
        route: string;
        duration: string;
        quantity: number;
        refills: number;
        instructions?: string;
    }[];
    status: "active" | "completed" | "cancelled";
    prescribedDate: Date;
    createdAt: Date;
    updatedAt: Date;
}

const PrescriptionSchema = new Schema<IPrescription>(
    {
        prescriptionId: { type: String, required: true, unique: true },
        patientId: { type: Schema.Types.ObjectId, ref: "Patient", required: true, index: true },
        providerId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
        encounterId: { type: Schema.Types.ObjectId, ref: "Encounter" },
        appointmentId: { type: Schema.Types.ObjectId, ref: "Appointment" },
        medications: [
            {
                drugName: { type: String, required: true },
                dosage: { type: String, required: false }, // Optional as it may be part of drugName
                frequency: { type: String, required: true },
                route: { type: String, required: true },
                duration: { type: String, required: true },
                quantity: { type: Number, required: true },
                refills: { type: Number, default: 0 },
                instructions: { type: String },
            },
        ],
        status: {
            type: String,
            default: "active",
            enum: ["active", "completed", "cancelled"]
        },
        prescribedDate: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

export default mongoose.models.Prescription || mongoose.model<IPrescription>("Prescription", PrescriptionSchema);
