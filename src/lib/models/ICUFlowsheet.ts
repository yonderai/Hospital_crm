import mongoose, { Schema, Document } from 'mongoose';

export interface IICUFlowsheet extends Document {
    patientId: mongoose.Types.ObjectId;
    admissionId: mongoose.Types.ObjectId;
    recordTime: Date;
    vitals: {
        temp: number;
        bloodPressure: string;
        heartRate: number;
        respiratoryRate: number;
        oxygenSaturation: number;
        cvp?: number;
        map?: number;
    };
    ventilatorSettings?: {
        mode: string;
        fiO2: number;
        peep: number;
        tidalVolume: number;
    };
    labValues?: Record<string, string>;
    intakeOutput: {
        intake: number;
        output: number;
        balance: number;
    };
    scores: {
        sedationScore?: number;
        painScore?: number;
        glasgowComaScale?: number;
    };
    alerts: string[];
    recordedBy: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const ICUFlowsheetSchema: Schema = new Schema({
    patientId: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
    admissionId: { type: Schema.Types.ObjectId, ref: 'Admission', required: true },
    recordTime: { type: Date, default: Date.now, required: true },
    vitals: {
        temp: { type: Number },
        bloodPressure: { type: String },
        heartRate: { type: Number },
        respiratoryRate: { type: Number },
        oxygenSaturation: { type: Number },
        cvp: { type: Number },
        map: { type: Number }
    },
    ventilatorSettings: {
        mode: { type: String },
        fiO2: { type: Number },
        peep: { type: Number },
        tidalVolume: { type: Number }
    },
    labValues: { type: Map, of: String },
    intakeOutput: {
        intake: { type: Number, default: 0 },
        output: { type: Number, default: 0 },
        balance: { type: Number, default: 0 }
    },
    scores: {
        sedationScore: { type: Number },
        painScore: { type: Number },
        glasgowComaScale: { type: Number }
    },
    alerts: [{ type: String }],
    recordedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

export default mongoose.models.ICUFlowsheet || mongoose.model<IICUFlowsheet>('ICUFlowsheet', ICUFlowsheetSchema);
