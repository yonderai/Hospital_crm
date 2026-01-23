import mongoose, { Schema, Document } from 'mongoose';

export interface IORCase extends Document {
    patientId: mongoose.Types.ObjectId;
    surgeonId: mongoose.Types.ObjectId;
    assistingSurgeons: mongoose.Types.ObjectId[];
    anesthesiologistId: mongoose.Types.ObjectId;
    nurseIds: mongoose.Types.ObjectId[];
    procedureCode: string;
    procedureName: string;
    scheduledDate: Date;
    startTime?: Date;
    endTime?: Date;
    orRoomId: string;
    status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
    instruments: string[];
    implants: string[];
    complications?: string;
    postOpNotes?: string;
    createdAt: Date;
    updatedAt: Date;
}

const ORCaseSchema: Schema = new Schema({
    patientId: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
    surgeonId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    assistingSurgeons: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    anesthesiologistId: { type: Schema.Types.ObjectId, ref: 'User' },
    nurseIds: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    procedureCode: { type: String, required: true },
    procedureName: { type: String, required: true },
    scheduledDate: { type: Date, required: true },
    startTime: { type: Date },
    endTime: { type: Date },
    orRoomId: { type: String, required: true },
    status: {
        type: String,
        enum: ['scheduled', 'in-progress', 'completed', 'cancelled'],
        default: 'scheduled'
    },
    instruments: [{ type: String }],
    implants: [{ type: String }],
    complications: { type: String },
    postOpNotes: { type: String },
}, { timestamps: true });

export default mongoose.models.ORCase || mongoose.model<IORCase>('ORCase', ORCaseSchema);
