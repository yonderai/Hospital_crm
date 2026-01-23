import mongoose from 'mongoose';

const billingSchema = new mongoose.Schema({
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    items: [{
        description: String,
        amount: Number,
        category: { type: String, enum: ['Consultation', 'Lab', 'Imaging', 'Pharmacy', 'Ward', 'Other'] }
    }],
    totalAmount: { type: Number, required: true },
    insuranceCovered: { type: Number, default: 0 },
    patientPayable: { type: Number, required: true },
    paymentStatus: { type: String, enum: ['Paid', 'Partial', 'Unpaid'], default: 'Unpaid' },
    paymentMethod: { type: String, enum: ['Cash', 'Card', 'UPI', 'Insurance'] },
    insurancePreAuthToken: { type: String },
    invoiceNumber: { type: String, unique: true },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Billing', billingSchema);
