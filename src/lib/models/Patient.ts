import mongoose, { Schema, Document } from "mongoose";

export interface IPatient extends Document {
    mrn: string;
    firstName: string;
    lastName: string;
    name?: string; // Optional for compatibility
    dob: Date;
    age?: number; // Auto-calculated or stored
    gender: string;
    contact: {
        phone: string;
        email: string;
        address: {
            street: string;
            city: string;
            state: string;
            zipCode: string;
            country: string;
        };
    };
    emergencyContact: {
        name: string;
        phone: string;
        relation: string;
    };
    insuranceInfo: {
        hasInsurance: boolean;
        provider?: string;
        policyNumber?: string;
        groupNumber?: string;
        coverageType?: string;
        sumInsured?: number;
        validUntil?: Date;
        coPayment?: number;
        deductible?: number;
        coInsurancePercentage?: number;
        cardFrontUrl?: string;
        cardBackUrl?: string;
    };
    medicalHistory: {
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
    };
    // Root level fields for backward compatibility
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
    bloodType?: string;
    photoUrl?: string;
    notes?: string;
    qrCodeUrl?: string;
    facilityId?: mongoose.Types.ObjectId;
    assignedDoctorId?: mongoose.Types.ObjectId;
    registeredBy?: mongoose.Types.ObjectId; // null if self-registered
    registrationSource?: string; // e.g., 'self-registration', 'front-desk'
    createdAt: Date;
    updatedAt: Date;
}

const PatientSchema = new Schema<IPatient>(
    {
        mrn: { type: String, required: true, unique: true, index: true },
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        name: { type: String }, // For compatibility
        dob: { type: Date, required: true },
        age: { type: Number },
        gender: { type: String, required: true },
        contact: {
            phone: { type: String, required: true },
            email: { type: String, unique: true, sparse: true },
            address: {
                street: { type: String },
                city: { type: String },
                state: { type: String },
                zipCode: { type: String },
                country: { type: String },
            },
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
            sumInsured: { type: Number },
            validUntil: { type: Date },
            coPayment: { type: Number },
            deductible: { type: Number },
            coInsurancePercentage: { type: Number },
            cardFrontUrl: { type: String },
            cardBackUrl: { type: String },
        },
        medicalHistory: {
            allergies: { type: [String], default: [] },
            chronicConditions: { type: [String], default: [] },
            pastSurgeries: [{
                name: { type: String },
                date: { type: Date },
                hospital: { type: String }
            }],
            currentMedications: [{
                name: { type: String },
                dosage: { type: String },
                frequency: { type: String }
            }]
        },
        // Valid for simple string arrays if needed for backward compat, but preferring object structure above
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
        photoUrl: { type: String },
        notes: { type: String },
        qrCodeUrl: { type: String },
        facilityId: { type: Schema.Types.ObjectId, ref: "Facility" },
        assignedDoctorId: { type: Schema.Types.ObjectId, ref: "User" },
        registeredBy: { type: Schema.Types.ObjectId, ref: "User" },
        registrationSource: { type: String, default: 'front-desk' },
    },
    { timestamps: true }
);

export default mongoose.models.Patient || mongoose.model<IPatient>("Patient", PatientSchema);
