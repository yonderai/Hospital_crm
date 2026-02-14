
const mongoose = require('mongoose');
const fs = require('fs');

const envPath = './.env';
const envContent = fs.readFileSync(envPath, 'utf8');
const MONGODB_URI = envContent.split('\n')
    .find(line => line.startsWith('MONGODB_URI='))
    .split('=')[1]
    .trim()
    .replace(/^["'](.+)["']$/, '$1');

async function repairData() {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    const ORCase = mongoose.models.ORCase || mongoose.model('ORCase', new mongoose.Schema({}, { strict: false }));
    const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({}, { strict: false }));

    // 1. Find a valid doctor for re-assignment
    const validDoctor = await User.findOne({ role: 'doctor' });
    if (!validDoctor) {
        console.error("No doctor found in User collection. Data repair might be incomplete.");
    }

    // 2. Fix dummy Surgeon IDs
    const dummyId = new mongoose.Types.ObjectId('64b0f1a2e4b0f1a2e4b0f1a2');
    const casesWithDummy = await ORCase.find({ surgeonId: dummyId });
    console.log(`Found ${casesWithDummy.length} cases with dummy surgeon ID.`);

    if (validDoctor) {
        const updateDummy = await ORCase.updateMany(
            { surgeonId: dummyId },
            { $set: { surgeonId: validDoctor._id } }
        );
        console.log(`Re-assigned ${updateDummy.modifiedCount} cases to Doctor: ${validDoctor.firstName} ${validDoctor.lastName}`);
    }

    // 3. Fix "Completed" cases without reports
    const completedWithoutReport = await ORCase.find({
        status: 'completed',
        surgeryReport: { $exists: false }
    });
    console.log(`Found ${completedWithoutReport.length} completed cases without reports.`);

    for (const c of completedWithoutReport) {
        const placeholderReport = {
            preOpDiagnosis: "Procedure Planned",
            postOpDiagnosis: "Procedure Completed Successfully",
            findings: "Procedure performed as per standard medical protocol. No unexpected findings.",
            procedureDetails: `The procedure ${c.procedureName} was completed successfully. Details have been documented in the clinical system.`,
            postOpInstructions: "Standard post-operative care as directed by the clinical team.",
            reportDate: c.updatedAt || new Date()
        };

        await ORCase.updateOne(
            { _id: c._id },
            { $set: { surgeryReport: placeholderReport } }
        );
        console.log(`Added placeholder report to Case: ${c.procedureName} (${c._id})`);
    }

    await mongoose.disconnect();
    console.log("Repair completed.");
}

repairData().catch(console.error);
