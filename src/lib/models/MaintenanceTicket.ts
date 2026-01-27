import mongoose, { Schema, Document } from "mongoose";

export interface IMaintenanceTicket extends Document {
    title: string;
    description: string;
    category: "Elevator" | "Plumbing" | "Electrical" | "Equipment" | "Furniture" | "Other";
    priority: "Low" | "Medium" | "High" | "Critical";
    status: "Open" | "Pending Approval" | "Approved" | "Rejected" | "In Progress" | "Completed";
    images?: string[];
    estimatedCost?: number;
    actualCost?: number;
    requestedBy: mongoose.Types.ObjectId;
    approvedBy?: mongoose.Types.ObjectId;
    comments?: {
        user: mongoose.Types.ObjectId;
        text: string;
        date: Date;
    }[];
    createdAt: Date;
    updatedAt: Date;
}

const MaintenanceTicketSchema = new Schema<IMaintenanceTicket>(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        category: {
            type: String,
            required: true,
            enum: ["Elevator", "Plumbing", "Electrical", "Equipment", "Furniture", "Other"],
        },
        priority: {
            type: String,
            required: true,
            enum: ["Low", "Medium", "High", "Critical"],
            default: "Medium",
        },
        status: {
            type: String,
            required: true,
            enum: ["Open", "Pending Approval", "Approved", "Rejected", "In Progress", "Completed"],
            default: "Open",
        },
        images: { type: [String], default: [] },
        estimatedCost: { type: Number },
        actualCost: { type: Number },
        requestedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
        approvedBy: { type: Schema.Types.ObjectId, ref: "User" },
        comments: [
            {
                user: { type: Schema.Types.ObjectId, ref: "User" },
                text: { type: String },
                date: { type: Date, default: Date.now },
            },
        ],
    },
    { timestamps: true }
);

export default mongoose.models.MaintenanceTicket || mongoose.model<IMaintenanceTicket>("MaintenanceTicket", MaintenanceTicketSchema);
