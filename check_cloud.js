
const mongoose = require('mongoose');

const MONGODB_URI = "mongodb+srv://yuvrajsingh02608_db_user:yuvrajsingh@yondermedicareai.b6dwyv5.mongodb.net/yonder_medicare?retryWrites=true&w=majority";

async function checkData() {
    try {
        console.log('Connecting to cloud DB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Connected.');

        const patients = await mongoose.connection.db.collection('patients').find({}).toArray();
        console.log(`\nTOTAL PATIENTS: ${patients.length}`);

        const doctors = await mongoose.connection.db.collection('users').find({ role: 'doctor' }).toArray();
        console.log(`\nDOCTORS:`);
        doctors.forEach(d => console.log(`- ${d.firstName} ${d.lastName} (ID: ${d._id})`));

        console.log(`\nPATIENT ASSIGNMENTS:`);
        patients.forEach(p => {
            console.log(`- ${p.firstName} ${p.lastName} -> Assigned Doc ID: ${p.assignedDoctorId}`);
        });

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}

checkData();
