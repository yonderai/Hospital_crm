import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    dateTime: { type: Date, required: true },
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
