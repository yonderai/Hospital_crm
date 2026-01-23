import mongoose, { Schema, Document } from 'mongoose';

// Research Study Model
export interface IResearchStudy extends Document {
    title: string;
    principalInvestigator: mongoose.Types.ObjectId;
    studyType: string;
    phase: 'I' | 'II' | 'III' | 'IV' | 'N/A';
    startDate: Date;
    endDate?: Date;
    eligibilityCriteria: {
        inclusion: string[];
        exclusion: string[];
    };
    status: 'recruiting' | 'active' | 'completed' | 'suspended';
    irbApprovalNumber: string;
    createdAt: Date;
    updatedAt: Date;
}

const ResearchStudySchema: Schema = new Schema({
    title: { type: String, required: true },
    principalInvestigator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    studyType: { type: String },
    phase: { type: String, enum: ['I', 'II', 'III', 'IV', 'N/A'] },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    eligibilityCriteria: {
        inclusion: [{ type: String }],
        exclusion: [{ type: String }]
    },
    status: { type: String, enum: ['recruiting', 'active', 'completed', 'suspended'], default: 'recruiting' },
    irbApprovalNumber: { type: String, required: true }
}, { timestamps: true });

export const ResearchStudy = mongoose.models.ResearchStudy || mongoose.model<IResearchStudy>('ResearchStudy', ResearchStudySchema);

// Subject Enrollment Model
export interface ISubjectEnrollment extends Document {
    studyId: mongoose.Types.ObjectId;
    patientId: mongoose.Types.ObjectId;
    subjectId: string; // Anonymized ID
    enrollmentDate: Date;
    randomizationArm: string;
    status: 'screening' | 'enrolled' | 'withdrawn' | 'completed';
    consentDate: Date;
}

const SubjectEnrollmentSchema: Schema = new Schema({
    studyId: { type: Schema.Types.ObjectId, ref: 'ResearchStudy', required: true },
    patientId: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
    subjectId: { type: String, required: true },
    enrollmentDate: { type: Date, default: Date.now },
    randomizationArm: { type: String },
    status: { type: String, enum: ['screening', 'enrolled', 'withdrawn', 'completed'], default: 'screening' },
    consentDate: { type: Date, required: true }
}, { timestamps: true });

export const SubjectEnrollment = mongoose.models.SubjectEnrollment || mongoose.model<ISubjectEnrollment>('SubjectEnrollment', SubjectEnrollmentSchema);
