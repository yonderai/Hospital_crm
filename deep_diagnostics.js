const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

async function deepDiagnostics() {
    await mongoose.connect(process.env.MONGODB_URI);
    const encounterIdStr = '697eed9132e98a3c35c47c91';

    console.log('--- ENCOUNTER TRACE ---');
    const Encounter = mongoose.connection.collection('encounters');
    const enc = await Encounter.findOne({ _id: new mongoose.Types.ObjectId(encounterIdStr) });

    if (!enc) {
        console.log(`Encounter ${encounterIdStr} not found!`);
        // Try searching by string ID just in case
        const encStr = await Encounter.findOne({ _id: encounterIdStr });
        if (encStr) console.log('Found with STRING ID match!');
        else return await mongoose.disconnect();
    }

    const patientId = enc.patientId;
    const appointmentId = enc.appointmentId;
    console.log(`Encounter: ${enc._id}`);
    console.log(`Diagnosis: ${enc.diagnosis}`);
    console.log(`PatientID: ${patientId} (Type: ${typeof patientId})`);
    console.log(`AppointmentID: ${appointmentId} (Type: ${typeof appointmentId})`);

    console.log('\n--- PATIENT CHECK ---');
    const Patient = mongoose.connection.collection('patients');
    const pat = await Patient.findOne({ _id: patientId });
    if (pat) {
        console.log(`Patient Name: ${pat.firstName} ${pat.lastName}`);
        console.log(`MRN: ${pat.mrn}`);
    } else {
        console.log('Patient record NOT FOUND for this encounter!');
    }

    const collections = [
        { name: 'prescriptions', label: 'Prescriptions' },
        { name: 'laborders', label: 'Lab Orders' },
        { name: 'imagingorders', label: 'Imaging Orders' }
    ];

    for (const col of collections) {
        console.log(`\n--- ALL RECORDS FOR PATIENT (${col.label}) ---`);
        const collection = mongoose.connection.collection(col.name);
        const records = await collection.find({ patientId: patientId }).toArray();
        console.log(`Total found: ${records.length}`);

        records.forEach(r => {
            const matchesEnc = r.encounterId?.toString() === encounterIdStr;
            const matchesApt = appointmentId && r.appointmentId?.toString() === appointmentId.toString();
            const matchesSelf = r._id?.toString() === encounterIdStr;

            console.log(` \n[ID: ${r._id}]`);
            console.log(`  - encounterId: ${r.encounterId} (Match: ${matchesEnc})`);
            console.log(`  - appointmentId: ${r.appointmentId} (Match: ${matchesApt})`);
            console.log(`  - SelfMatch: ${matchesSelf}`);

            if (col.name === 'prescriptions') {
                console.log(`  - Content: ${r.medications?.map(m => m.drugName).join(', ')}`);
            } else if (col.name === 'laborders') {
                console.log(`  - Content: ${r.tests?.join(', ') || r.testType}`);
            } else {
                console.log(`  - Content: ${r.imagingType}`);
            }
        });
    }

    await mongoose.disconnect();
}
deepDiagnostics().catch(console.error);
