const mongoose = require('mongoose');

// const { faker } = require('@faker-js/faker'); // Removed dependency
require('dotenv').config({ path: '../.env' }); // Assuming run from scripts/ folder

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://yuvrajsingh02608_db_user:yuvrajsingh@yondermedicareai.b6dwyv5.mongodb.net/yonder_medicare?retryWrites=true&w=majority";

// Schemas - Basic definitions to allow seeding without full TS compilation
const UserSchema = new mongoose.Schema({}, { strict: false });
const ExpenseSchema = new mongoose.Schema({}, { strict: false });
const UtilityBillSchema = new mongoose.Schema({}, { strict: false });
const MedicalAssetSchema = new mongoose.Schema({}, { strict: false });
const MaintenanceLogSchema = new mongoose.Schema({}, { strict: false });
const SupplierSchema = new mongoose.Schema({}, { strict: false });
const PurchaseOrderSchema = new mongoose.Schema({}, { strict: false });
const PayrollSchema = new mongoose.Schema({}, { strict: false });
const AuditLogSchema = new mongoose.Schema({}, { strict: false });
const StaffSchema = new mongoose.Schema({}, { strict: false });

const User = mongoose.models.User || mongoose.model('User', UserSchema);
const Expense = mongoose.models.Expense || mongoose.model('Expense', ExpenseSchema);
const UtilityBill = mongoose.models.UtilityBill || mongoose.model('UtilityBill', UtilityBillSchema);
const MedicalAsset = mongoose.models.MedicalAsset || mongoose.model('MedicalAsset', MedicalAssetSchema);
const MaintenanceLog = mongoose.models.MaintenanceLog || mongoose.model('MaintenanceLog', MaintenanceLogSchema);
const Supplier = mongoose.models.Supplier || mongoose.model('Supplier', SupplierSchema);
const PurchaseOrder = mongoose.models.PurchaseOrder || mongoose.model('PurchaseOrder', PurchaseOrderSchema);
const Payroll = mongoose.models.Payroll || mongoose.model('Payroll', PayrollSchema);
const AuditLog = mongoose.models.AuditLog || mongoose.model('AuditLog', AuditLogSchema);
const Staff = mongoose.models.Staff || mongoose.model('Staff', StaffSchema);

async function seedFinance() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        // 1. Suppliers
        console.log('Seeding Suppliers...');
        await Supplier.deleteMany({ isDemo: true }); // Cleanup old demo data if marked, but here we just append or use names

        const suppliers = [
            { name: "MediTech Solutions", categories: ["equipment", "surgical"], email: "sales@meditech.com" },
            { name: "CleanCare Services", categories: ["cleaning", "housekeeping"], email: "admin@cleancare.com" },
            { name: "PowerGrid Corp", categories: ["utility", "electricity"], email: "billing@powergrid.com" },
            { name: "City Water Dept", categories: ["utility", "water"], email: "support@citywater.gov" },
            { name: "PharmaPlus Distributors", categories: ["pharmaceuticals"], email: "orders@pharmaplus.com" },
            { name: "SecureGuard Security", categories: ["security"], email: "contact@secureguard.com" },
            { name: "Global IT Systems", categories: ["it-hardware", "software"], email: "support@globalit.com" }
        ];

        const savedSuppliers = [];
        for (const s of suppliers) {
            const supplier = await Supplier.findOneAndUpdate(
                { name: s.name },
                { ...s, isActive: true },
                { upsert: true, new: true }
            );
            savedSuppliers.push(supplier);
        }

        // 2. Utility Bills
        console.log('Seeding Utility Bills...');
        await UtilityBill.deleteMany({}); // Easier to clear for clean stats
        const utilities = [
            { type: 'electricity', provider: 'PowerGrid Corp', unit: 'kWh', base: 4500, var: 500 },
            { type: 'water', provider: 'City Water Dept', unit: 'Liters', base: 12000, var: 2000 },
            { type: 'diesel', provider: 'Fuel Services Inc', unit: 'Liters', base: 500, var: 100 },
            { type: 'internet-utility', provider: 'FiberNet', unit: 'GB', base: 1000, var: 0 }
        ];

        for (let i = 0; i < 6; i++) { // Last 6 months
            const date = new Date();
            date.setMonth(date.getMonth() - i);

            for (const u of utilities) {
                const consumption = Math.floor(u.base + Math.random() * u.var);
                const amount = consumption * (u.type === 'electricity' ? 12 : u.type === 'diesel' ? 90 : 0.5); // Rough rates

                await UtilityBill.create({
                    utilityType: u.type,
                    providerName: u.provider,
                    billNumber: `BILL-${u.type.toUpperCase().substring(0, 3)}-${date.getMonth()}-${date.getFullYear()}`,
                    consumption,
                    unit: u.unit,
                    amount,
                    billDate: date,
                    dueDate: new Date(date.getTime() + 15 * 24 * 60 * 60 * 1000), // +15 days
                    status: i === 0 ? 'unpaid' : 'paid'
                });
            }
        }

        // 3. Operating Expenses
        console.log('Seeding Operating Expenses...');
        await Expense.deleteMany({});
        const categories = ["rent", "housekeeping", "security", "waste-disposal", "laundry", "cafeteria"];

        for (let i = 0; i < 50; i++) {
            const date = new Date();
            date.setDate(date.getDate() - Math.floor(Math.random() * 90)); // Last 90 days
            const category = categories[Math.floor(Math.random() * categories.length)];

            await Expense.create({
                category,
                description: `Monthly ${category} charges - ${date.toLocaleDateString()}`,
                amount: Math.floor(5000 + Math.random() * 20000),
                expenseDate: date,
                status: Math.random() > 0.2 ? 'approved' : 'pending',
                notes: "Auto-generated expense"
            });
        }

        // 4. Assets
        console.log('Seeding Assets...');
        await MedicalAsset.deleteMany({}); // Clear to rebuild clean list
        const assetTypes = [
            { name: "MRI Scanner 3000", tag: "IMG-001", cat: "imaging", cost: 1500000 },
            { name: "CT Scanner X5", tag: "IMG-002", cat: "imaging", cost: 800000 },
            { name: "ICU Ventilator Alpha", tag: "ICU-VENT-01", cat: "monitoring", cost: 25000 },
            { name: "ICU Ventilator Alpha", tag: "ICU-VENT-02", cat: "monitoring", cost: 25000 },
            { name: "Surgical Robot Arm", tag: "SURG-ROB-01", cat: "surgical", cost: 500000 },
            { name: "Backup Generator 500kVA", tag: "FAC-GEN-01", cat: "generator", cost: 45000 },
            { name: "Dell PowerEdge Server", tag: "IT-SRV-01", cat: "it-hardware", cost: 12000 },
            { name: "Reception Desk Unit", tag: "FUR-001", cat: "furniture", cost: 2000 },
            { name: "Hospital Ambulance", tag: "VEH-AMB-01", cat: "vehicle", cost: 60000 }
        ];

        const savedAssets = [];
        for (const a of assetTypes) {
            const asset = await MedicalAsset.create({
                assetTag: a.tag,
                name: a.name,
                category: a.cat,
                manufacturer: "General MedCorp",
                modelNumber: "X-2000",
                serialNumber: `SN-${Math.floor(Math.random() * 100000)}`,
                status: "operational",
                location: { department: "General" },
                purchaseDate: new Date(2023, 0, 15),
                warrantyExpiry: new Date(2028, 0, 15),
                nextMaintenanceDate: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000)
            });
            savedAssets.push(asset);
        }

        // 5. Maintenance Logs
        console.log('Seeding Maintenance Logs...');
        await MaintenanceLog.deleteMany({});
        for (const asset of savedAssets) {
            await MaintenanceLog.create({
                assetId: asset._id,
                maintenanceType: "preventive",
                description: "Quarterly checkup",
                technicianName: "John Doe",
                status: "completed",
                performedAt: new Date(),
                nextScheduledDate: new Date(new Date().getTime() + 90 * 24 * 60 * 60 * 1000),
                cost: 500
            });
        }

        // 6. Staff & Payroll
        console.log('Seeding Staff & Payroll...');
        // Ensure some staff exist
        // Note: We won't delete Staff as it might affect other modules, just find or create dummy
        let staffMember = await Staff.findOne();
        if (!staffMember) {
            staffMember = await Staff.create({
                firstName: "Alice", lastName: "Nurse", role: "nurse", department: "ICU", email: "alice@hospital.com", isActive: true, hireDate: new Date()
            });
        }

        await Payroll.deleteMany({});
        const months = [1, 2, 3];
        for (const m of months) {
            await Payroll.create({
                staffId: staffMember._id,
                month: m,
                year: 2026,
                baseSalary: 5000,
                netPay: 4800,
                status: 'paid'
            });
        }

        // 7. Purchase Orders
        console.log('Seeding Purchase Orders...');
        await PurchaseOrder.deleteMany({});
        const supplier = savedSuppliers[0];
        if (supplier) {
            await PurchaseOrder.create({
                poNumber: "PO-2026-001",
                supplierId: supplier._id,
                items: [],
                totalAmount: 15000,
                status: "ordered",
                createdAt: new Date()
            });
        }

        // 8. Audit Logs
        console.log('Seeding Audit Logs...');
        // Just a few sample logs
        const financeUser = await User.findOne({ role: 'finance' });
        if (financeUser) {
            await AuditLog.create({
                userId: financeUser._id,
                action: "APPROVED_EXPENSE",
                resourceType: "Expense",
                details: { amount: 5000 },
                timestamp: new Date()
            });
        }

        console.log('Finance Demo Data Seeded Successfully!');

    } catch (error) {
        console.error('Seeding Error:', error);
    } finally {
        await mongoose.connection.close();
    }
}

seedFinance();
