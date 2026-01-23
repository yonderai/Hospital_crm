import mongoose, { Schema, Document } from "mongoose";

export enum UserRole {
    ADMIN = "admin",
    DOCTOR = "doctor",
    NURSE = "nurse",
    LAB_TECH = "lab-tech",
    FRONT_DESK = "front-desk",
    PHARMACIST = "pharmacist",
    BILLING = "billing",
    HR = "hr",
    INVENTORY = "inventory",
    PATIENT = "patient",
    FINANCE = "finance"
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
    patientProfileId?: mongoose.Types.ObjectId;
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
            required: true,
            enum: Object.values(UserRole)
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
        patientProfileId: { type: Schema.Types.ObjectId, ref: "Patient" }, // Link to clinical record if role is patient
    },
    { timestamps: true }
);

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
