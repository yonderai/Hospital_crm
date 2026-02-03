import mongoose, { Schema, Document } from 'mongoose';

export interface IPostSurgeryInstruction extends Document {
    caseId: mongoose.Types.ObjectId;
    patientId: mongoose.Types.ObjectId;
    prescribedBy: mongoose.Types.ObjectId;
    assignedTo?: mongoose.Types.ObjectId;
    instructionType: 'vital_monitoring' | 'wound_care' | 'medication' | 'mobility' | 'diet' | 'pain_management' | 'other';
    instructions: string;
    frequency?: string; // e.g., "every 2 hours", "3 times daily"
    duration?: string; // e.g., "24 hours", "until discharge"
    priority: 'routine' | 'urgent' | 'critical';
    status: 'pending' | 'in-progress' | 'completed' | 'discontinued';
    startTime?: Date;
    endTime?: Date;
    completedAt?: Date;
    completedBy?: mongoose.Types.ObjectId;
    nurseNotes?: string;
    createdAt: Date;
    updatedAt: Date;
}

const PostSurgeryInstructionSchema: Schema = new Schema({
    caseId: { type: Schema.Types.ObjectId, ref: 'ORCase', required: true, index: true },
    patientId: { type: Schema.Types.ObjectId, ref: 'Patient', required: true, index: true },
    prescribedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
    instructionType: {
        type: String,
        required: true,
        enum: ['vital_monitoring', 'wound_care', 'medication', 'mobility', 'diet', 'pain_management', 'other']
    },
    instructions: { type: String, required: true },
    frequency: { type: String },
    duration: { type: String },
    priority: {
        type: String,
        required: true,
        enum: ['routine', 'urgent', 'critical'],
        default: 'routine'
    },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'in-progress', 'completed', 'discontinued'],
        default: 'pending'
    },
    startTime: { type: Date },
    endTime: { type: Date },
    completedAt: { type: Date },
    completedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    nurseNotes: { type: String }
}, { timestamps: true });

// Index for efficient queries
PostSurgeryInstructionSchema.index({ caseId: 1, status: 1 });
PostSurgeryInstructionSchema.index({ assignedTo: 1, status: 1 });

export default mongoose.models.PostSurgeryInstruction || mongoose.model<IPostSurgeryInstruction>('PostSurgeryInstruction', PostSurgeryInstructionSchema);
