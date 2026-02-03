
const mongoose = require('mongoose');
const fs = require('fs');

// Basic env parser
const envPath = '/Users/yuvrajsingh/medical/Hospital_crm/.env';
const envContent = fs.readFileSync(envPath, 'utf8');
const MONGODB_URI = envContent.split('\n')
    .find(line => line.startsWith('MONGODB_URI='))
    .split('=')[1]
    .trim()
    .replace(/^["'](.+)["']$/, '$1');

async function verifyPipeline() {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    // Define Schemas (minimal for what we need)
    const Patient = mongoose.models.Patient || mongoose.model('Patient', new mongoose.Schema({}, { strict: false }));
    const ORCase = mongoose.models.ORCase || mongoose.model('ORCase', new mongoose.Schema({}, { strict: false }));

    const email = "patient@example.com";
    const patient = await Patient.findOne({ "contact.email": email });

    if (!patient) {
        console.error("Patient not found!");
        process.exit(1);
    }

    console.log("Patient found:", patient._id);

    // Simulate API query for Results
    const surgeryResults = await ORCase.find({
        patientId: patient._id,
        status: 'completed',
        surgeryReport: { $exists: true }
    }).lean();

    console.log("Pipeline check (Results):", surgeryResults.length, "surgery reports found.");
    if (surgeryResults.length > 0) {
        console.log("Latest surgery report procedure:", surgeryResults[0].procedureName);
        console.log("Has surgeryReport field:", !!surgeryResults[0].surgeryReport);
    }

    // Simulate API query for Surgery Portal
    const allSurgeries = await ORCase.find({ patientId: patient._id }).lean();
    console.log("Pipeline check (Surgery Portal):", allSurgeries.length, "surgeries found.");

    await mongoose.disconnect();
}

verifyPipeline().catch(console.error);
