import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({

    appointmentId: { type: String, required: true, unique: true },
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' }, // Redundant but consistent
    providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    type: { type: String, default: 'consultation' },
    createdBy: { type: String, default: 'staff' },
    status: { type: String, enum: ['Scheduled', 'Completed', 'Cancelled', 'No-show', 'Checked-in', 'Waiting'], default: 'Scheduled' },
    reason: { type: String },
    queueNumber: { type: Number },
    vitals: {
        bloodPressure: String,
        temperature: String,
        pulse: String,
        weight: String
    },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Appointment', appointmentSchema);
