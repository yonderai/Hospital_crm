
const mongoose = require('mongoose');

// Define models locally
const MedicalDocumentSchema = new mongoose.Schema({
    patientId: mongoose.Schema.Types.ObjectId,
    documentType: String,
    fileName: String,
    fileUrl: String,
    verificationStatus: String
}, { strict: false });
const MedicalDocument = mongoose.models.MedicalDocument || mongoose.model('MedicalDocument', MedicalDocumentSchema);

const PatientSchema = new mongoose.Schema({ "contact.email": String }, { strict: false });
const Patient = mongoose.models.Patient || mongoose.model('Patient', PatientSchema);

require('dotenv').config();

async function verifyDocs() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/hospital_crm');
        console.log('Connected to MongoDB');

        const patient = await Patient.findOne({ "contact.email": "patient@example.com" }) || await Patient.findOne();
        if (!patient) throw new Error("No patient found for testing");

        console.log(`--- TEST: Creating Mock Document for Patient ${patient._id} ---`);
        const mockDoc = await MedicalDocument.create({
            patientId: patient._id,
            documentType: 'prescription',
            fileName: 'test-prescription.pdf',
            fileUrl: '/uploads/medical-history/test.pdf',
            fileSize: 1024,
            mimeType: 'application/pdf',
            uploadedBy: 'patient',
            uploaderId: patient._id,
            verificationStatus: 'pending'
        });
        console.log('✅ Mock document created');

        console.log('--- TEST: Retrieving Documents (Patient Logic) ---');
        const docs = await MedicalDocument.find({ patientId: patient._id }).sort({ createdAt: -1 });
        console.log(`✅ Found ${docs.length} documents for patient`);

        if (docs.some(d => d.fileName === 'test-prescription.pdf')) {
            console.log('✅ Correct document found in list');
        } else {
            console.error('❌ Expected document not found');
        }

        // Cleanup
        await MedicalDocument.deleteOne({ _id: mockDoc._id });
        console.log('✅ Cleanup complete');

    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
    }
}

verifyDocs();
