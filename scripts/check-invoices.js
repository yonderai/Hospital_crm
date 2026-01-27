const mongoose = require('mongoose');
const MONGODB_URI = "mongodb+srv://yuvrajsingh02608_db_user:yuvrajsingh@yondermedicareai.b6dwyv5.mongodb.net/yonder_medicare?retryWrites=true&w=majority";

async function checkInvoices() {
    await mongoose.connect(MONGODB_URI);
    const db = mongoose.connection.db;

    const invoices = await db.collection('invoices').find({}).toArray();
    console.log(`Found ${invoices.length} invoices.`);
    invoices.forEach(inv => {
        console.log(`Invoice ${inv.invoiceNumber}: Total=${inv.totalAmount}, Insurance=${inv.insuranceCoverage || 0}, Balance=${inv.balanceDue}`);
    });

    await mongoose.disconnect();
}

checkInvoices();
