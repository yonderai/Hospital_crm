import mongoose, { Schema, Document } from "mongoose";

export interface IAppointment extends Document {
    appointmentId: string;
    patientId: mongoose.Types.ObjectId;
    providerId: mongoose.Types.ObjectId;
    locationId?: mongoose.Types.ObjectId;
    startTime: Date;
    endTime: Date;
    status: "scheduled" | "checked-in" | "in-progress" | "completed" | "cancelled" | "no-show";
    type: "consultation" | "follow-up" | "procedure" | "emergency";
    reason: string;
    chiefComplaint?: string; // New field
    notes?: string;
    aiInsights?: string;
    payment?: {
        totalAmount: number;
        paidAmount: number;
        dueAmount: number;
        method: "cash" | "card" | "upi" | "insurance";
        status: "pending" | "partial" | "paid" | "failed";
        transactionId?: string;
        receiptNo?: string;
    };
    createdBy: "patient" | "staff";
    createdAt: Date;
    updatedAt: Date;
}

const AppointmentSchema = new Schema<IAppointment>(
    {
        appointmentId: { type: String, required: true, unique: true },
        patientId: { type: Schema.Types.ObjectId, ref: "Patient", required: true, index: true },
        providerId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
        locationId: { type: Schema.Types.ObjectId, ref: "Facility" },
        startTime: { type: Date, required: true },
        endTime: { type: Date, required: true },
        status: {
            type: String,
            default: "scheduled",
            enum: ["scheduled", "checked-in", "in-progress", "completed", "cancelled", "no-show"]
        },
        type: {
            type: String,
            required: true,
            enum: ["consultation", "follow-up", "procedure", "emergency"]
        },
        reason: { type: String, required: true },
        chiefComplaint: { type: String },
        notes: { type: String },
        aiInsights: { type: String }, // AI generated clinical insights
        payment: {
            totalAmount: { type: Number },
            paidAmount: { type: Number },
            dueAmount: { type: Number },
            method: { type: String, enum: ["cash", "card", "upi", "insurance"] },
            status: { type: String, enum: ["pending", "partial", "paid", "failed"], default: "pending" },
            transactionId: { type: String },
            receiptNo: { type: String }
        },
        createdBy: {
            type: String,
            required: true,
            enum: ["patient", "staff"],
            default: "patient"
        }
    },
    { timestamps: true }
);

export default mongoose.models.Appointment || mongoose.model<IAppointment>("Appointment", AppointmentSchema);
