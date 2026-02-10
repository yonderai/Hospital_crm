const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI is not defined in .env');
    process.exit(1);
}

// Exactly 12 roles/portals (Admin, Doctor, Nurse, Frontdesk, Labtech, Billing, Pharmacist, HR, Patient, Finance, Emergency, Maintenance)
const ROLES = [
    "admin", "doctor", "nurse", "frontdesk", "labtech",
    "billing", "pharmacist", "hr",
    "patient", "finance", "emergency", "maintenance"
];

const PATIENT_NAMES = [
    'Alice Cooper', 'Bob Marley', 'Charlie Brown', 'David Bowie', 'Elvis Presley',
    'Freddie Mercury', 'George Michael', 'Harry Styles', 'Iggy Pop', 'John Lennon',
    'Mick Jagger', 'Paul McCartney', 'Robert Plant', 'Stevie Nicks', 'Debbie Harry',
    'Joan Jett', 'David Gilmour', 'Roger Waters', 'Jimi Hendrix', 'Eric Clapton'
];

async function seedMaster() {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected');

        // --- SCHEMAS ---
        const UserSchema = new mongoose.Schema({
            email: { type: String, required: true, unique: true },
            password: { type: String, required: true },
            role: { type: String, required: true },
            firstName: { type: String, required: true },
            lastName: { type: String, required: true },
            department: { type: String },
            isActive: { type: Boolean, default: true },
            employeeId: { type: String }
        }, { timestamps: true });

        const PatientSchema = new mongoose.Schema({
            mrn: { type: String, required: true, unique: true },
            firstName: { type: String, required: true },
            lastName: { type: String, required: true },
            email: { type: String },
            gender: { type: String },
            dob: { type: Date },
            bloodType: { type: String },
            contact: { phone: { type: String, required: true }, email: String },
            latestAiInsight: { type: String }
        }, { timestamps: true });

        const EncounterSchema = new mongoose.Schema({
            encounterId: { type: String, required: true, unique: true },
            patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
            providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
            status: { type: String, default: 'open' },
            type: { type: String, required: true, enum: ["outpatient", "inpatient", "emergency", "telemedicine"] },
            encounterDate: { type: Date, default: Date.now },
            vitals: {
                bloodPressure: String,
                temperature: Number,
                heartRate: Number,
                respiratoryRate: Number,
                oxygenSaturation: Number
            },
            chiefComplaint: { type: String, required: true }
        }, { timestamps: true });

        const BedSchema = new mongoose.Schema({
            bedNumber: { type: String, required: true, unique: true },
            roomNumber: { type: String, required: true },
            floor: { type: String, required: true },
            ward: { type: String, required: true },
            type: { type: String, required: true, enum: ["general", "icu", "private", "emergency"] },
            status: { type: String, default: 'available', enum: ["available", "occupied", "maintenance", "cleaning"] },
            currentPatientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
            dailyRate: { type: Number, required: true }
        }, { timestamps: true });

        const PrescriptionSchema = new mongoose.Schema({
            prescriptionId: { type: String, required: true, unique: true },
            patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
            providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            medications: [{ drugName: String, dosage: String, frequency: String }],
            status: { type: String, default: 'active' },
            prescribedDate: { type: Date, default: Date.now }
        }, { timestamps: true });

        const StaffSchema = new mongoose.Schema({
            employeeId: { type: String, required: true, unique: true },
            firstName: { type: String, required: true },
            lastName: { type: String, required: true },
            email: { type: String, required: true, unique: true },
            phone: { type: String, required: true },
            role: { type: String, required: true },
            department: { type: String, required: true },
            designation: { type: String, required: true },
            baseSalary: { type: Number, required: true },
            status: { type: String, default: 'active' },
            dateJoined: { type: Date, default: Date.now }
        }, { timestamps: true });

        const InventoryItemSchema = new mongoose.Schema({
            sku: { type: String, required: true, unique: true },
            name: { type: String, required: true },
            category: { type: String, required: true, enum: ["medication", "supply", "equipment"] },
            unit: { type: String, required: true },
            quantityOnHand: { type: Number, required: true, default: 0 },
            reorderLevel: { type: Number, required: true, default: 10 },
            unitCost: { type: Number, required: true },
            sellingPrice: { type: Number },
            location: {
                zone: { type: String, required: true },
                block: { type: String, required: true },
                shelf: { type: String, required: true }
            },
            lotNumber: { type: String },
            expiryDate: { type: Date },
            batches: [{
                lotNumber: { type: String, required: true },
                expiryDate: { type: Date, required: true },
                quantity: { type: Number, required: true, default: 0 }
            }],
            isActive: { type: Boolean, default: true }
        }, { timestamps: true });

        const EmergencyCaseSchema = new mongoose.Schema({
            triageLevel: { type: String, required: true, enum: ["P1", "P2", "P3", "P4", "P5"] },
            status: { type: String, required: true, enum: ["triage", "treatment", "observation", "admitted", "discharged", "expired"] },
            chiefComplaint: { type: String, required: true },
            arrivalMode: { type: String, required: true, enum: ["ambulance", "walk-in", "referral", "police"] },
            vitals: [{ bp: String, pulse: Number, spo2: Number, temp: Number }]
        }, { timestamps: true });

        const AmbulanceSchema = new mongoose.Schema({
            plateNumber: { type: String, required: true, unique: true },
            driverName: { type: String, required: true },
            driverContact: { type: String, required: true },
            status: { type: String, required: true, enum: ["available", "busy", "maintenance"], default: "available" },
            equipmentLevel: { type: String, required: true, enum: ["basic", "als", "icu"], default: "basic" }
        }, { timestamps: true });

        const AppointmentSchema = new mongoose.Schema({
            appointmentId: { type: String, required: true, unique: true },
            patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
            providerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
            startTime: { type: Date, required: true },
            endTime: { type: Date, required: true },
            status: { type: String, default: "scheduled", enum: ["scheduled", "checked-in", "in-progress", "completed", "cancelled", "no-show"] },
            type: { type: String, required: true, enum: ["consultation", "follow-up", "procedure", "emergency"] },
            reason: { type: String, required: true },
            chiefComplaint: { type: String },
            aiInsights: { type: String },
            createdBy: { type: String, required: true, enum: ["patient", "staff"], default: "patient" }
        }, { timestamps: true });

        const InvoiceSchema = new mongoose.Schema({
            invoiceNumber: { type: String, required: true, unique: true },
            patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient" },
            totalAmount: { type: Number, required: true },
            balanceDue: { type: Number, required: true },
            status: { type: String, required: true, default: "draft" },
            dueDate: { type: Date, required: true }
        }, { timestamps: true });

        const PaymentSchema = new mongoose.Schema({
            amount: { type: Number, required: true },
            paymentDate: { type: Date, default: Date.now },
            method: { type: String, required: true, enum: ["cash", "credit_card", "debit_card", "eft", "check", "insurance_eft"] },
            status: { type: String, required: true, default: "completed" },
            patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient" }
        }, { timestamps: true });

        // --- MODELS ---
        const User = mongoose.models.User || mongoose.model('User', UserSchema);
        const Patient = mongoose.models.Patient || mongoose.model('Patient', PatientSchema);
        const Encounter = mongoose.models.Encounter || mongoose.model('Encounter', EncounterSchema);
        const Bed = mongoose.models.HospitalBed || mongoose.model('HospitalBed', BedSchema);
        const Prescription = mongoose.models.Prescription || mongoose.model('Prescription', PrescriptionSchema);
        const Staff = mongoose.models.Staff || mongoose.model('Staff', StaffSchema);
        const InventoryItem = mongoose.models.InventoryItem || mongoose.model('InventoryItem', InventoryItemSchema);
        const EmergencyCase = mongoose.models.EmergencyCase || mongoose.model('EmergencyCase', EmergencyCaseSchema);
        const Ambulance = mongoose.models.Ambulance || mongoose.model('Ambulance', AmbulanceSchema);
        const Invoice = mongoose.models.Invoice || mongoose.model("Invoice", InvoiceSchema);
        const Payment = mongoose.models.Payment || mongoose.model("Payment", PaymentSchema);
        const Appointment = mongoose.models.Appointment || mongoose.model("Appointment", AppointmentSchema);

        console.log('🗑️ Clearing existing data...');
        await Promise.all([
            User.deleteMany({}), Patient.deleteMany({}), Encounter.deleteMany({}),
            Bed.deleteMany({}), Prescription.deleteMany({}), Staff.deleteMany({}),
            InventoryItem.deleteMany({}), EmergencyCase.deleteMany({}), Ambulance.deleteMany({}),
            Invoice.deleteMany({}), Payment.deleteMany({}), Appointment.deleteMany({})
        ]);

        const hashedPassword = await bcrypt.hash('a', 10);

        console.log('👥 Creating users (12 portals)...');
        for (const role of ROLES) {
            await User.create({
                email: `${role}@medicore.com`,
                password: hashedPassword,
                role: role,
                firstName: role.charAt(0).toUpperCase() + role.slice(1),
                lastName: 'User',
                employeeId: `EMP-${role.toUpperCase()}`
            });
        }

        console.log('🏥 Creating 20 Patients...');
        const patients = [];
        for (let i = 0; i < PATIENT_NAMES.length; i++) {
            const [fname, lname] = PATIENT_NAMES[i].split(' ');
            const p = await Patient.create({
                mrn: `MRN-${2024000 + i}`,
                firstName: fname,
                lastName: lname || 'Doe',
                email: `${fname.toLowerCase()}@example.com`,
                gender: i % 2 === 0 ? 'Male' : 'Female',
                dob: new Date(1970 + Math.floor(Math.random() * 40), Math.floor(Math.random() * 12), 1),
                bloodType: ['A+', 'B+', 'O+', 'AB+'][i % 4],
                contact: { phone: `555123${i.toString().padStart(4, '0')}` }
            });
            patients.push(p);
        }

        const doctorUser = await User.findOne({ role: 'doctor' });

        console.log('🛏️ Creating 40 Beds...');
        // Floor 1: General (Rooms 101-105, 4 beds each)
        for (let r = 1; r <= 5; r++) {
            for (let b = 1; b <= 4; b++) {
                const room = `10${r}`;
                const bedNum = `${room}-${String.fromCharCode(64 + b)}`;
                const patient = (r === 1 && b <= 2) ? patients[b - 1] : null;
                await Bed.create({
                    bedNumber: bedNum, roomNumber: room, floor: "1st Floor", ward: "General Ward",
                    type: "general", status: patient ? "occupied" : "available",
                    currentPatientId: patient ? patient._id : null, dailyRate: 500
                });
            }
        }
        // Floor 2: ICU (Rooms 201-205, 2 beds each)
        for (let r = 1; r <= 5; r++) {
            for (let b = 1; b <= 2; b++) {
                const room = `20${r}`;
                const bedNum = `ICU-${room}-${b}`;
                await Bed.create({
                    bedNumber: bedNum, roomNumber: room, floor: "2nd Floor", ward: "ICU",
                    type: "icu", status: "available", dailyRate: 2000
                });
            }
        }
        // Floor 3: Private (Rooms 301-310, 1 bed each)
        for (let r = 1; r <= 10; r++) {
            const room = `3${r.toString().padStart(2, '0')}`;
            await Bed.create({
                bedNumber: room, roomNumber: room, floor: "3rd Floor", ward: "Private",
                type: "private", status: "available", dailyRate: 1500
            });
        }

        console.log('💊 Creating Pharmacy Inventory (10 items)...');
        const meds = [
            { name: 'Paracetamol', price: 5.50, expiry: '2026-12-01' },
            { name: 'Amoxicillin', price: 12.00, expiry: '2025-05-15' },
            { name: 'Ibuprofen', price: 8.25, expiry: '2024-03-20' }, // Expired for testing
            { name: 'Cough Syrup', price: 15.00, expiry: '2026-08-10' },
            { name: 'Vitamin C', price: 20.00, expiry: '2027-01-05' },
            { name: 'Insulin', price: 45.00, expiry: '2025-11-30' },
            { name: 'Aspirin', price: 6.50, expiry: '2026-02-28' },
            { name: 'Cetirizine', price: 10.00, expiry: '2025-09-12' },
            { name: 'Metformin', price: 18.50, expiry: '2026-06-15' },
            { name: 'Omeprazole', price: 22.00, expiry: '2025-12-25' }
        ];

        for (let i = 0; i < meds.length; i++) {
            const med = meds[i];
            const expiryDate = new Date(med.expiry);
            await InventoryItem.create({
                sku: `SKU-${100 + i}`,
                name: med.name,
                category: 'medication',
                unit: 'Tablet',
                quantityOnHand: Math.floor(Math.random() * 500) + 10,
                reorderLevel: 50,
                unitCost: med.price * 0.6,
                sellingPrice: med.price,
                lotNumber: `LOT-${2024000 + i}`,
                expiryDate: expiryDate,
                location: { zone: 'Tablet', block: 'B1', shelf: `S${i + 1}` },
                batches: [{
                    lotNumber: `LOT-${2024000 + i}`,
                    expiryDate: expiryDate,
                    quantity: 100
                }]
            });
        }

        console.log('📝 Creating Clinical Data...');
        await Encounter.create({
            encounterId: 'ENC-001', patientId: patients[0]._id, providerId: doctorUser._id,
            status: 'open', type: 'outpatient', chiefComplaint: 'Follow up',
            vitals: { bloodPressure: '120/80', temperature: 98.6, heartRate: 72, oxygenSaturation: 98 }
        });
        await Prescription.create({
            prescriptionId: `RX-${Date.now()}-001`,
            patientId: patients[0]._id,
            providerId: doctorUser._id,
            status: 'active',
            medications: [{ drugName: 'Paracetamol', dosage: '500mg', frequency: 'Daily' }]
        });

        console.log('📅 Creating 5 Appointments for Today...');
        const reasons = [
            "Severe chest pain and shortness of breath since morning.",
            "Recurring migraines and sensitivity to light.",
            "Post-surgery follow-up for appendectomy.",
            "Chronic knee pain and stiff joints in the morning.",
            "Fever, dry cough, and loss of taste."
        ];
        const insights = [
            "Clinical Insight: High priority. Symptoms suggest potential cardiovascular distress or acute respiratory issue. Immediate ECG and cardiac enzyme panel recommended. Rule out MI or pulmonary embolism.",
            "Clinical Insight: Moderate priority. Classic migraine presentation with photophobia. Recommend neurological assessment for prophylactic treatment options. Monitor for aura or atypical symptoms.",
            "Clinical Insight: Routine follow-up. Monitor incision site for signs of infection (redness, discharge). Assess bowel function post-anesthesia. Patient reports stable progress.",
            "Clinical Insight: Chronic condition management. Suggests osteoarthritis or rheumatoid flare. Recommend physical therapy and potentially anti-inflammatory meds. Check uric acid levels to rule out gout.",
            "Clinical Insight: High contagiousness risk. Symptoms align with viral respiratory infection (e.g., COVID-19 or Influenza). Recommend isolation protocols and RT-PCR testing. Monitor oxygen levels."
        ];

        for (let i = 0; i < 5; i++) {
            const startStr = `${new Date().toISOString().split('T')[0]}T${(9 + i).toString().padStart(2, '0')}:00:00`;
            const start = new Date(startStr);
            const end = new Date(start.getTime() + 30 * 60000);

            await Appointment.create({
                appointmentId: `APT-2024-${1000 + i}`,
                patientId: patients[i]._id,
                providerId: doctorUser._id,
                startTime: start,
                endTime: end,
                status: "scheduled",
                type: i === 2 ? "follow-up" : "consultation",
                reason: reasons[i],
                aiInsights: insights[i],
                createdBy: "patient"
            });

            // Update patient's latest insight for consistency
            await Patient.findByIdAndUpdate(patients[i]._id, { latestAiInsight: insights[i] });
        }

        console.log('\n✨ Master Seeding Complete!');
        console.log('12 Portals successfully seeded.');

    } catch (error) {
        console.error('❌ Seeding Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 Disconnected');
    }
}

seedMaster();
