const mongoose = require('mongoose');
const MONGODB_URI = "mongodb+srv://yuvrajsingh02608_db_user:yuvrajsingh@yuvrajsingh02608_db_user.b6dwyv5.mongodb.net/yonder_medicare?retryWrites=true&w=majority";

async function inspectPending() {
    await mongoose.connect(MONGODB_URI);
    const db = mongoose.connection.db;

    const patient = await db.collection('patients').findOne({ mrn: 'MRN-500919' });
    if (!patient) {
        console.log("Patient MRN-500919 not found.");
    } else {
        console.log(`Patient: ${patient.firstName} ${patient.lastName}, ID: ${patient._id}`);

        const labs = await db.collection('laborders').find({ patientId: patient._id.toString() }).toArray();
        console.log(`Found ${labs.length} lab orders for this patient.`);
        labs.forEach(l => console.log(`- Lab ${l.orderId}: ${JSON.stringify(l.tests)}, Status: ${l.status}`));

        const images = await db.collection('imagingorders').find({ patientId: patient._id.toString() }).toArray();
        console.log(`Found ${images.length} imaging orders for this patient.`);
        images.forEach(i => console.log(`- Imaging ${i._id}: ${i.imagingType}, Status: ${i.status}`));
    }

    const allPendingLabs = await db.collection('laborders').find({ status: 'ordered' }).toArray();
    console.log(`\nTotal pending labs in DB: ${allPendingLabs.length}`);

    await mongoose.disconnect();
}

inspectPending();
