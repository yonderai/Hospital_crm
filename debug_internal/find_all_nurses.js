const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;

async function findPotentialNurses() {
    try {
        await mongoose.connect(MONGODB_URI);
        const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({
            email: String,
            role: String,
            firstName: String,
            lastName: String
        }));

        // Find users who have 'nurse' in their role, email, or name (case-insensitive)
        const users = await User.find({
            $or: [
                { role: { $regex: 'nurse', $options: 'i' } },
                { email: { $regex: 'nurse', $options: 'i' } },
                { firstName: { $regex: 'nurse', $options: 'i' } },
                { lastName: { $regex: 'nurse', $options: 'i' } }
            ]
        });

        console.log(`Found ${users.length} potential nurse(s):`);
        users.forEach(u => {
            console.log(`- Name: ${u.firstName} ${u.lastName}, Role: ${u.role}, Email: ${u.email}`);
        });

        if (users.length === 0) {
            console.log("No users found matching 'nurse' criteria.");
        }

        // Also list ALL users just in case
        console.log("\n--- listing ALL users for context ---");
        const allUsers = await User.find({});
        allUsers.forEach(u => {
            console.log(`- ${u.firstName} ${u.lastName} (${u.role})`);
        });

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
}

findPotentialNurses();
