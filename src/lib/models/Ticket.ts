import mongoose, { Schema, Document } from "mongoose";

export interface ITicket extends Document {
    title: string;
    description: string;
    category: "IT" | "Equipment" | "Maintenance" | "Finance" | "Other";
    priority: "Low" | "Medium" | "High";
    status: "Pending" | "Under Review" | "Approved" | "Denied" | "Resolved";
    estimatedCost?: number;
    photoUrl?: string; // For demo purposes, we might just store a dummy URL or local path
    requestedBy: mongoose.Types.ObjectId;
    requestedByRole: string; // "doctor", "nurse", "front-desk", etc.
    approvalDetails?: {
        approvedBy: mongoose.Types.ObjectId;
        amount?: number;
        remarks?: string;
        date: Date;
    };
    history: {
        action: string;
        performedBy: string; // Name or ID
        date: Date;
        statusFrom?: string;
        statusTo?: string;
    }[];
    createdAt: Date;
    updatedAt: Date;
}

const TicketSchema = new Schema<ITicket>(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        category: {
            type: String,
            required: true,
            enum: ["IT", "Equipment", "Maintenance", "Finance", "Other"],
        },
        priority: {
            type: String,
            required: true,
            enum: ["Low", "Medium", "High"],
            default: "Medium",
        },
        status: {
            type: String,
            required: true,
            enum: ["Pending", "Under Review", "Approved", "Denied", "Resolved"],
            default: "Pending",
        },
        estimatedCost: { type: Number },
        photoUrl: { type: String },
        requestedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
        requestedByRole: { type: String, required: true },
        approvalDetails: {
            approvedBy: { type: Schema.Types.ObjectId, ref: "User" },
            amount: { type: Number },
            remarks: { type: String },
            date: { type: Date },
        },
        history: [
            {
                action: { type: String, required: true },
                performedBy: { type: String, required: true },
                date: { type: Date, default: Date.now },
                statusFrom: { type: String },
                statusTo: { type: String },
            },
        ],
    },
    { timestamps: true }
);

export default mongoose.models.Ticket || mongoose.model<ITicket>("Ticket", TicketSchema);
