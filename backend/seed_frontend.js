
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = "mongodb+srv://yuvrajsingh02608_db_user:yuvrajsingh@yondermedicareai.b6dwyv5.mongodb.net/yonder_medicare?retryWrites=true&w=majority";

const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('MongoDB Connected');
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

// Define schemas as they appear in the frontend app
const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    role: { type: String, required: true },
    department: String,
    credentials: [String]
}, { timestamps: true });
const User = mongoose.models.User || mongoose.model('User', UserSchema);

const PatientSchema = new mongoose.Schema({
    mrn: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    dob: { type: Date, required: true },
    gender: { type: String, required: true },
    contact: {
        phone: String,
        email: String,
        address: String
    }
}, { timestamps: true });
const Patient = mongoose.models.Patient || mongoose.model('Patient', PatientSchema);

const AppointmentSchema = new mongoose.Schema({
    appointmentId: { type: String, required: true, unique: true },
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
    providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    startTime: Date,
    endTime: Date,
    status: { type: String, default: 'scheduled' },
    type: String,
    reason: String
}, { timestamps: true });
const Appointment = mongoose.models.Appointment || mongoose.model('Appointment', AppointmentSchema);

const InvoiceSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
    invoiceNumber: String,
    items: [{ description: String, quantity: Number, unitPrice: Number, total: Number, category: String }],
    totalAmount: Number,
    balanceDue: Number,
    status: String,
    dueDate: Date
}, { timestamps: true });
const Invoice = mongoose.models.Invoice || mongoose.model('Invoice', InvoiceSchema);

const PrescriptionSchema = new mongoose.Schema({
    prescriptionId: { type: String, required: true, unique: true },
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
    providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    medications: [{
        drugName: String,
        dosage: String,
        frequency: String,
        duration: String
    }],
    status: { type: String, default: 'active' },
    prescribedDate: { type: Date, default: Date.now }
}, { timestamps: true });
const Prescription = mongoose.models.Prescription || mongoose.model('Prescription', PrescriptionSchema);

const LabResultSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
    testType: String,
    resultValue: String,
    unit: String,
    referenceRange: String,
    status: String,
    performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: Date
}, { timestamps: true });
const LabResult = mongoose.models.LabResult || mongoose.model('LabResult', LabResultSchema);

const seedData = async () => {
    await connectDB();

    console.log('Clearing old data...');
    try {
        await mongoose.connection.db.dropCollection('users').catch(() => { });
        await mongoose.connection.db.dropCollection('patients').catch(() => { });
        await mongoose.connection.db.dropCollection('appointments').catch(() => { });
        await mongoose.connection.db.dropCollection('invoices').catch(() => { });
        await mongoose.connection.db.dropCollection('prescriptions').catch(() => { });
        await mongoose.connection.db.dropCollection('labresults').catch(() => { });
    } catch (e) {
        console.log('Error clearing data', e);
    }

    console.log('Creating Users...');
    const doctors = [];
    for (let i = 0; i < 5; i++) {
        doctors.push(await User.create({
            firstName: ['James', 'Sarah', 'Michael', 'Emily', 'Robert'][i],
            lastName: ['Wilson', 'Johnson', 'Brown', 'Davis', 'Miller'][i],
            email: `doctor${i + 1}@hospital.com`,
            role: 'doctor',
            department: ['Cardiology', 'Neurology', 'Oncology', 'Pediatrics', 'Orthopedics'][i],
            credentials: ['MD', 'PhD']
        }));
    }

    // Nurses
    const nurses = [];
    for (let i = 0; i < 10; i++) {
        nurses.push(await User.create({
            firstName: `Nurse`,
            lastName: `${['A', 'B', 'C', 'D', 'E'][i % 5]}`,
            email: `nurse${i + 1}@hospital.com`,
            role: 'nurse',
            department: 'General Ward'
        }));
    }

    // Lab Tech (for results)
    const labTech = await User.create({ firstName: 'Lab', lastName: 'Tech', email: 'lab@hospital.com', role: 'lab-tech' });

    // Finance/Admin
    await User.create({ firstName: 'Finance', lastName: 'Manager', email: 'finance@hospital.com', role: 'back-office-finance' });
    await User.create({ firstName: 'Billing', lastName: 'Officer', email: 'billing@hospital.com', role: 'billing' });

    console.log('Creating Patients...');
    const patients = [];
    for (let i = 0; i < 20; i++) {
        patients.push(await Patient.create({
            firstName: ['Alice', 'Bob', 'Charlie', 'David', 'Eva'][i % 5],
            lastName: ['Smith', 'Jones', 'Williams', 'Taylor', 'Brown'][i % 5] + ` ${i}`,
            mrn: `MRN-${1000 + i}`,
            dob: new Date(1980, 0, 1),
            gender: i % 2 === 0 ? 'male' : 'female',
            contact: {
                phone: '555-0100',
                email: `patient${i}@example.com`,
                address: '123 Main St'
            }
        }));
    }

    console.log('Creating Appointments...');
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 15; i++) {
        const startTime = new Date(today);
        startTime.setHours(9 + i, 0);
        const endTime = new Date(startTime);
        endTime.setMinutes(30);

        await Appointment.create({
            appointmentId: `APT-${1000 + i}`,
            patientId: patients[i]._id,
            providerId: doctors[i % doctors.length]._id,
            startTime: startTime,
            endTime: endTime,
            status: i < 5 ? 'completed' : (i < 8 ? 'checked-in' : 'scheduled'),
            type: 'consultation',
            reason: 'Regular Checkup'
        });
    }

    console.log('Creating Invoices...');
    const invoiceCategories = [
        { desc: 'Consultation Fee', cat: 'Consultation', amount: 150 },
        { desc: 'Pharmacy - Antibiotics & Painkillers', cat: 'Medicines', amount: 45 },
        { desc: 'MRI Scan - Head', cat: 'Lab Reports', amount: 350 },
        { desc: 'Blood Test Panel - Comprehensive', cat: 'Lab Reports', amount: 120 },
        { desc: 'Minor Surgery - Suturing', cat: 'Operations', amount: 850 },
        { desc: 'Pharmacy - Insulin Supply', cat: 'Medicines', amount: 200 }
    ];

    for (let i = 0; i < 25; i++) {
        const randomItem = invoiceCategories[i % invoiceCategories.length];
        const invoiceDate = new Date(today);
        invoiceDate.setDate(today.getDate() - (i * 2));

        await Invoice.create({
            patientId: patients[i % patients.length]._id,
            invoiceNumber: `INV-${2024001 + i}`,
            items: [{
                description: randomItem.desc,
                quantity: 1,
                unitPrice: randomItem.amount,
                total: randomItem.amount,
                category: randomItem.cat
            }],
            totalAmount: randomItem.amount,
            balanceDue: i < 15 ? 0 : randomItem.amount,
            status: i < 15 ? 'paid' : 'sent',
            dueDate: new Date(invoiceDate.getTime() + 14 * 24 * 60 * 60 * 1000),
            createdAt: invoiceDate
        });
    }

    console.log('Creating Prescriptions...');
    const medications = [
        { name: 'Amoxicillin', dose: '500mg', freq: '3x daily', dur: '7 days' },
        { name: 'Lisinopril', dose: '10mg', freq: '1x daily', dur: '30 days' },
        { name: 'Metformin', dose: '500mg', freq: '2x daily', dur: '90 days' },
        { name: 'Ibuprofen', dose: '400mg', freq: 'As needed', dur: '5 days' },
        { name: 'Atorvastatin', dose: '20mg', freq: '1x daily', dur: '30 days' }
    ];

    for (let i = 0; i < 20; i++) {
        const med = medications[i % medications.length];
        await Prescription.create({
            prescriptionId: `RX-${2024000 + i}`,
            patientId: patients[i % patients.length]._id,
            providerId: doctors[i % doctors.length]._id,
            medications: [{
                drugName: med.name,
                dosage: med.dose,
                frequency: med.freq,
                duration: med.dur
            }],
            status: 'active',
            prescribedDate: new Date(today.getTime() - i * 24 * 60 * 60 * 1000)
        });
    }

    console.log('Creating Lab Results...');
    const tests = [
        { type: 'Complete Blood Count (CBC)', val: 'Normal', unit: 'N/A', range: 'N/A' },
        { type: 'Hemoglobin A1c', val: '5.7', unit: '%', range: '< 5.7%' },
        { type: 'Lipid Panel', val: 'Cholesterol 180', unit: 'mg/dL', range: '< 200 mg/dL' },
        { type: 'MRI Brain', val: 'Normal', unit: 'N/A', range: 'N/A' },
        { type: 'X-Ray Chest', val: 'Clear', unit: 'N/A', range: 'N/A' }
    ];

    for (let i = 0; i < 20; i++) {
        const test = tests[i % tests.length];
        await LabResult.create({
            patientId: patients[i % patients.length]._id,
            testType: test.type,
            resultValue: test.val,
            unit: test.unit,
            referenceRange: test.range,
            status: 'final',
            performedBy: labTech._id,
            createdAt: new Date(today.getTime() - i * 24 * 60 * 60 * 1000)
        });
    }

    console.log('Data Seeded Successfully!');
    process.exit();
};

seedData();
