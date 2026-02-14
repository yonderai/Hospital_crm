import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../src/lib/models/User';
import Staff from '../src/lib/models/Staff';
import Payroll from '../src/lib/models/Payroll';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local or .env
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });
if (!process.env.MONGODB_URI) {
    dotenv.config({ path: path.resolve(__dirname, '../.env') });
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined in environment variables");
}

const staffList = [
    {
        firstName: 'Gregory', lastName: 'House', role: 'doctor', department: 'Diagnostic Medicine',
        designation: 'Head of Department', baseSalary: 450000, email: 'house@medicore.com'
    },
    {
        firstName: 'James', lastName: 'Wilson', role: 'doctor', department: 'Oncology',
        designation: 'Head of Oncology', baseSalary: 400000, email: 'wilson@medicore.com'
    },
    {
        firstName: 'Lisa', lastName: 'Cuddy', role: 'admin', department: 'Administration',
        designation: 'Dean of Medicine', baseSalary: 500000, email: 'cuddy@medicore.com'
    },
    {
        firstName: 'Eric', lastName: 'Foreman', role: 'doctor', department: 'Neurology',
        designation: 'Senior Neurologist', baseSalary: 350000, email: 'foreman@medicore.com'
    },
    {
        firstName: 'Allison', lastName: 'Cameron', role: 'doctor', department: 'Immunology',
        designation: 'Senior Immunologist', baseSalary: 320000, email: 'cameron@medicore.com'
    },
    {
        firstName: 'Robert', lastName: 'Chase', role: 'doctor', department: 'Surgery',
        designation: 'Senior Surgeon', baseSalary: 380000, email: 'chase@medicore.com'
    },
    {
        firstName: 'Jackie', lastName: 'Peyton', role: 'nurse', department: 'Emergency',
        designation: 'ER Nurse', baseSalary: 85000, email: 'jackie@medicore.com'
    },
    {
        firstName: 'Carla', lastName: 'Espinosa', role: 'nurse', department: 'Nursing',
        designation: 'Head Nurse', baseSalary: 95000, email: 'carla@medicore.com'
    },
    {
        firstName: 'Dexter', lastName: 'Morgan', role: 'labtech', department: 'Pathology',
        designation: 'Blood Spatter Analyst', baseSalary: 60000, email: 'dexter@medicore.com'
    },
    {
        firstName: 'Walter', lastName: 'White', role: 'pharmacist', department: 'Pharmacy',
        designation: 'Senior Pharmacist', baseSalary: 120000, email: 'walter@medicore.com'
    },
    {
        firstName: 'Pam', lastName: 'Beesly', role: 'frontdesk', department: 'Reception',
        designation: 'Receptionist', baseSalary: 45000, email: 'pam@medicore.com'
    }
];

async function updatePayroll() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI as string);
        console.log('Connected.');

        // Clear existing Staff and Payroll data
        console.log('Clearing existing Staff and Payroll data...');
        await Staff.deleteMany({});
        await Payroll.deleteMany({});

        // Optional: Clear Users with these emails to avoid duplicates if we re-run
        const emails = staffList.map(s => s.email);
        await User.deleteMany({ email: { $in: emails } });

        console.log('Creating Staff and Payroll records...');

        const currentMonth = new Date().getMonth() + 1; // 1-12
        const currentYear = new Date().getFullYear();
        const hashedPassword = await bcrypt.hash('password123', 10);

        for (const staff of staffList) {
            // 1. Create User
            const user = await User.create({
                email: staff.email,
                password: hashedPassword,
                role: staff.role,
                firstName: staff.firstName,
                lastName: staff.lastName,
                isActive: true,
                permissions: { canView: [], canEdit: [], canDelete: [], canApprove: [] } // Basic
            });

            // 2. Create Staff Profile
            const newStaff = await Staff.create({
                userId: user._id,
                employeeId: `EMP-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
                firstName: staff.firstName,
                lastName: staff.lastName,
                email: staff.email,
                phone: '1234567890', // Dummy phone
                role: staff.role,
                department: staff.department,
                designation: staff.designation,
                baseSalary: staff.baseSalary,
                dateJoined: new Date(),
                status: 'active',
                bankDetails: {
                    accountName: `${staff.firstName} ${staff.lastName}`,
                    accountNumber: '123456789012',
                    bankName: 'Medicore Bank',
                    ifscCode: 'MED001'
                }
            });

            // 3. Create Payroll Record
            // Calculate some dummy deductions/allowances for realism
            const allowances = Math.round(staff.baseSalary * 0.10); // 10% allowance
            const deductions = Math.round(staff.baseSalary * 0.05); // 5% deduction
            const netPay = staff.baseSalary + allowances - deductions;

            await Payroll.create({
                staffId: newStaff._id,
                month: currentMonth,
                year: currentYear,
                baseSalary: staff.baseSalary,
                allowances,
                deductions,
                netPay,
                status: 'paid', // Mark as paid for immediate visualization
                paymentDate: new Date()
            });

            console.log(`Processed: ${staff.firstName} ${staff.lastName} - Net Pay: ${netPay}`);
        }

        console.log('Payroll update complete for 11 staff members.');
        process.exit(0);

    } catch (error) {
        console.error('Error updating payroll:', error);
        process.exit(1);
    }
}

updatePayroll();
