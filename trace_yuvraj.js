const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

async function traceYuvraj() {
    await mongoose.connect(process.env.MONGODB_URI);

    // 1. Find the patient
    const Patient = mongoose.connection.collection('patients');
    const patients = await Patient.find({
        $or: [
            { firstName: /yuvraj/i },
            { lastName: /yuvraj/i }
        ]
    }).toArray();

    if (patients.length === 0) {
        console.log('Patient Yuvraj not found');
        return await mongoose.disconnect();
    }

    for (const pat of patients) {
        console.log(`\n\n=== PATIENT: ${pat.firstName} ${pat.lastName} [${pat._id}] ===`);

        const collections = [
            { name: 'encounters', label: 'Encounters' },
            { name: 'laborders', label: 'Labs' },
            { name: 'imagingorders', label: 'Imaging' },
            { name: 'prescriptions', label: 'Prescriptions' }
        ];

        for (const col of collections) {
            console.log(`\n--- ${col.label} ---`);
            const collection = mongoose.connection.collection(col.name);
            const records = await collection.find({ patientId: pat._id }).toArray();
            console.log(`Count: ${records.length}`);

            records.forEach(r => {
                console.log(` - [${r._id}]`);
                if (r.encounterId) console.log(`   encounterId: ${r.encounterId}`);
                if (r.appointmentId) console.log(`   appointmentId: ${r.appointmentId}`);

                if (col.name === 'encounters') {
                    console.log(`   ChiefComplaint: ${r.chiefComplaint}`);
                    console.log(`   Diagnosis: ${r.diagnosis}`);
                } else if (col.name === 'laborders') {
                    console.log(`   Test: ${r.tests?.join(', ') || r.testType}`);
                } else if (col.name === 'prescriptions') {
                    console.log(`   Drugs: ${r.medications?.map(m => m.drugName).join(', ')}`);
                } else if (col.name === 'imagingorders') {
                    console.log(`   Imaging: ${r.imagingType}`);
                }
            });
        }
    }

    await mongoose.disconnect();
}
traceYuvraj().catch(console.error);
