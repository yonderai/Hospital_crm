import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import User from '../models/User.js';
import Patient from '../models/Patient.js';
import Inventory from '../models/Inventory.js';
import Appointment from '../models/Appointment.js';
import Expense from '../models/Expense.js';
import Billing from '../models/Billing.js';
import Staff from '../models/Staff.js';
import { ROLES } from '../config/roles.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from project root
dotenv.config({ path: path.join(__dirname, '../../../.env') });

const seedData = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI is not defined in .env');
        }
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB for seeding...');

        // Clear existing data
        await User.deleteMany();
        await Patient.deleteMany();
        await Inventory.deleteMany();
        await Appointment.deleteMany();
        await Expense.deleteMany();
        await Billing.deleteMany();
        await Staff.deleteMany();

        console.log('Cleared existing data...');

        // 1. Create Standardized Staff
        const staffData = [
            {
                firstName: 'Dr. Gregory',
                lastName: 'House',
                email: 'doctor@medicore.com',
                password: 'a',
                role: ROLES.DOCTOR,
                department: 'Diagnostics',
                designation: 'Chief of Diagnostics',
                baseSalary: 250000,
                phone: '9876543210'
            },
            {
                firstName: 'Nurse',
                lastName: 'Joy',
                email: 'nurse@medicore.com',
                password: 'a',
                role: ROLES.NURSE,
                department: 'Outpatient',
                designation: 'Head Nurse',
                baseSalary: 85000,
                phone: '9876543211'
            },
            {
                firstName: 'Sarah',
                lastName: 'Finance',
                email: 'finance@hospital.com',
                password: 'a',
                role: ROLES.BACK_OFFICE_FINANCE,
                department: 'Finance',
                designation: 'Finance Manager',
                baseSalary: 120000,
                phone: '9876543212'
            },
            {
                firstName: 'Mike',
                lastName: 'Maintenance',
                email: 'maintenance@hospital.com',
                password: 'a',
                role: ROLES.MAINTENANCE,
                department: 'Maintenance',
                designation: 'Lead Engineer',
                baseSalary: 65000,
                phone: '9876543213'
            },
            {
                firstName: 'Admin',
                lastName: 'User',
                email: 'admin@medicore.com',
                password: 'a',
                role: ROLES.ADMIN,
                department: 'Administration',
                designation: 'Hospital Administrator',
                baseSalary: 150000,
                phone: '9876543214'
            },
            {
                firstName: 'Front',
                lastName: 'Desk',
                email: 'frontdesk@medicore.com',
                password: 'a',
                role: ROLES.FRONT_DESK,
                department: 'Front Desk',
                designation: 'Reception Supervisor',
                baseSalary: 55000,
                phone: '9876543215'
            },
            {
                firstName: 'Lab',
                lastName: 'Tech',
                email: 'lab@medicore.com',
                password: 'a',
                role: ROLES.DIAGNOSTICS,
                department: 'Laboratory',
                designation: 'Senior Lab Technician',
                baseSalary: 75000,
                phone: '9876543216'
            },
            {
                firstName: 'Pharmacist',
                lastName: 'User',
                email: 'pharmacy@medicore.com',
                password: 'a',
                role: ROLES.PHARMACY_INVENTORY,
                department: 'Pharmacy',
                designation: 'Chief Pharmacist',
                baseSalary: 95000,
                phone: '9876543217'
            },
            {
                firstName: 'Billing',
                lastName: 'Officer',
                email: 'billing@medicore.com',
                password: 'a',
                role: ROLES.REVENUE_OFFICE,
                department: 'Billing',
                designation: 'Billing In-charge',
                baseSalary: 70000,
                phone: '9876543218'
            },
            {
                firstName: 'HR',
                lastName: 'Manager',
                email: 'hr@hospital.com',
                password: 'a',
                role: ROLES.HR,
                department: 'Human Resources',
                designation: 'HR Director',
                baseSalary: 110000,
                phone: '9876543219'
            }
        ];

        const users = [];
        const staffMembers = [];
        const doctors = [];

        for (const data of staffData) {
            const user = await User.create({
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                password: data.password,
                role: data.role,
                department: data.department,
                employeeId: `EMP-${data.firstName[0]}${data.lastName[0]}-${Math.floor(Math.random() * 1000)}`.toUpperCase()
            });

            const staffMember = await Staff.create({
                userId: user._id,
                employeeId: user.employeeId,
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                phone: data.phone,
                role: data.role,
                department: data.department,
                designation: data.designation,
                baseSalary: data.baseSalary,
                dateJoined: new Date(2023, Math.floor(Math.random() * 12), 1),
                status: 'active',
                bankDetails: {
                    accountName: `${data.firstName} ${data.lastName}`,
                    accountNumber: `4099${Math.floor(10000000 + Math.random() * 90000000)}`,
                    bankName: 'HDFC Bank',
                    ifscCode: 'HDFC0001234'
                }
            });

            users.push(user);
            staffMembers.push(staffMember);
            if (data.role === ROLES.DOCTOR) doctors.push(user);
        }

        // Add a patient user for login parity
        await User.create({
            firstName: 'Patient',
            lastName: 'User',
            email: 'patient@medicore.com',
            password: 'a',
            role: ROLES.PATIENT
        });

        console.log(`Seed: Created ${staffMembers.length} staff members...`);

        // 2. Create Patients
        const patients = await Patient.create([
            {
                firstName: 'Charlie',
                lastName: 'Brown',
                name: 'Charlie Brown',
                mrn: 'MRN-2024001',
                contact: {
                    email: 'patient@hospital.com',
                    phone: '1234567890',
                    address: { street: '123 Pine St', city: 'Fremont', state: 'CA', zipCode: '94536', country: 'USA' }
                },
                dob: new Date('1990-01-01'),
                gender: 'Male',
                kycVerified: true,
                bloodGroup: 'O+',
                insuranceDetails: { provider: 'MediCare+', policyNumber: 'MC12345', status: 'Approved' },
                bedAllocated: { ward: 'General', bedNumber: 'G-101', allocatedAt: new Date() }
            },
            {
                firstName: 'Lucy',
                lastName: 'Van Pelt',
                name: 'Lucy Van Pelt',
                mrn: 'MRN-2024002',
                contact: {
                    email: 'lucy@vanpelt.com',
                    phone: '5550101',
                    address: { street: '456 Oak Ave', city: 'Fremont', state: 'CA', zipCode: '94536', country: 'USA' }
                },
                dob: new Date('1992-05-15'),
                gender: 'Female',
                kycVerified: true,
                bloodGroup: 'A-'
            }
        ]);
        console.log(`Seed: Created ${patients.length} patients...`);

        // 3. Create Inventory
        const inventory = await Inventory.create([
            { name: 'Paracetamol 500mg', category: 'Medicine', batchNumber: 'LOT123', expiryDate: new Date('2027-12-31'), quantity: 1000, unit: 'Tablets', unitPrice: 0.5 },
            { name: 'MRI Contrast', category: 'Consumable', batchNumber: 'B456', expiryDate: new Date('2026-06-30'), quantity: 50, unit: 'Vials', unitPrice: 20 },
            { name: 'Stethoscope', category: 'Equipment', batchNumber: 'SN789', expiryDate: new Date('2099-01-01'), quantity: 20, unit: 'Pieces', unitPrice: 150 }
        ]);
        console.log(`Seed: Created ${inventory.length} inventory items...`);

        // 4. Create Appointments
        const doc = doctors[0];
        await Appointment.create([
            {
                appointmentId: 'APT-2024001',
                patient: patients[0]._id,
                providerId: doc._id,
                startTime: new Date(),
                endTime: new Date(Date.now() + 30 * 60000), // 30 mins later
                type: 'consultation',
                status: 'Scheduled',
                reason: 'Regular Checkup',
                queueNumber: 1,
                vitals: { bloodPressure: '120/80', temperature: '98.6', pulse: '72', weight: '70kg' }
            },
            {
                appointmentId: 'APT-2024002',
                patient: patients[1]._id,
                providerId: doc._id,
                startTime: new Date(Date.now() + 3600000),
                endTime: new Date(Date.now() + 3600000 + 30 * 60000),
                type: 'urgent',
                status: 'Scheduled',
                reason: 'Fever',
                queueNumber: 2
            }
        ]);
        console.log('Seed: Created appointments...');

        // 5. Create Expenses
        await Expense.create([
            { title: 'Monthly Electricity Bill', category: 'Electricity', amount: 5000, status: 'Paid', paidTo: 'City Power' },
            { title: 'Medicine Procurement', category: 'Procurement', amount: 2000, status: 'Paid', paidTo: 'PharmaDist Inc' }
        ]);
        console.log('Seed: Created 2 expenses...');

        // 6. Create Billing
        await Billing.create({
            patient: patients[0]._id,
            items: [
                { description: 'Consultation Fee', amount: 50, category: 'Consultation' },
                { description: 'Pharmacy - Paracetamol', amount: 10, category: 'Pharmacy' }
            ],
            totalAmount: 60,
            insuranceCovered: 40,
            patientPayable: 20,
            paymentStatus: 'Paid',
            invoiceNumber: 'INV-SEED-001'
        });
        console.log('Seed: Created 1 billing record...');

        console.log('Database Seeding Completed Successfully!');
        process.exit();
    } catch (error) {
        console.error(`Error with seeding: ${error.message}`);
        console.error(error.stack);
        process.exit(1);
    }
};

seedData();
