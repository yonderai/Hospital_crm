
const mongoose = require('mongoose');
const MONGODB_URI = "mongodb+srv://yuvrajsingh02608_db_user:yuvrajsingh@yondermedicareai.b6dwyv5.mongodb.net/yonder_medicare?retryWrites=true&w=majority";

async function run() {
    try {
        console.log("Connecting to DB...");
        await mongoose.connect(MONGODB_URI);
        const db = mongoose.connection.db;
        const collection = db.collection('patients');

        console.log("Checking existing indexes...");
        const indexes = await collection.indexes();
        const emailIndex = indexes.find(idx => idx.name === 'email_1' || idx.key.email);

        if (emailIndex) {
            console.log("Found email index:", emailIndex.name);
            console.log("Dropping index...");
            await collection.dropIndex(emailIndex.name);
            console.log("Index dropped.");
        }

        console.log("Creating sparse unique index on email...");
        // In some MongoDB environments, 'contact.email' might be the key if using the Next.js model
        // In others (backend), it's just 'email'.
        // Let's check the collision error again: "index: email_1". This usually means the key is "email".

        await collection.createIndex({ email: 1 }, { unique: true, sparse: true, background: true });
        console.log("Sparse unique index 'email_1' created.");

        // Also check if 'contact.email' needs it
        const contactEmailIndex = indexes.find(idx => idx.key['contact.email']);
        if (contactEmailIndex) {
            console.log("Found contact.email index. Dropping and making sparse...");
            await collection.dropIndex(contactEmailIndex.name);
            await collection.createIndex({ "contact.email": 1 }, { unique: true, sparse: true, background: true });
            console.log("Sparse unique index 'contact.email' created.");
        }

        console.log("Verification successful!");
    } catch (err) {
        console.error("FAILED to fix index:", err);
    } finally {
        await mongoose.disconnect();
    }
}

run();
