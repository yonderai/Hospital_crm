import mongoose, { Schema, Document } from 'mongoose';

// Incident Model
export interface IIncident extends Document {
    incidentId: string;
    incidentType: 'medication-error' | 'fall' | 'infection' | 'surgical-complication' | 'other';
    reporterId: mongoose.Types.ObjectId;
    patientId?: mongoose.Types.ObjectId;
    incidentDate: Date;
    location: string;
    severity: 'minor' | 'moderate' | 'major' | 'critical';
    description: string;
    rootCause?: string;
    status: 'reported' | 'under-investigation' | 'resolved' | 'closed';
    reviewedBy?: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const IncidentSchema: Schema = new Schema({
    incidentId: { type: String, required: true, unique: true },
    incidentType: {
        type: String,
        enum: ['medication-error', 'fall', 'infection', 'surgical-complication', 'other'],
        required: true
    },
    reporterId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    patientId: { type: Schema.Types.ObjectId, ref: 'Patient' },
    incidentDate: { type: Date, required: true },
    location: { type: String, required: true },
    severity: { type: String, enum: ['minor', 'moderate', 'major', 'critical'], required: true },
    description: { type: String, required: true },
    rootCause: { type: String },
    status: { type: String, enum: ['reported', 'under-investigation', 'resolved', 'closed'], default: 'reported' },
    reviewedBy: { type: Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

export const Incident = mongoose.models.Incident || mongoose.model<IIncident>('Incident', IncidentSchema);

// Infection Control Model
export interface IInfectionControl extends Document {
    patientId: mongoose.Types.ObjectId;
    admissionId?: mongoose.Types.ObjectId;
    infectionType: string;
    dateIdentified: Date;
    organism?: string;
    isolationRequired: boolean;
    isolationType?: 'contact' | 'droplet' | 'airborne';
    treatmentProtocol?: string;
    status: 'active' | 'cleared' | 'deceased';
    reportedToAuthorities: boolean;
}

const InfectionControlSchema: Schema = new Schema({
    patientId: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
    admissionId: { type: Schema.Types.ObjectId, ref: 'Admission' },
    infectionType: { type: String, required: true },
    dateIdentified: { type: Date, required: true },
    organism: { type: String },
    isolationRequired: { type: Boolean, default: false },
    isolationType: { type: String, enum: ['contact', 'droplet', 'airborne'] },
    treatmentProtocol: { type: String },
    status: { type: String, enum: ['active', 'cleared', 'deceased'], default: 'active' },
    reportedToAuthorities: { type: Boolean, default: false }
}, { timestamps: true });

export const InfectionControl = mongoose.models.InfectionControl || mongoose.model<IInfectionControl>('InfectionControl', InfectionControlSchema);
