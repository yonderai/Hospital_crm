import mongoose from 'mongoose';
import Payroll from '../src/lib/models/Payroll';
import Staff from '../src/lib/models/Staff';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });
if (!process.env.MONGODB_URI) {
    dotenv.config({ path: path.resolve(__dirname, '../.env') });
}

async function verify() {
    try {
        await mongoose.connect(process.env.MONGODB_URI!);
        const staffCount = await Staff.countDocuments();
        const payrollCount = await Payroll.countDocuments();

        console.log(`Staff Count: ${staffCount}`);
        console.log(`Payroll Count: ${payrollCount}`);

        const staff = await Staff.find({}, 'firstName lastName role baseSalary');
        console.log('Staff Details:');
        staff.forEach(s => console.log(`- ${s.firstName} ${s.lastName} (${s.role}): ${s.baseSalary}`));

        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

verify();
