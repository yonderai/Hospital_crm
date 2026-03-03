const mongoose = require('mongoose');

const MONGODB_URI = "mongodb+srv://yuvrajsingh02608_db_user:yuvrajsingh@yuvrajsingh02608_db_user.b6dwyv5.mongodb.net/yonder_medicare?retryWrites=true&w=majority";

async function findUser() {
    try {
        await mongoose.connect(MONGODB_URI);
        const userId = "6973c71aefa2f87e68ca5a87"; // The ID from the appointment
        const user = await mongoose.connection.db.collection('users').findOne({ _id: new mongoose.Types.ObjectId(userId) });
        if (user) {
            console.log(`Found User: ${user.email}, Role: ${user.role}, Name: ${user.firstName}`);
        } else {
            console.log('User not found by ID.');
        }
    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}

findUser();
