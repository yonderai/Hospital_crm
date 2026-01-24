
const mongoose = require('mongoose');

const MONGODB_URI = "mongodb+srv://yuvrajsingh02608_db_user:yuvrajsingh@yondermedicareai.b6dwyv5.mongodb.net/yonder_medicare?retryWrites=true&w=majority";

async function checkData() {
    try {
        await mongoose.connect(MONGODB_URI);

        const labs = await mongoose.connection.db.collection('labresults').find({}).toArray();
        console.log('\nLAB RESULTS:');
        labs.forEach((l, i) => {
            console.log(`${i + 1}. Type: ${l.testType}, Status: ${l.status}, Patient: ${l.patientId}`);
        });

        const prescriptions = await mongoose.connection.db.collection('prescriptions').find({}).toArray();
        console.log('\nPRESCRIPTIONS:');
        prescriptions.forEach((p, i) => {
            console.log(`${i + 1}. Status: ${p.status}, Medications: ${p.medications?.length}, Patient: ${p.patientId}`);
        });

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}

checkData();
