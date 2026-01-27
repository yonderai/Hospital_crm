const mongoose = require('mongoose');
const MONGODB_URI = "mongodb+srv://yuvrajsingh02608_db_user:yuvrajsingh@yondermedicareai.b6dwyv5.mongodb.net/yonder_medicare?retryWrites=true&w=majority";

async function checkUser() {
    await mongoose.connect(MONGODB_URI);
    const db = mongoose.connection.db;

    const user = await db.collection('users').findOne({ name: 'Dexter Morgan' });
    if (user) {
        console.log(`User: ${user.name}, Role: ${user.role}, Email: ${user.email}`);
    } else {
        console.log("User Dexter Morgan not found.");
        const allUsers = await db.collection('users').find({}).toArray();
        allUsers.forEach(u => console.log(`User: ${u.name}, Role: ${u.role}`));
    }

    await mongoose.disconnect();
}

checkUser();
