const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const { GET } = require('./src/app/api/clinical/search/route.ts'); // This might not work directly in node due to imports

async function testSearch() {
    // Since I can't easily run the Next.js GET function in a standalone script due to imports/NextResponse, 
    // I will just repeat the logic in a script.

    await mongoose.connect(process.env.MONGODB_URI);
    const search = 'lab test x-ray';
    const regex = new RegExp(search, 'i');

    console.log(`Searching for: ${search}`);

    const Encounter = mongoose.connection.collection('encounters');
    const LabOrder = mongoose.connection.collection('laborders');

    const matchedEnc = await Encounter.find({
        $or: [
            { chiefComplaint: { $regex: regex } },
            { diagnosis: { $regex: regex } }
        ]
    }).toArray();

    const matchedLabs = await LabOrder.find({
        $or: [
            { testType: { $regex: regex } },
            { tests: { $in: [regex] } }
        ]
    }).toArray();

    console.log('\n--- ENCOUNTER RESULTS ---');
    matchedEnc.forEach(e => {
        console.log(` - ${e.chiefComplaint || e.diagnosis} | ID: ${e._id} | Patient: ${e.patientId}`);
    });

    console.log('\n--- LAB RESULTS ---');
    matchedLabs.forEach(l => {
        console.log(` - ${l.tests?.join(', ') || l.testType} | ID: ${l._id} | Patient: ${l.patientId} | EncID: ${l.encounterId}`);
    });

    await mongoose.disconnect();
}
testSearch().catch(console.error);
