// eslint-disable-next-line
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const util = require('util');

const MONGODB_URI = "mongodb+srv://yuvrajsingh02608_db_user:yuvrajsingh@yondermedicareai.b6dwyv5.mongodb.net/yonder_medicare?retryWrites=true&w=majority";

async function seedWorkflow() {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected');

        // Define schemas inline
        const userSchema = new mongoose.Schema({
            email: { type: String, required: true, unique: true, index: true },
            password: { type: String, required: true },
            role: { type: String, required: true },
            firstName: { type: String, required: true },
            lastName: { type: String, required: true },
            department: { type: String },
            isActive: { type: Boolean, default: true },
            permissions: {
                canView: { type: [String], default: [] },
                canEdit: { type: [String], default: [] },
                canDelete: { type: [String], default: [] },
                canApprove: { type: [String], default: [] },
            }
        }, { timestamps: true });

        const patientSchema = new mongoose.Schema({
            mrn: { type: String, required: true, unique: true, index: true },
            firstName: { type: String, required: true },
            lastName: { type: String, required: true },
            dob: { type: Date, required: true },
            gender: { type: String, required: true },
            email: { type: String }, // Top-level email to satisfy old indexes
            contact: {
                phone: { type: String },
                email: { type: String },
                address: { type: String },
            },
            insuranceInfo: {
                provider: { type: String },
                policyNumber: { type: String },
                groupNumber: { type: String },
            },
            assignedDoctorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            bloodType: { type: String },
            allergies: { type: [String], default: [] },
            chronicConditions: { type: [String], default: [] },
        }, { timestamps: true });

        const labOrderSchema = new mongoose.Schema({
            orderId: { type: String, required: true, unique: true },
            patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true, index: true },
            orderingProviderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
            tests: { type: [String], required: true },
            status: { type: String, default: "ordered" },
            results: [{
                testName: { type: String, required: true },
                value: { type: String, required: true },
                unit: { type: String, required: true },
                referenceRange: { type: String, required: true },
                abnormalFlag: { type: Boolean, default: false },
                notes: { type: String },
            }],
            resultDate: { type: Date },
            technicianId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        }, { timestamps: true });

        const imagingOrderSchema = new mongoose.Schema({
            patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
            orderedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
            imagingType: { type: String, required: true },
            bodyPart: { type: String, required: true },
            status: { type: String, default: "ordered" },
            completedAt: { type: Date },
        }, { timestamps: true });

        const radiologyReportSchema = new mongoose.Schema({
            orderId: { type: mongoose.Schema.Types.ObjectId, ref: "ImagingOrder", required: true },
            patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
            interpretedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
            findings: { type: String, required: true },
            impression: { type: String, required: true },
            status: { type: String, default: "final" },
            signedAt: { type: Date },
        }, { timestamps: true });

        const prescriptionSchema = new mongoose.Schema({
            prescriptionId: { type: String, required: true, unique: true },
            patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
            providerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
            prescribedDate: { type: Date, required: true },
            status: { type: String, default: "active" },
            medications: [{
                drugName: { type: String, required: true },
                dosage: { type: String, required: true },
                frequency: { type: String, required: true },
                route: { type: String, required: true },
                duration: { type: String, required: true },
                quantity: { type: Number, required: true },
                refills: { type: Number, default: 0 },
                instructions: { type: String }
            }]
        }, { timestamps: true });

        // Get or create models
        const User = mongoose.models.User || mongoose.model('User', userSchema);
        const Patient = mongoose.models.Patient || mongoose.model('Patient', patientSchema);
        const LabOrder = mongoose.models.LabOrder || mongoose.model('LabOrder', labOrderSchema);
        const ImagingOrder = mongoose.models.ImagingOrder || mongoose.model('ImagingOrder', imagingOrderSchema);
        const RadiologyReport = mongoose.models.RadiologyReport || mongoose.model('RadiologyReport', radiologyReportSchema);
        const Prescription = mongoose.models.Prescription || mongoose.model('Prescription', prescriptionSchema);

        // Clear existing data
        console.log('🗑️  Clearing data...');
        await User.deleteMany({});
        await Patient.deleteMany({});
        await LabOrder.deleteMany({});
        await ImagingOrder.deleteMany({});
        await RadiologyReport.deleteMany({});
        await Prescription.deleteMany({});
        console.log('✅ Data cleared');

        // Create users
        console.log('👥 Creating users...');
        const hashedPassword = await bcrypt.hash('a', 10);

        const doctor1 = await User.create({
            email: 'doctor@medicore.com',
            password: hashedPassword,
            role: 'doctor',
            firstName: 'Gregory',
            lastName: 'House',
            department: 'Oncology',
        });

        const labTech1 = await User.create({
            email: 'lab@medicore.com',
            password: hashedPassword,
            role: 'labtech',
            firstName: 'Dexter',
            lastName: 'Morgan',
            department: 'Laboratory',
        });

        // The user currently logged in in the screenshot
        const patientUser = await User.create({
            email: 'patient@medicore.com',
            password: hashedPassword,
            role: 'patient',
            firstName: 'John',
            lastName: 'Doe',
        });

        console.log('   ✓ Created users');

        // Create Patients
        console.log('🏥 Creating patients...');

        const john = await Patient.create({
            mrn: 'MRN-JOHN',
            firstName: 'John',
            lastName: 'Doe',
            dob: new Date('1980-01-01'),
            gender: 'Male',
            email: 'patient@medicore.com',
            contact: { email: 'patient@medicore.com', phone: '555-0000', address: '123 Main St' },
            insuranceInfo: {
                provider: 'Medicare Advantage',
                policyNumber: 'MA-99223344',
                groupNumber: 'GRP-HOSP-01'
            },
            assignedDoctorId: doctor1._id,
            bloodType: 'O+',
            allergies: [],
            chronicConditions: []
        });

        console.log(`   ✓ Created patient: ${john.firstName} ${john.lastName}`);

        // Create Prescriptions for John
        console.log('💊 Creating prescriptions for John...');
        await Prescription.create({
            prescriptionId: `RX-JOHN-001`,
            patientId: john._id,
            providerId: doctor1._id,
            prescribedDate: new Date(),
            status: 'active',
            medications: [
                {
                    drugName: 'Amoxicillin',
                    dosage: '500mg',
                    frequency: 'Three times a day',
                    route: 'Oral',
                    duration: '7 days',
                    quantity: 21,
                    refills: 0,
                    instructions: 'Take after meals'
                }
            ]
        });

        // Create Lab Results for John
        console.log('🧪 Creating lab orders for John...');
        await LabOrder.create({
            orderId: `LAB-JOHN-001`,
            patientId: john._id,
            orderingProviderId: doctor1._id,
            tests: ['Complete Blood Count (CBC)'],
            status: 'completed',
            resultDate: new Date(),
            technicianId: labTech1._id,
            results: [
                { testName: 'Hemoglobin', value: '14.2', unit: 'g/dL', referenceRange: '13.5-17.5', abnormalFlag: false }
            ]
        });

        // Create Radiology for John
        console.log('📸 Creating radiology for John...');
        const imageOrder = await ImagingOrder.create({
            patientId: john._id,
            orderedBy: doctor1._id,
            imagingType: 'X-Ray',
            bodyPart: 'Chest',
            status: 'completed',
            completedAt: new Date()
        });

        await RadiologyReport.create({
            orderId: imageOrder._id,
            patientId: john._id,
            interpretedBy: labTech1._id,
            findings: 'Lungs are clear. No abnormalities noted.',
            impression: 'Normal chest x-ray.',
            signedAt: new Date()
        });

        console.log('\n✨ Seeding complete!');

    } catch (error) {
        console.error('❌ FATAL ERROR DURING SEEDING:', util.inspect(error, { depth: null }));
    } finally {
        await mongoose.disconnect();
        console.log('🔌 Disconnected');
    }
}

seedWorkflow();
