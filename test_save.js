const fetch = require('node-fetch');

async function testPrescription() {
    const encounterId = '697dba960a48b0bff07694ac';
    const patientId = '697daab80a48b0bff07690d3';

    // We need a session cookie or we can try to call the internal API if we can (but we are outside)
    // Actually, I'll just run a script that uses the Model directly to see if it saves.
    // That's faster and tests the DB side.
}

const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

// Define a minimal schema just for testing
const TestSchema = new mongoose.Schema({
    patientId: mongoose.Schema.Types.ObjectId,
    encounterId: mongoose.Schema.Types.ObjectId,
    prescriptionId: String,
    medications: Array
}, { collection: 'prescriptions' });

const Prescription = mongoose.models.Prescription_Test || mongoose.model('Prescription_Test', TestSchema);

async function testSave() {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected');

    const encounterId = '697dba960a48b0bff07694ac';
    const patientId = '697daab80a48b0bff07690d3';

    console.log('Attempting to save with encounterId:', encounterId);

    const doc = await Prescription.create({
        patientId: patientId,
        encounterId: encounterId,
        prescriptionId: `TEST-${Date.now()}`,
        medications: [{ drugName: 'Test Drug' }]
    });

    console.log('Saved document _id:', doc._id);
    console.log('Saved document encounterId:', doc.encounterId);
    console.log('Type of saved encounterId:', typeof doc.encounterId);

    // Read back from DB
    const readBack = await mongoose.connection.collection('prescriptions').findOne({ _id: doc._id });
    console.log('Read back encounterId:', readBack.encounterId);

    await mongoose.disconnect();
}

testSave().catch(console.error);
