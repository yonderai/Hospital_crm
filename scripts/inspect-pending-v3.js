const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;
const MONGODB_URI = "mongodb+srv://yuvrajsingh02608_db_user:yuvrajsingh@yondermedicareai.b6dwyv5.mongodb.net/yonder_medicare?retryWrites=true&w=majority";

async function inspectPending() {
    await mongoose.connect(MONGODB_URI);
    const db = mongoose.connection.db;

    const patient = await db.collection('patients').findOne({ mrn: 'MRN-500919' });
    if (!patient) {
        console.log("Patient MRN-500919 not found.");
    } else {
        console.log(`Patient: ${patient.firstName} ${patient.lastName}, ID: ${patient._id}`);

        // Try both string and ObjectId just in case
        const labsObj = await db.collection('laborders').find({ patientId: patient._id }).toArray();
        const labsStr = await db.collection('laborders').find({ patientId: patient._id.toString() }).toArray();

        console.log(`Found ${labsObj.length} lab orders (ObjectId query)`);
        console.log(`Found ${labsStr.length} lab orders (String query)`);

        labsObj.forEach(l => console.log(`- Lab ${l.orderId}: ${JSON.stringify(l.tests)}, Status: ${l.status}, PatientId Type: ${typeof l.patientId}`));
    }

    const allLabs = await db.collection('laborders').find({}).toArray();
    console.log(`\nTotal lab orders in DB: ${allLabs.length}`);
    allLabs.forEach(l => {
        console.log(`Order: ${l.orderId}, Status: ${l.status}, PatientID: ${l.patientId} (${typeof l.patientId})`);
    });

    await mongoose.disconnect();
}

inspectPending();
