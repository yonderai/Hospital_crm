const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

async function findMissingData() {
    await mongoose.connect(process.env.MONGODB_URI);
    const keywords = [/lab test x-ray/i, /accident happen/i, /surgery/i];

    const collections = [
        { name: 'encounters', fields: ['chiefComplaint', 'diagnosis', 'soapNotes.assessment'] },
        { name: 'laborders', fields: ['testType', 'tests', 'clinicalHistory'] },
        { name: 'imagingorders', fields: ['imagingType', 'bodyPart', 'clinicalHistory'] },
        { name: 'prescriptions', fields: ['medications.drugName'] }
    ];

    for (const col of collections) {
        console.log(`\nSearching in ${col.name}...`);
        const collection = mongoose.connection.collection(col.name);

        const query = {
            $or: col.fields.map(f => {
                const q = {};
                q[f] = { $in: keywords };
                return q;
            }).concat(col.fields.map(f => {
                const q = {};
                q[f] = { $regex: /lab test x-ray|accident happen|surgery/i };
                return q;
            }))
        };

        const records = await collection.find(query).toArray();
        console.log(`Found ${records.length} matches`);

        for (const r of records) {
            console.log(` - ID: ${r._id}`);
            console.log(`   PatientID: ${r.patientId}`);
            console.log(`   EncounterID: ${r.encounterId}`);
            console.log(`   AppointmentID: ${r.appointmentId}`);

            if (col.name === 'encounters') {
                console.log(`   Diagnosis: ${r.diagnosis}`);
            } else if (col.name === 'laborders') {
                console.log(`   Test: ${r.tests?.join(', ') || r.testType}`);
            }
        }
    }

    await mongoose.disconnect();
}
findMissingData().catch(console.error);
