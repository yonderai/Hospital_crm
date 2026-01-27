const mongoose = require('mongoose');
const MONGODB_URI = "mongodb+srv://yuvrajsingh02608_db_user:yuvrajsingh@yondermedicareai.b6dwyv5.mongodb.net/yonder_medicare?retryWrites=true&w=majority";

async function inspectIdentity() {
    await mongoose.connect(MONGODB_URI);
    const db = mongoose.connection.db;

    const users = await db.collection('users').find({ role: 'patient' }).toArray();
    console.log("--- PATIENT USERS ---");
    users.forEach(u => console.log(`USER: email=${u.email}, name=${u.firstName} ${u.lastName}`));

    const patients = await db.collection('patients').find({}).toArray();
    console.log("\n--- PATIENT PROFILES ---");
    patients.forEach(p => {
        console.log(`PATIENT: contactEmail=${p.contact?.email}, topEmail=${p.email}, name=${p.firstName} ${p.lastName}, _id=${p._id}`);
    });

    await mongoose.disconnect();
}

inspectIdentity();
