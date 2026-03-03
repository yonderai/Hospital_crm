
const mongoose = require('mongoose');
const MONGODB_URI = "mongodb+srv://yuvrajsingh02608_db_user:yuvrajsingh@yuvrajsingh02608_db_user.b6dwyv5.mongodb.net/yonder_medicare?retryWrites=true&w=majority";

async function run() {
    await mongoose.connect(MONGODB_URI);
    const Patient = mongoose.connection.collection('patients');
    const LabOrder = mongoose.connection.collection('laborders');

    console.log("Recent Patients:");
    const lastPatients = await Patient.find().sort({ _id: -1 }).limit(3).toArray();
    console.log(JSON.stringify(lastPatients, null, 2));

    console.log("\nRecent Lab Orders:");
    const lastOrders = await LabOrder.find().sort({ _id: -1 }).limit(3).toArray();
    console.log(JSON.stringify(lastOrders, null, 2));

    await mongoose.disconnect();
}

run();
