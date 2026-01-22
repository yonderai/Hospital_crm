import mongoose, { Schema, Document } from "mongoose";

export interface IAuditLog extends Document {
    userId: mongoose.Types.ObjectId;
    action: string;
    resource: string;
    resourceId?: string;
    details?: any;
    ipAddress?: string;
    userAgent?: string;
    severity: "info" | "warning" | "critical";
    timestamp: Date;
}

const AuditLogSchema = new Schema<IAuditLog>(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
        action: { type: String, required: true, index: true },
        resource: { type: String, required: true, index: true },
        resourceId: { type: String },
        details: { type: Schema.Types.Mixed },
        ipAddress: { type: String },
        userAgent: { type: String },
        severity: {
            type: String,
            required: true,
            enum: ["info", "warning", "critical"],
            default: "info"
        },
        timestamp: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

export default mongoose.models.AuditLog || mongoose.model<IAuditLog>("AuditLog", AuditLogSchema);
