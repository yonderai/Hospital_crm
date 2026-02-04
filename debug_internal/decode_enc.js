const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

async function decodeEncounter() {
    await mongoose.connect(process.env.MONGODB_URI);
    const eid = '697eed9132e98a3c35c47c91';

    console.log(`--- Investigating Encounter: ${eid} ---`);
    const Encounter = mongoose.connection.collection('encounters');
    const enc = await Encounter.findOne({ _id: new mongoose.Types.ObjectId(eid) });

    if (!enc) {
        console.log('Encounter not found by ObjectId');
        return await mongoose.disconnect();
    }

    console.log('Encounter Record:', JSON.stringify(enc, null, 2));

    const pid = enc.patientId;
    console.log(`\n--- Fetching Patient: ${pid} ---`);
    const Patient = mongoose.connection.collection('patients');
    const pat = await Patient.findOne({ _id: pid });
    console.log('Patient Record:', JSON.stringify(pat, null, 2));

    const collections = ['prescriptions', 'laborders', 'imagingorders'];
    for (const c of collections) {
        console.log(`\n--- Searching ${c} for Patient ${pid} ---`);
        const col = mongoose.connection.collection(c);
        const results = await col.find({ patientId: pid }).toArray();
        console.log(`Found ${results.length} records`);
        results.forEach(r => {
            console.log(` - ID: ${r._id} | encID: ${r.encounterId} | aptID: ${r.appointmentId}`);
        });
    }

    await mongoose.disconnect();
}
decodeEncounter().catch(console.error);
