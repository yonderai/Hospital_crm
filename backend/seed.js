
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { ROLES } from './src/config/roles.js';
import User from './src/models/User.js';
import Patient from './src/models/Patient.js';
import Appointment from './src/models/Appointment.js';
import Billing from './src/models/Billing.js';
import EmergencyCase from './src/models/EmergencyCase.js';
import Ambulance from './src/models/Ambulance.js';
import Staff from './src/models/Staff.js';

dotenv.config();

const connectDB = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI is not defined in .env");
        }
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const seedData = async () => {
    await connectDB();

    console.log('Clearing old data...');
    try {
        await Patient.collection.dropIndexes();
    } catch (e) { console.log('No indexes to drop'); }

    await User.deleteMany({});
    await Patient.deleteMany({});
    try {
        await Appointment.collection.dropIndexes();
    } catch (e) { console.log('No appointment indexes to drop'); }
    await Appointment.deleteMany({});
    await Billing.deleteMany({});
    console.log('Creating Standardized Staff...');
    await Staff.deleteMany({});

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
            firstName: 'Jessica',
            lastName: 'Pearson',
            email: 'hr@medicore.com',
            password: 'a',
            role: ROLES.HR,
            department: 'HR',
            designation: 'HR Director',
            baseSalary: 150000,
            phone: '9876543219'
        },
        {
            firstName: 'Emergency',
            lastName: 'Responder',
            email: 'emergency@medicore.com',
            password: 'a',
            role: ROLES.EMERGENCY,
            department: 'Emergency',
            designation: 'Lead Paramedic',
            baseSalary: 80000,
            phone: '9876543220'
        }
    ];

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

        if (data.role === ROLES.DOCTOR) {
            doctors.push(user);
        }
    }

    console.log('Creating Patients...');
    const patients = [];
    const patientNames = ['Alice Cooper', 'Bob Marley', 'Charlie Brown', 'David Bowie', 'Elvis Presley', 'Freddie Mercury', 'George Michael', 'Harry Styles', 'Iggy Pop', 'John Lennon'];

    for (let i = 0; i < 20; i++) {
        const fullName = patientNames[i % patientNames.length] + (i > 9 ? ` ${i}` : '');
        const [pFirst, pLast] = fullName.split(' ');
        const patientEmail = i === 0 ? "patient@medicore.com" : `patient${i + 1}@example.com`;

        const patient = await Patient.create({
            firstName: "Patient",
            lastName: "User",
            name: "Patient User",
            mrn: `MRN-${2024000 + i}`,
            contact: {
                phone: `555-01${i.toString().padStart(2, '0')}`,
                email: patientEmail,
                address: {
                    street: '123 Hospital Way',
                    city: 'New York',
                    state: 'NY',
                    zipCode: '10001',
                    country: 'USA'
                }
            },
            dob: new Date(1980, 0, 1),
            gender: i % 2 === 0 ? 'Male' : 'Female',
            // address: '123 Hospital Way', // Removed root address
            kycVerified: true,
            bloodGroup: ['A+', 'B+', 'O+', 'AB+'][i % 4],
            insuranceDetails: {
                provider: 'HealthGuard',
                policyNumber: `POL-${1000 + i}`,
                status: 'Approved'
            },
            bedAllocated: i < 5 ? { ward: 'ICU', bedNumber: `ICU-${i + 1}`, allocatedAt: new Date() } : undefined
        });

        patients.push(patient);

        // Also create a User document for the first patient for login
        if (i === 0) {
            await User.create({
                firstName: "Patient",
                lastName: "User",
                email: patientEmail,
                password: "a",
                role: ROLES.PATIENT
            });
        }
    }

    console.log('Creating Appointments...');
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 3; i++) {
        const appointmentDate = new Date(today);
        appointmentDate.setHours(9 + i, 0); // 9 AM onwards

        await Appointment.create({
            appointmentId: `APT-SEED-${1000 + i}`,
            patient: patients[i]._id,
            patientId: patients[i]._id, // Redundancy for schema compatibility
            providerId: doctors[i % doctors.length]._id, // Schema uses providerId
            startTime: appointmentDate,
            endTime: new Date(appointmentDate.getTime() + 30 * 60000),
            type: 'consultation',
            createdBy: 'staff',
            status: i < 5 ? 'Completed' : (i < 8 ? 'Checked-in' : 'Scheduled'),
            reason: ['Regular Checkup', 'Fever', 'Back Pain', 'Headache', 'Follow-up'][i % 5],
            queueNumber: i + 1,
            vitals: i < 8 ? {
                bloodPressure: '120/80',
                temperature: '98.6',
                pulse: '72',
                weight: '70kg'
            } : undefined
        });
    }

    console.log('Creating Billing Records...');
    for (let i = 0; i < 10; i++) {
        await Billing.create({
            patient: patients[i]._id,
            totalAmount: 150 + (i * 50),
            patientPayable: 50,
            insuranceCovered: 100 + (i * 50),
            paymentStatus: i < 5 ? 'Paid' : 'Unpaid',
            invoiceNumber: `INV-2024-${100 + i}`,
            items: [
                { description: 'Consultation Fee', amount: 100, category: 'Consultation' },
                { description: 'Lab Test', amount: 50 + (i * 50), category: 'Lab' }
            ]
        });
    }

    console.log('Creating Emergency Cases...');
    // Inline schema definition for immediate seeding if model missing, or relying on Models being added.
    // For now, I will add the logic to seed `EmergencyCase` assuming the model will be available or defining it if possible. 
    // Given the file structure, I should import it.

    // I will insert this log to indicate intent, but I need to create the files first.
    // I will hold off on adding the `EmergencyCase` seeding block until I create the model file to avoid runtime errors in `seed.js`.

    console.log('Creating Emergency Data...');
    await EmergencyCase.deleteMany({});
    await Ambulance.deleteMany({});

    const ambulances = [
        { plateNumber: "AMB-01", driverName: "John Doe", driverContact: "555-0101", status: "available", equipmentLevel: "als" },
        { plateNumber: "AMB-02", driverName: "Jane Smith", driverContact: "555-0102", status: "busy", eta: "5 mins", equipmentLevel: "icu" }
    ];
    await Ambulance.insertMany(ambulances);

    await EmergencyCase.create({
        tempName: "Trauma A (Male 40s)",
        triageLevel: "P1",
        status: "treatment",
        arrivalMode: "ambulance",
        chiefComplaint: "Multiple fractures",
        vitals: [{ bp: "90/60", pulse: 120, spo2: 92, temp: 36.5, gcs: 8 }]
    });

    console.log('Data Seeded Successfully!');
    process.exit();
};

seedData();
