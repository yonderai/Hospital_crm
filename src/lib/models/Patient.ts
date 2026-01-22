import mongoose, { Schema, Document } from "mongoose";

export interface IPatient extends Document {
    mrn: string;
    firstName: string;
    lastName: string;
    dob: Date;
    gender: string;
    contact: {
        phone: string;
        email: string;
        address: string;
    };
    emergencyContact: {
        name: string;
        phone: string;
        relation: string;
    };
    insuranceInfo: {
        provider: string;
        policyNumber: string;
        groupNumber?: string;
    };
    allergies: string[];
    chronicConditions: string[];
    bloodType: string;
    facilityId?: mongoose.Types.ObjectId;
    assignedDoctorId?: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const PatientSchema = new Schema<IPatient>(
    {
        mrn: { type: String, required: true, unique: true, index: true },
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        dob: { type: Date, required: true },
        gender: { type: String, required: true },
        contact: {
            phone: { type: String, required: true },
            email: { type: String },
            address: { type: String },
        },
        emergencyContact: {
            name: { type: String },
            phone: { type: String },
            relation: { type: String },
        },
        insuranceInfo: {
            provider: { type: String },
            policyNumber: { type: String },
            groupNumber: { type: String },
        },
        allergies: { type: [String], default: [] },
        chronicConditions: { type: [String], default: [] },
        bloodType: { type: String },
        facilityId: { type: Schema.Types.ObjectId, ref: "Facility" },
        assignedDoctorId: { type: Schema.Types.ObjectId, ref: "User" },
    },
    { timestamps: true }
);

export default mongoose.models.Patient || mongoose.model<IPatient>("Patient", PatientSchema);
