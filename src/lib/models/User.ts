import mongoose, { Schema, Document } from "mongoose";

export enum UserRole {
    ADMIN = "admin",
    DOCTOR = "doctor",
    NURSE = "nurse",
    LAB_TECH = "labtech",
    FRONT_DESK = "frontdesk",
    PHARMACY_INVENTORY = "pharmacy_inventory",
    BILLING = "billing",
    HR = "hr",
    PATIENT = "patient",
    FINANCE = "finance",
    EMERGENCY = "emergency"
}

export interface IUser extends Document {
    email: string;
    password?: string;
    role: UserRole;
    firstName: string;
    lastName: string;
    credentials?: string[];
    department?: string;
    facilityId?: mongoose.Types.ObjectId;
    permissions: {
        canView: string[];
        canEdit: string[];
        canDelete: string[];
        canApprove: string[];
    };
    isActive: boolean;
    lastLogin?: Date;
    mfaEnabled: boolean;
    mfaSecret?: string;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
    {
        email: { type: String, required: true, unique: true, index: true },
        password: { type: String, required: false }, // OAuth users might not have password
        role: {
            type: String,
            enum: ["doctor", "nurse", "admin", "frontdesk", "labtech", "pathology", "billing", "pharmacist", "hr", "patient", "finance", "emergency"],
            required: true,
        },
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        credentials: { type: [String], default: [] },
        department: { type: String },
        facilityId: { type: Schema.Types.ObjectId, ref: "Facility" },
        permissions: {
            canView: { type: [String], default: [] },
            canEdit: { type: [String], default: [] },
            canDelete: { type: [String], default: [] },
            canApprove: { type: [String], default: [] },
        },
        isActive: { type: Boolean, default: true },
        lastLogin: { type: Date },
        mfaEnabled: { type: Boolean, default: false },
        mfaSecret: { type: String },
    },
    { timestamps: true }
);

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
