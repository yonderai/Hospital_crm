const mongoose = require('mongoose');

const MONGODB_URI = "mongodb+srv://yuvrajsingh02608_db_user:yuvrajsingh@yondermedicareai.b6dwyv5.mongodb.net/yonder_medicare?retryWrites=true&w=majority";

async function diag() {
    try {
        await mongoose.connect(MONGODB_URI);

        const doctor = await mongoose.connection.db.collection('users').findOne({ email: 'doctor@medicore.com' });
        console.log('--- DOCTOR ---');
        console.log(`ID: ${doctor._id}, Email: ${doctor.email}`);

        const patientUser = await mongoose.connection.db.collection('users').findOne({ email: 'patient@medicore.com' });
        console.log('\n--- PATIENT USER ---');
        console.log(`ID: ${patientUser._id}, Email: ${patientUser.email}`);

        const patientProfile = await mongoose.connection.db.collection('patients').findOne({ "contact.email": 'patient@medicore.com' });
        console.log('\n--- PATIENT PROFILE ---');
        if (patientProfile) {
            console.log(`ID: ${patientProfile._id}, Email: ${patientProfile.contact?.email}, Name: ${patientProfile.firstName}`);
        } else {
            console.log('No patient profile found with that email.');
        }

        const appointments = await mongoose.connection.db.collection('appointments').find({}).toArray();
        console.log('\n--- APPOINTMENTS ---');
        appointments.forEach(a => {
            console.log(`- ID: ${a.appointmentId}, PatientId: ${a.patientId}, ProviderId: ${a.providerId}`);
        });

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}

diag();
