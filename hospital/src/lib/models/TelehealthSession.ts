import mongoose, { Schema, Document } from "mongoose";

export interface ITelehealthSession extends Document {
    encounterId?: mongoose.Types.ObjectId;
    patientId: mongoose.Types.ObjectId;
    providerId: mongoose.Types.ObjectId;
    startTime: Date;
    endTime?: Date;
    duration?: number; // duration in minutes
    status: "scheduled" | "active" | "completed" | "cancelled" | "missed";
    roomUrl?: string;
    recordingUrl?: string;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

const TelehealthSessionSchema = new Schema<ITelehealthSession>(
    {
        encounterId: { type: Schema.Types.ObjectId, ref: "Encounter" },
        patientId: { type: Schema.Types.ObjectId, ref: "Patient", required: true, index: true },
        providerId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
        startTime: { type: Date, required: true },
        endTime: { type: Date },
        duration: { type: Number },
        status: {
            type: String,
            required: true,
            enum: ["scheduled", "active", "completed", "cancelled", "missed"],
            default: "scheduled"
        },
        roomUrl: { type: String },
        recordingUrl: { type: String },
        notes: { type: String },
    },
    { timestamps: true }
);

export default mongoose.models.TelehealthSession || mongoose.model<ITelehealthSession>("TelehealthSession", TelehealthSessionSchema);
