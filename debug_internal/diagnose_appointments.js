const mongoose = require('mongoose');

const MONGODB_URI = "mongodb+srv://yuvrajsingh02608_db_user:yuvrajsingh@yuvrajsingh02608_db_user.b6dwyv5.mongodb.net/yonder_medicare?retryWrites=true&w=majority";

async function diag() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected.');

        const users = await mongoose.connection.db.collection('users').find({}).toArray();
        console.log('--- USERS ---');
        users.forEach(u => console.log(`ID: ${u._id}, Email: ${u.email}, Role: ${u.role}, Name: ${u.firstName} ${u.lastName}`));

        const patients = await mongoose.connection.db.collection('patients').find({}).toArray();
        console.log('\n--- PATIENTS ---');
        patients.forEach(p => console.log(`ID: ${p._id}, Email: ${p.contact?.email}, Name: ${p.firstName} ${p.lastName}, MRN: ${p.mrn}`));

        const appointments = await mongoose.connection.db.collection('appointments').find({}).toArray();
        console.log('\n--- APPOINTMENTS ---');
        appointments.forEach(a => console.log(`PatientId: ${a.patientId}, ProviderId: ${a.providerId}, Status: ${a.status}`));

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}

diag();
