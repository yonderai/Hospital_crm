const mongoose = require('mongoose');
const MONGODB_URI = "mongodb+srv://yuvrajsingh02608_db_user:yuvrajsingh@yuvrajsingh02608_db_user.b6dwyv5.mongodb.net/yonder_medicare?retryWrites=true&w=majority";

async function verifyInsurance() {
    await mongoose.connect(MONGODB_URI);
    const db = mongoose.connection.db;

    const patients = await db.collection('patients').find({ firstName: "John" }).toArray();
    console.log("--- JOHN DOE INSURANCE CHECK ---");
    patients.forEach(p => {
        console.log(`Patient: ${p.firstName} ${p.lastName}`);
        console.log(`Insurance Information:`, JSON.stringify(p.insuranceInfo, null, 2));
    });

    await mongoose.disconnect();
}

verifyInsurance();
