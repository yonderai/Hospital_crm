
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

// Load env
const envContent = fs.readFileSync(path.join(__dirname, '../.env'), 'utf8');
const env = Object.fromEntries(
    envContent.split('\n')
        .filter(line => line.includes('=') && !line.startsWith('#'))
        .map(line => {
            const [key, ...val] = line.split('=');
            return [key.trim(), val.join('=').trim().replace(/^"(.*)"$/, '$1')];
        })
);
const MONGODB_URI = env.MONGODB_URI;

async function verify() {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    try {
        // Define schemas for raw access
        const orCaseSchema = new mongoose.Schema({
            patientId: mongoose.Schema.Types.ObjectId,
            surgeonId: mongoose.Schema.Types.ObjectId,
            procedureName: String,
            status: String,
            surgeryReport: Object
        });
        const ORCase = mongoose.models.ORCase || mongoose.model('ORCase', orCaseSchema);

        // 1. Find a surgical case or create a dummy one
        let testCase = await ORCase.findOne({});
        if (!testCase) {
            console.log('No cases found, creating a dummy one');
            testCase = await ORCase.create({
                patientId: new mongoose.Types.ObjectId(),
                procedureName: 'Appendectomy',
                status: 'scheduled'
            });
        }

        console.log('Using case:', testCase._id);

        // 2. Simulate report submission
        await ORCase.findByIdAndUpdate(testCase._id, {
            status: 'completed',
            surgeryReport: {
                preOpDiagnosis: 'Acute Appendicitis',
                postOpDiagnosis: 'Ruptured Appendicitis',
                findings: 'Inflamed appendix with localized perforation at the tip.',
                procedureDetails: 'Laparoscopic appendectomy performed. Appendix removed and sent to pathology.',
                postOpInstructions: 'NPO for 6 hours, then clear liquids. Monitor incision for signs of infection.',
                reportDate: new Date()
            }
        });
        console.log('Successfully updated case with surgery report');

        // 3. Verify retrieval logic (similar to API)
        const patientCases = await ORCase.find({
            patientId: testCase.patientId,
            status: 'completed',
            surgeryReport: { $exists: true }
        });
        console.log('Retrieved reports for patient:', patientCases.length);
        if (patientCases.length > 0) {
            console.log('Verification SUCCESS: Surgery report is accessible in database');
        } else {
            console.error('Verification FAILED: Could not retrieve surgery report');
        }

    } finally {
        await mongoose.connection.close();
    }
}

verify().catch(console.error);
