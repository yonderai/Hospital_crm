const mongoose = require('mongoose');
const MONGODB_URI = "mongodb+srv://yuvrajsingh02608_db_user:yuvrajsingh@yuvrajsingh02608_db_user.b6dwyv5.mongodb.net/yonder_medicare?retryWrites=true&w=majority";

async function debug() {
    await mongoose.connect(MONGODB_URI);

    const patientSchema = new mongoose.Schema({}, { strict: false });
    const Patient = mongoose.models.Patient || mongoose.model('Patient', patientSchema, 'patients');

    const labOrderSchema = new mongoose.Schema({}, { strict: false });
    const LabOrder = mongoose.models.LabOrder || mongoose.model('LabOrder', labOrderSchema, 'laborders');

    const imagingOrderSchema = new mongoose.Schema({}, { strict: false });
    const ImagingOrder = mongoose.models.ImagingOrder || mongoose.model('ImagingOrder', imagingOrderSchema, 'imagingorders');

    const allPatients = await Patient.find({});
    console.log("ALL PATIENTS IN DB:", allPatients.length);
    allPatients.forEach(p => console.log("PATIENT DATA:", JSON.stringify(p, null, 2)));

    const alice = await Patient.findOne({ "contact.email": "patient1@medicore.com" });
    console.log("ALICE PATIENT RECORD:", alice ? alice._id : "NOT FOUND");

    if (alice) {
        const labs = await LabOrder.find({ patientId: alice._id });
        console.log("LAB ORDERS FOUND:", labs.length);
        labs.forEach(l => console.log(`  - ID: ${l.orderId}, Status: ${l.status}, Results count: ${l.results?.length || 0}`));

        const imaging = await ImagingOrder.find({ patientId: alice._id });
        console.log("IMAGING ORDERS FOUND:", imaging.length);
        imaging.forEach(i => console.log(`  - Type: ${i.imagingType}, Status: ${i.status}`));
    }

    await mongoose.disconnect();
}

debug();
