import mongoose, { Schema, Document } from "mongoose";

export interface IPatient extends Document {
    mrn: string;
    firstName: string;
    lastName: string;
    name?: string; // Optional for compatibility
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
        coverageType?: string;
        validUntil?: Date;
        hasInsurance: boolean;
    };
    allergies: string[];
    chronicConditions: string[];
    pastSurgeries: {
        name: string;
        date?: Date;
        hospital?: string;
    }[];
    currentMedications: {
        name: string;
        dosage: string;
        frequency: string;
    }[];
    familyMedicalHistory: {
        diabetes: boolean;
        heartDisease: boolean;
        cancer: boolean;
        other?: string;
    };
    bloodType: string;
    notes?: string;
    qrCodeUrl?: string; // New field
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
        name: { type: String }, // For compatibility with backend/seed model
        dob: { type: Date, required: true },
        gender: { type: String, required: true },
        contact: {
            phone: { type: String, required: true },
            email: { type: String, unique: true, sparse: true },
            address: { type: String },
        },
        emergencyContact: {
            name: { type: String },
            phone: { type: String },
            relation: { type: String },
        },
        insuranceInfo: {
            hasInsurance: { type: Boolean, default: false },
            provider: { type: String },
            policyNumber: { type: String },
            groupNumber: { type: String },
            coverageType: { type: String },
            validUntil: { type: Date },
        },
        allergies: { type: [String], default: [] },
        chronicConditions: { type: [String], default: [] },
        pastSurgeries: [{
            name: { type: String, required: true },
            date: { type: Date },
            hospital: { type: String }
        }],
        currentMedications: [{
            name: { type: String, required: true },
            dosage: { type: String },
            frequency: { type: String }
        }],
        familyMedicalHistory: {
            diabetes: { type: Boolean, default: false },
            heartDisease: { type: Boolean, default: false },
            cancer: { type: Boolean, default: false },
            other: { type: String }
        },
        bloodType: { type: String },
        notes: { type: String },
        qrCodeUrl: { type: String },
        facilityId: { type: Schema.Types.ObjectId, ref: "Facility" },
        assignedDoctorId: { type: Schema.Types.ObjectId, ref: "User" },
    },
    { timestamps: true }
);

export default mongoose.models.Patient || mongoose.model<IPatient>("Patient", PatientSchema);
