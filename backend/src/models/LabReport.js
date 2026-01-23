import mongoose from 'mongoose';

const labReportSchema = new mongoose.Schema({
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    testName: { type: String, required: true },
    category: { type: String, enum: ['Lab', 'Imaging'], required: true },
    status: { type: String, enum: ['Pending', 'In Progress', 'Completed'], default: 'Pending' },
    requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    results: { type: String }, // Digital report content or summary
    fileUrl: { type: String }, // Direct link to digital report (X-ray, MRI etc.)
    completedAt: { type: Date },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('LabReport', labReportSchema);
