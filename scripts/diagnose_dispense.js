const mongoose = require('mongoose');
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/hospital_crm";

async function diagnose() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("Connected");

        const lastLog = await mongoose.connection.db.collection('dispenselogs').find().sort({ createdAt: -1 }).limit(1).toArray();
        const lastPayment = await mongoose.connection.db.collection('payments').find().sort({ createdAt: -1 }).limit(1).toArray();
        const lastInvoice = await mongoose.connection.db.collection('invoices').find().sort({ createdAt: -1 }).limit(1).toArray();

        console.log("Last DispenseLog:", JSON.stringify(lastLog, null, 2));
        console.log("Last Payment:", JSON.stringify(lastPayment, null, 2));
        console.log("Last Invoice:", JSON.stringify(lastInvoice, null, 2));

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.connection.close();
    }
}

diagnose();
