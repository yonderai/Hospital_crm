
const mongoose = require('mongoose');
const MONGODB_URI = "mongodb+srv://yuvrajsingh02608_db_user:yuvrajsingh@yondermedicareai.b6dwyv5.mongodb.net/yonder_medicare?retryWrites=true&w=majority";

async function run() {
    await mongoose.connect(MONGODB_URI);
    const db = mongoose.connection.db;

    console.log("Indexes for 'patients' collection:");
    const patientIndexes = await db.collection('patients').indexes();
    console.log(JSON.stringify(patientIndexes, null, 2));

    console.log("\nIndexes for 'laborders' collection:");
    const labOrderIndexes = await db.collection('laborders').indexes();
    console.log(JSON.stringify(labOrderIndexes, null, 2));

    await mongoose.disconnect();
}

run();
