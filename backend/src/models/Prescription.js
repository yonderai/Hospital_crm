import mongoose from 'mongoose';

const prescriptionSchema = new mongoose.Schema({
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    medicines: [{
        medicine: { type: mongoose.Schema.Types.ObjectId, ref: 'Inventory' }, // Optional, if linked to stock
        medicineName: String,
        dosage: String, // e.g., 500mg
        frequency: String, // e.g., twice a day
        duration: String, // e.g., 5 days
        instructions: String
    }],
    diagnosis: { type: String, required: true },
    clinicalNotes: { type: String }, // SOAP notes
    refillRequestOption: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Prescription', prescriptionSchema);
