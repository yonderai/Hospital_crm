const mongoose = require('mongoose');

const MONGODB_URI = "mongodb://localhost:27017/medicore";

async function checkDB() {
    try {
        console.log('Connecting to:', MONGODB_URI);
        await mongoose.connect(MONGODB_URI);
        console.log('Connected.');

        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('Collections:', collections.map(c => c.name));

        const users = await mongoose.connection.db.collection('users').find({}).toArray();
        console.log('Total users:', users.length);
        users.forEach(u => {
            console.log(`- Email: ${u.email}, Role: ${u.role}, Active: ${u.isActive}, HasPassword: ${!!u.password}`);
        });

        const patients = await mongoose.connection.db.collection('patients').countDocuments();
        console.log('Total patients:', patients);

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await mongoose.disconnect();
    }
}

checkDB();
