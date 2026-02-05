const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;

console.log('Testing URI:', MONGODB_URI.replace(/:([^@]+)@/, ':****@'));

async function test() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Successfully connected!');
        await mongoose.disconnect();
    } catch (err) {
        console.error('Connection failed:');
        console.error(err);
    }
}

test();
