const mongoose = require('mongoose');
const MONGODB_URI = "mongodb+srv://yuvrajsingh02608_db_user:yuvrajsingh@yondermedicareai.b6dwyv5.mongodb.net/yonder_medicare?retryWrites=true&w=majority";

async function inspectPending() {
    await mongoose.connect(MONGODB_URI);
    const db = mongoose.connection.db;

    console.log("--- PENDING LAB ORDERS ---");
    const labs = await db.collection('laborders').find({
        status: { $in: ["ordered", "scheduled", "collected", "in-progress"] }
    }).toArray();
    console.log(`Found ${labs.length} pending lab orders.`);
    labs.forEach(l => {
        console.log(`Order: ${l.orderId}, Tests: ${JSON.stringify(l.tests)}, Status: ${l.status}, PatientId: ${l.patientId}`);
    });

    console.log("\n--- PENDING IMAGING ORDERS ---");
    const images = await db.collection('imagingorders').find({
        status: { $in: ["pending", "scheduled", "ordered", "in-progress"] }
    }).toArray();
    console.log(`Found ${images.length} pending imaging orders.`);
    images.forEach(i => {
        console.log(`Order: ${i._id}, Type: ${i.imagingType}, Status: ${i.status}, PatientId: ${i.patientId}`);
    });

    console.log("\n--- PATIENTS ---");
    const patients = await db.collection('patients').find({}).toArray();
    patients.forEach(p => {
        console.log(`Patient: ${p.firstName} ${p.lastName}, MRN: ${p.mrn}, ID: ${p._id}`);
    });

    await mongoose.disconnect();
}

inspectPending();
