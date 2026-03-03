// Ultimate data verification for patient1@medicore.com
const mongoose = require('mongoose');

const MONGODB_URI = "mongodb+srv://yuvrajsingh02608_db_user:yuvrajsingh@yuvrajsingh02608_db_user.b6dwyv5.mongodb.net/yonder_medicare?retryWrites=true&w=majority";

async function verifyAllPatientData() {
    try {
        console.log('🔌 Connecting...');
        await mongoose.connect(MONGODB_URI);

        const email = 'patient1@medicore.com';
        console.log(`🔍 Searching for Patient record with email: ${email}`);

        const patientSchema = new mongoose.Schema({}, { strict: false });
        const Patient = mongoose.models.Patient || mongoose.model('Patient', patientSchema, 'patients');

        const patient = await Patient.findOne({ "contact.email": email });
        if (!patient) {
            console.log('❌ Patient record NOT found!');
            // Look for any patient records to see their structure
            const anyPatient = await Patient.findOne();
            if (anyPatient) {
                console.log('👀 Found another patient record structure:', JSON.stringify(anyPatient.contact, null, 2));
            }
            return;
        }

        console.log(`✅ Found Patient: ${patient.firstName} ${patient.lastName} (${patient._id})`);

        const labOrderSchema = new mongoose.Schema({}, { strict: false });
        const LabOrder = mongoose.models.LabOrder || mongoose.model('LabOrder', labOrderSchema, 'laborders');

        const labCount = await LabOrder.countDocuments({ patientId: patient._id, status: 'completed' });
        console.log(`🧪 Completed Lab Orders: ${labCount}`);

        const imagingOrderSchema = new mongoose.Schema({}, { strict: false });
        const ImagingOrder = mongoose.models.ImagingOrder || mongoose.model('ImagingOrder', imagingOrderSchema, 'imagingorders');
        const imgCount = await ImagingOrder.countDocuments({ patientId: patient._id, status: 'completed' });
        console.log(`📸 Completed Imaging Orders: ${imgCount}`);

        const rxSchema = new mongoose.Schema({}, { strict: false });
        const Prescription = mongoose.models.Prescription || mongoose.model('Prescription', rxSchema, 'prescriptions');
        const rxCount = await Prescription.countDocuments({ patientId: patient._id });
        console.log(`💊 Prescriptions: ${rxCount}`);

    } catch (err) {
        console.error('❌ Error:', err);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected');
    }
}

verifyAllPatientData();
