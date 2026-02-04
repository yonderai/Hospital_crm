import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/hospital-crm";

async function seedPatientReports() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("✅ Connected to MongoDB");

        // Import models
        const Patient = (await import('../src/lib/models/Patient')).default;
        const User = (await import('../src/lib/models/User')).default;
        const ImagingOrder = (await import('../src/lib/models/ImagingOrder')).default;
        const RadiologyReport = (await import('../src/lib/models/RadiologyReport')).default;
        const LabOrder = (await import('../src/lib/models/LabOrder')).default;
        const ORCase = (await import('../src/lib/models/ORCase')).default;
        const SurgeryOrder = (await import('../src/lib/models/SurgeryOrder')).default;
        const PostSurgeryInstruction = (await import('../src/lib/models/PostSurgeryInstruction')).default;

        // Find a patient with surgeries
        const patient = await Patient.findOne({ firstName: 'shruti' });
        if (!patient) {
            console.error("❌ Patient 'shruti sharma' not found!");
            process.exit(1);
        }
        console.log(`📋 Found patient: ${patient.firstName} ${patient.lastName} (${patient.mrn})`);

        // Find a doctor
        const doctor = await User.findOne({ role: 'doctor' });
        if (!doctor) {
            console.error("❌ No doctor found!");
            process.exit(1);
        }
        console.log(`👨‍⚕️ Found doctor: ${doctor.firstName} ${doctor.lastName}`);

        // 1. CREATE IMAGING ORDER AND RADIOLOGY REPORT
        console.log('\n📸 Creating Radiology Reports...');

        const imagingOrder = await ImagingOrder.create({
            patientId: patient._id,
            orderedBy: doctor._id,
            imagingType: 'CT Scan',
            bodyPart: 'Abdomen',
            priority: 'urgent',
            reasonForStudy: 'Pre-operative evaluation for abdominal surgery',
            status: 'completed',
            scheduledAt: new Date(Date.now() - 86400000 * 2), // 2 days ago
            completedAt: new Date(Date.now() - 86400000 * 1) // 1 day ago
        });
        console.log(`  ✅ Created ImagingOrder: ${imagingOrder.imagingType} - ${imagingOrder.bodyPart}`);

        const radiologyReport = await RadiologyReport.create({
            orderId: imagingOrder._id,
            patientId: patient._id,
            interpretedBy: doctor._id,
            findings: 'The CT scan of the abdomen shows normal liver, spleen, and kidneys. No evidence of masses, fluid collections, or abnormal enhancement. The bowel loops appear normal with no signs of obstruction.',
            impression: 'Normal abdominal CT scan. No acute pathology identified.',
            recommendations: 'Patient cleared for scheduled abdominal surgery. No contraindications found.',
            status: 'final',
            signedAt: new Date(Date.now() - 86400000 * 1)
        });
        console.log(`  ✅ Created RadiologyReport: ${radiologyReport.status}`);

        // Create another imaging order
        const imagingOrder2 = await ImagingOrder.create({
            patientId: patient._id,
            orderedBy: doctor._id,
            imagingType: 'X-Ray',
            bodyPart: 'Chest',
            priority: 'routine',
            reasonForStudy: 'Pre-operative chest clearance',
            status: 'completed',
            scheduledAt: new Date(Date.now() - 86400000 * 3),
            completedAt: new Date(Date.now() - 86400000 * 2)
        });

        const radiologyReport2 = await RadiologyReport.create({
            orderId: imagingOrder2._id,
            patientId: patient._id,
            interpretedBy: doctor._id,
            findings: 'Clear lung fields bilaterally. No consolidation, pleural effusion, or pneumothorax. Cardiac silhouette is normal.',
            impression: 'Normal chest X-ray.',
            recommendations: 'Cleared for general anesthesia.',
            status: 'final',
            signedAt: new Date(Date.now() - 86400000 * 2)
        });
        console.log(`  ✅ Created second RadiologyReport: ${radiologyReport2.status}`);

        // 2. CREATE LAB ORDERS WITH RESULTS
        console.log('\n🧪 Creating Lab Orders...');

        const labOrder = await LabOrder.create({
            orderId: `LAB-${Date.now()}-001`,
            patientId: patient._id,
            orderingProviderId: doctor._id,
            orderSource: 'internal',
            tests: ['Complete Blood Count', 'Basic Metabolic Panel', 'Coagulation Panel'],
            priority: 'urgent',
            status: 'completed',
            sampleCollectedAt: new Date(Date.now() - 86400000 * 2),
            results: [
                {
                    testName: 'Hemoglobin',
                    value: '13.5',
                    unit: 'g/dL',
                    referenceRange: '12.0-16.0',
                    abnormalFlag: false,
                    notes: 'Normal hemoglobin level'
                },
                {
                    testName: 'White Blood Cell Count',
                    value: '8.2',
                    unit: 'K/µL',
                    referenceRange: '4.5-11.0',
                    abnormalFlag: false
                },
                {
                    testName: 'Platelet Count',
                    value: '250',
                    unit: 'K/µL',
                    referenceRange: '150-400',
                    abnormalFlag: false
                },
                {
                    testName: 'Glucose',
                    value: '95',
                    unit: 'mg/dL',
                    referenceRange: '70-100',
                    abnormalFlag: false
                },
                {
                    testName: 'Creatinine',
                    value: '0.9',
                    unit: 'mg/dL',
                    referenceRange: '0.6-1.2',
                    abnormalFlag: false
                },
                {
                    testName: 'PT/INR',
                    value: '1.1',
                    unit: 'INR',
                    referenceRange: '0.8-1.2',
                    abnormalFlag: false,
                    notes: 'Normal coagulation - safe for surgery'
                }
            ],
            resultDate: new Date(Date.now() - 86400000 * 1),
            reviewedBy: doctor._id
        });
        console.log(`  ✅ Created LabOrder: ${labOrder.orderId} with ${labOrder.results.length} results`);

        // 3. CREATE PRE-SURGERY ORDERS
        console.log('\n🏥 Creating Pre-Surgery Orders...');

        // Find an existing OR case for this patient
        let orCase = await ORCase.findOne({ patientId: patient._id });

        if (!orCase) {
            console.log('  ⚠️ No existing OR case found, creating one...');
            orCase = await ORCase.create({
                patientId: patient._id,
                surgeonId: doctor._id,
                procedureCode: 'ABD-001',
                procedureName: 'abdomen',
                scheduledDate: new Date(Date.now() + 86400000 * 1), // Tomorrow
                startTime: '15:10',
                orRoomId: 'OR-01',
                status: 'scheduled',
                instruments: ['Scalpel', 'Forceps', 'Retractors'],
                implants: []
            });
            console.log(`  ✅ Created ORCase: ${orCase.procedureName}`);
        } else {
            console.log(`  ✅ Found existing ORCase: ${orCase.procedureName}`);
        }

        const preSurgeryOrder1 = await SurgeryOrder.create({
            caseId: orCase._id,
            patientId: patient._id,
            prescribedBy: doctor._id,
            orderType: 'npo_status',
            instructions: 'NPO (Nothing by mouth) after midnight before surgery. No food or liquids including water.',
            priority: 'stat',
            status: 'pending',
            scheduledFor: new Date(orCase.scheduledDate)
        });
        console.log(`  ✅ Created Pre-Surgery Order: ${preSurgeryOrder1.orderType}`);

        const preSurgeryOrder2 = await SurgeryOrder.create({
            caseId: orCase._id,
            patientId: patient._id,
            prescribedBy: doctor._id,
            orderType: 'medication',
            instructions: 'Administer prophylactic antibiotics (Cefazolin 2g IV) 30 minutes before incision.',
            priority: 'stat',
            status: 'pending',
            scheduledFor: new Date(orCase.scheduledDate)
        });
        console.log(`  ✅ Created Pre-Surgery Order: ${preSurgeryOrder2.orderType}`);

        const preSurgeryOrder3 = await SurgeryOrder.create({
            caseId: orCase._id,
            patientId: patient._id,
            prescribedBy: doctor._id,
            orderType: 'consent',
            instructions: 'Obtain informed consent for abdominal surgery including risks, benefits, and alternatives.',
            priority: 'urgent',
            status: 'completed',
            completedAt: new Date(Date.now() - 86400000 * 1),
            completedBy: doctor._id
        });
        console.log(`  ✅ Created Pre-Surgery Order: ${preSurgeryOrder3.orderType}`);

        // 4. CREATE POST-SURGERY INSTRUCTIONS (for completed surgeries)
        console.log('\n💊 Creating Post-Surgery Instructions...');

        // Find a completed surgery case
        let completedCase = await ORCase.findOne({ patientId: patient._id, status: 'completed' });

        if (completedCase) {
            const postInstruction1 = await PostSurgeryInstruction.create({
                caseId: completedCase._id,
                patientId: patient._id,
                prescribedBy: doctor._id,
                instructionType: 'pain_management',
                instructions: 'Administer Morphine 2-4mg IV every 4 hours as needed for pain. Monitor pain levels using pain scale.',
                priority: 'urgent',
                status: 'active',
                frequency: 'Every 4 hours PRN',
                duration: '48 hours post-op'
            });
            console.log(`  ✅ Created Post-Surgery Instruction: ${postInstruction1.instructionType}`);

            const postInstruction2 = await PostSurgeryInstruction.create({
                caseId: completedCase._id,
                patientId: patient._id,
                prescribedBy: doctor._id,
                instructionType: 'wound_care',
                instructions: 'Change surgical dressing daily. Inspect incision site for signs of infection (redness, swelling, discharge). Keep wound clean and dry.',
                priority: 'routine',
                status: 'active',
                frequency: 'Daily',
                duration: '7 days'
            });
            console.log(`  ✅ Created Post-Surgery Instruction: ${postInstruction2.instructionType}`);
        } else {
            console.log('  ⚠️ No completed surgery found for post-op instructions');
        }

        console.log('\n✅ All patient reports data seeded successfully!');
        console.log(`\n📊 Summary:`);
        console.log(`   - Patient: ${patient.firstName} ${patient.lastName} (${patient.mrn})`);
        console.log(`   - Radiology Reports: 2`);
        console.log(`   - Lab Orders: 1 (with 6 results)`);
        console.log(`   - Pre-Surgery Orders: 3`);
        console.log(`   - Post-Surgery Instructions: ${completedCase ? '2' : '0'}`);

    } catch (error) {
        console.error("❌ Error seeding patient reports:", error);
    } finally {
        await mongoose.disconnect();
        console.log('\n👋 Disconnected from MongoDB');
    }
}

seedPatientReports();
