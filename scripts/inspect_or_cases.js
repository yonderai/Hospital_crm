
const mongoose = require('mongoose');
const fs = require('fs');

const envPath = '/Users/yuvrajsingh/medical/Hospital_crm/.env';
const envContent = fs.readFileSync(envPath, 'utf8');
const MONGODB_URI = envContent.split('\n')
    .find(line => line.startsWith('MONGODB_URI='))
    .split('=')[1]
    .trim()
    .replace(/^["'](.+)["']$/, '$1');

async function inspectData() {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    const ORCase = mongoose.models.ORCase || mongoose.model('ORCase', new mongoose.Schema({}, { strict: false }));
    const Staff = mongoose.models.Staff || mongoose.model('Staff', new mongoose.Schema({}, { strict: false }));
    const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({}, { strict: false }));

    const cases = await ORCase.find({ status: 'completed' }).limit(5).lean();
    console.log(`Found ${cases.length} completed cases.`);

    for (const c of cases) {
        console.log("--- Case ---");
        console.log("ID:", c._id);
        console.log("Procedure:", c.procedureName);
        console.log("Status:", c.status);
        console.log("SurgeryReport Exists:", !!c.surgeryReport);
        if (c.surgeryReport) {
            console.log("SurgeryReport Keys:", Object.keys(c.surgeryReport));
        }
        console.log("SurgeonId:", c.surgeonId);

        if (c.surgeonId) {
            const staff = await Staff.findById(c.surgeonId);
            const user = await User.findById(c.surgeonId);
            console.log("Found in Staff:", !!staff);
            console.log("Found in User:", !!user);
        }
    }

    await mongoose.disconnect();
}

inspectData().catch(console.error);
