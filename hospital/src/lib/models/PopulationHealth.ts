import mongoose, { Schema, Document } from 'mongoose';

// Care Program Model
export interface ICareProgram extends Document {
    programName: string;
    condition: string;
    enrolledPatients: mongoose.Types.ObjectId[];
    carePathway: {
        steps: string[];
        milestones: string[];
    };
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const CareProgramSchema: Schema = new Schema({
    programName: { type: String, required: true },
    condition: { type: String, required: true },
    enrolledPatients: [{ type: Schema.Types.ObjectId, ref: 'Patient' }],
    carePathway: {
        steps: [{ type: String }],
        milestones: [{ type: String }]
    },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

export const CareProgram = mongoose.models.CareProgram || mongoose.model<ICareProgram>('CareProgram', CareProgramSchema);

// Risk Stratification Model
export interface IRiskStratification extends Document {
    patientId: mongoose.Types.ObjectId;
    riskScore: number;
    riskCategory: 'low' | 'medium' | 'high';
    riskFactors: string[];
    assessmentDate: Date;
}

const RiskStratificationSchema: Schema = new Schema({
    patientId: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
    riskScore: { type: Number, required: true },
    riskCategory: { type: String, enum: ['low', 'medium', 'high'], required: true },
    riskFactors: [{ type: String }],
    assessmentDate: { type: Date, default: Date.now }
}, { timestamps: true });

export const RiskStratification = mongoose.models.RiskStratification || mongoose.model<IRiskStratification>('RiskStratification', RiskStratificationSchema);
