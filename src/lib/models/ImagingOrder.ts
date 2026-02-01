import mongoose, { Schema, Document } from "mongoose";

export interface IImagingOrder extends Document {
    patientId: mongoose.Types.ObjectId;
    encounterId?: mongoose.Types.ObjectId;
    appointmentId?: mongoose.Types.ObjectId;
    orderedBy: mongoose.Types.ObjectId;
    imagingType: string; // e.g., "X-Ray", "MRI", "CT Scan", "Ultrasound"
    bodyPart: string;
    priority: "routine" | "urgent" | "stat";
    reasonForStudy?: string;
    status: "pending" | "scheduled" | "ordered" | "in-progress" | "completed" | "cancelled";
    scheduledAt?: Date;
    completedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const ImagingOrderSchema = new Schema<IImagingOrder>(
    {
        patientId: { type: Schema.Types.ObjectId, ref: "Patient", required: true, index: true },
        encounterId: { type: Schema.Types.ObjectId, ref: "Encounter", index: true },
        appointmentId: { type: Schema.Types.ObjectId, ref: "Appointment", index: true },
        orderedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
        imagingType: { type: String, required: true },
        bodyPart: { type: String, required: true },
        priority: {
            type: String,
            required: true,
            enum: ["routine", "urgent", "stat"],
            default: "routine"
        },
        reasonForStudy: { type: String },
        status: {
            type: String,
            required: true,
            enum: ["pending", "scheduled", "ordered", "in-progress", "completed", "cancelled"],
            default: "pending"
        },
        scheduledAt: { type: Date },
        completedAt: { type: Date },
    },
    { timestamps: true }
);

export default mongoose.models.ImagingOrder || mongoose.model<IImagingOrder>("ImagingOrder", ImagingOrderSchema);
