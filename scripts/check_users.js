
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: '.env.local' });

// Fallback if .env.local isn't picked up
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/medicore";

mongoose.connect(MONGODB_URI).then(() => console.log('Connected to MongoDB'));

const userSchema = new mongoose.Schema({
    email: String,
    role: String,
    firstName: String,
    lastName: String
});

const User = mongoose.model('User', userSchema);

async function findDoctors() {
    try {
        const doctors = await User.find({ role: 'doctor' });
        console.log('----- DOCTORS FOUND -----');
        doctors.forEach(doc => {
            console.log(`ID: ${doc._id}, Name: ${doc.firstName} ${doc.lastName}, Email: ${doc.email}`);
        });
        console.log('-------------------------');
    } catch (error) {
        console.error('Error finding doctors:', error);
    } finally {
        mongoose.disconnect();
    }
}

findDoctors();
