
import mongoose from 'mongoose';
import User from './src/models/User.js';
import Staff from './src/models/Staff.js';
import dotenv from 'dotenv';
dotenv.config(); // Load env vars if needed, though usually auto-loaded in app context

const checkStaff = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/hospital_crm');
        console.log('Connected to DB');

        const users = await User.find({ lastName: 'Synchronized' });
        console.log(`Found ${users.length} Users with lastName 'Synchronized':`);
        users.forEach(u => console.log(`- ${u.firstName} ${u.lastName} (${u.email}) [Role: ${u.role}] ID: ${u._id}`));

        const staff = await Staff.find({ lastName: 'Synchronized' });
        console.log(`Found ${staff.length} Staff with lastName 'Synchronized':`);
        staff.forEach(s => console.log(`- ${s.firstName} ${s.lastName} (${s.email}) [Role: ${s.role}] userId: ${s.userId}`));

        if (users.length > 0 && staff.length > 0) {
            console.log('SUCCESS: User and Staff records created.');
        } else {
            console.log('FAILURE: Missing records.');
        }

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

checkStaff();
