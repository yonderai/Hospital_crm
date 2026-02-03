import mongoose, { Schema, Document } from 'mongoose';

export interface ISurgeryOrder extends Document {
    caseId: mongoose.Types.ObjectId;
    patientId: mongoose.Types.ObjectId;
    prescribedBy: mongoose.Types.ObjectId;
    assignedTo?: mongoose.Types.ObjectId;
    orderType: 'vital_signs' | 'npo_status' | 'medication' | 'lab_work' | 'imaging' | 'consent' | 'other';
    instructions: string;
    priority: 'routine' | 'urgent' | 'stat';
    status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
    scheduledFor?: Date;
    completedAt?: Date;
    completedBy?: mongoose.Types.ObjectId;
    nurseNotes?: string;
    createdAt: Date;
    updatedAt: Date;
}

const SurgeryOrderSchema: Schema = new Schema({
    caseId: { type: Schema.Types.ObjectId, ref: 'ORCase', required: true, index: true },
    patientId: { type: Schema.Types.ObjectId, ref: 'Patient', required: true, index: true },
    prescribedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
    orderType: {
        type: String,
        required: true,
        enum: ['vital_signs', 'npo_status', 'medication', 'lab_work', 'imaging', 'consent', 'other']
    },
    instructions: { type: String, required: true },
    priority: {
        type: String,
        required: true,
        enum: ['routine', 'urgent', 'stat'],
        default: 'routine'
    },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'in-progress', 'completed', 'cancelled'],
        default: 'pending'
    },
    scheduledFor: { type: Date },
    completedAt: { type: Date },
    completedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    nurseNotes: { type: String }
}, { timestamps: true });

// Index for efficient queries
SurgeryOrderSchema.index({ caseId: 1, status: 1 });
SurgeryOrderSchema.index({ assignedTo: 1, status: 1 });

export default mongoose.models.SurgeryOrder || mongoose.model<ISurgeryOrder>('SurgeryOrder', SurgeryOrderSchema);
