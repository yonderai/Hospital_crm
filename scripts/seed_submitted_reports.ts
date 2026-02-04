import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/hospital-crm";

async function seedSubmittedReports() {
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

        // Find a patient
        const patient = await Patient.findOne({ firstName: 'shruti' });
        if (!patient) {
            console.error("❌ Patient 'shruti' not found!");
            process.exit(1);
        }
        console.log(`📋 Found patient: ${patient.firstName} ${patient.lastName} (${patient.mrn})`);

        // Find a doctor/radiologist
        const doctor = await User.findOne({ role: 'doctor' });
        if (!doctor) {
            console.error("❌ No doctor found!");
            process.exit(1);
        }
        console.log(`👨‍⚕️ Found doctor: ${doctor.firstName} ${doctor.lastName}`);

        // === 1. CREATE SUBMITTED RADIOLOGY REPORTS ===
        console.log('\n📸 Creating Submitted Radiology Reports...');

        // Create imaging order first
        const ctOrder = await ImagingOrder.create({
            patientId: patient._id,
            orderedBy: doctor._id,
            imagingType: 'CT Scan',
            bodyPart: 'Abdomen',
            priority: 'urgent',
            reasonForStudy: 'Pre-operative evaluation for abdominal surgery',
            status: 'completed',
            scheduledAt: new Date(Date.now() - 86400000 * 2),
            completedAt: new Date(Date.now() - 86400000 * 1)
        });

        // Create SUBMITTED radiology report
        const ctReport = await RadiologyReport.create({
            orderId: ctOrder._id,
            patientId: patient._id,
            interpretedBy: doctor._id,
            findings: 'The CT scan of the abdomen demonstrates normal liver parenchyma with no focal lesions. The spleen, pancreas, and both kidneys appear unremarkable. No evidence of free fluid, masses, or abnormal lymphadenopathy. The bowel loops are normal in caliber with no signs of obstruction or inflammatory changes.',
            impression: 'Normal abdominal CT scan. No acute intra-abdominal pathology identified.',
            recommendations: 'Patient is cleared for scheduled surgical procedure. No contraindications identified on imaging.',
            status: 'final', // SUBMITTED STATUS
            signedAt: new Date(Date.now() - 86400000 * 1)
        });
        console.log(`  ✅ Created FINAL Radiology Report: ${ctOrder.imagingType} - ${ctOrder.bodyPart}`);

        // Create another radiology report
        const xrayOrder = await ImagingOrder.create({
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

        const xrayReport = await RadiologyReport.create({
            orderId: xrayOrder._id,
            patientId: patient._id,
            interpretedBy: doctor._id,
            findings: 'PA and lateral chest radiographs demonstrate clear lung fields bilaterally. No consolidation, pleural effusion, or pneumothorax identified. The cardiac silhouette is within normal limits. The mediastinal contours are unremarkable. No acute bony abnormalities.',
            impression: 'Normal chest radiograph. Lungs are clear.',
            recommendations: 'Patient is cleared for general anesthesia from a pulmonary standpoint.',
            status: 'final', // SUBMITTED STATUS
            signedAt: new Date(Date.now() - 86400000 * 2)
        });
        console.log(`  ✅ Created FINAL Radiology Report: ${xrayOrder.imagingType} - ${xrayOrder.bodyPart}`);

        // === 2. CREATE COMPLETED LAB REPORTS WITH RESULTS ===
        console.log('\n🧪 Creating Completed Lab Reports...');

        const labOrder = await LabOrder.create({
            orderId: `LAB-${Date.now()}-001`,
            patientId: patient._id,
            orderingProviderId: doctor._id,
            orderSource: 'internal',
            tests: ['Complete Blood Count', 'Basic Metabolic Panel', 'Coagulation Panel'],
            priority: 'urgent',
            status: 'completed', // COMPLETED STATUS
            sampleCollectedAt: new Date(Date.now() - 86400000 * 2),
            results: [ // WITH RESULTS
                {
                    testName: 'Hemoglobin',
                    value: '13.5',
                    unit: 'g/dL',
                    referenceRange: '12.0-16.0',
                    abnormalFlag: false,
                    notes: 'Normal hemoglobin level - adequate for surgery'
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
                    testName: 'Glucose (Fasting)',
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
                    abnormalFlag: false,
                    notes: 'Normal renal function'
                },
                {
                    testName: 'PT/INR',
                    value: '1.1',
                    unit: 'INR',
                    referenceRange: '0.8-1.2',
                    abnormalFlag: false,
                    notes: 'Normal coagulation - safe for surgical intervention'
                }
            ],
            resultDate: new Date(Date.now() - 86400000 * 1),
            reviewedBy: doctor._id
        });
        console.log(`  ✅ Created COMPLETED Lab Report: ${labOrder.orderId} with ${labOrder.results.length} results`);

        // === 3. CREATE PRE-SURGERY ORDERS (Given by Doctor) ===
        console.log('\n🏥 Creating Pre-Surgery Orders...');

        let orCase = await ORCase.findOne({ patientId: patient._id });

        if (!orCase) {
            orCase = await ORCase.create({
                patientId: patient._id,
                surgeonId: doctor._id,
                procedureCode: 'ABD-001',
                procedureName: 'Laparoscopic Appendectomy',
                scheduledDate: new Date(Date.now() + 86400000 * 1),
                startTime: '14:00',
                orRoomId: 'OR-01',
                status: 'scheduled',
                instruments: ['Laparoscope', 'Trocar Set', 'Graspers', 'Scissors'],
                implants: []
            });
            console.log(`  ✅ Created ORCase: ${orCase.procedureName}`);
        }

        const npoOrder = await SurgeryOrder.create({
            caseId: orCase._id,
            patientId: patient._id,
            prescribedBy: doctor._id,
            orderType: 'npo_status',
            instructions: 'NPO (Nothing by mouth) after midnight before surgery. No food, liquids, or water. Patient education provided regarding importance of compliance.',
            priority: 'stat',
            status: 'pending',
            scheduledFor: new Date(orCase.scheduledDate)
        });
        console.log(`  ✅ Created Pre-Surgery Order: ${npoOrder.orderType}`);

        const medicationOrder = await SurgeryOrder.create({
            caseId: orCase._id,
            patientId: patient._id,
            prescribedBy: doctor._id,
            orderType: 'medication',
            instructions: 'Administer prophylactic antibiotics (Cefazolin 2g IV) 30-60 minutes before surgical incision. Ensure no penicillin allergy documented.',
            priority: 'stat',
            status: 'pending',
            scheduledFor: new Date(orCase.scheduledDate)
        });
        console.log(`  ✅ Created Pre-Surgery Order: ${medicationOrder.orderType}`);

        const consentOrder = await SurgeryOrder.create({
            caseId: orCase._id,
            patientId: patient._id,
            prescribedBy: doctor._id,
            orderType: 'consent',
            instructions: 'Obtain informed surgical consent for laparoscopic appendectomy. Discuss risks including bleeding, infection, injury to surrounding organs, and need for conversion to open procedure.',
            priority: 'urgent',
            status: 'completed',
            completedAt: new Date(Date.now() - 86400000 * 1),
            completedBy: doctor._id
        });
        console.log(`  ✅ Created Pre-Surgery Order: ${consentOrder.orderType} (COMPLETED)`);

        console.log('\n✅ All submitted reports and orders created successfully!');
        console.log(`\n📊 Summary:`);
        console.log(`   - Patient: ${patient.firstName} ${patient.lastName} (${patient.mrn})`);
        console.log(`   - Radiology Reports (FINAL): 2`);
        console.log(`   - Lab Reports (COMPLETED with results): 1`);
        console.log(`   - Pre-Surgery Orders: 3`);
        console.log(`\n💡 These are SUBMITTED reports that will show in the Patient Reports modal!`);

    } catch (error) {
        console.error("❌ Error seeding submitted reports:", error);
    } finally {
        await mongoose.disconnect();
        console.log('\n👋 Disconnected from MongoDB');
    }
}

seedSubmittedReports();
