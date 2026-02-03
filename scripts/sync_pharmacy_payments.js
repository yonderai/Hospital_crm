const mongoose = require('mongoose');
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/hospital_crm";

// Define Schemas inline to avoid import issues in script
const PaymentSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient" },
    customerName: String,
    invoiceId: { type: mongoose.Schema.Types.ObjectId, ref: "Invoice" },
    amount: Number,
    paymentDate: { type: Date, default: Date.now },
    method: String,
    status: String,
    notes: String
}, { timestamps: true });

const DispenseLogSchema = new mongoose.Schema({
    dispenseId: String,
    patientId: mongoose.Schema.Types.ObjectId,
    customerDetails: { name: String },
    paymentMode: String,
    totalAmount: Number,
    dispensedAt: Date
});

const Payment = mongoose.models.Payment || mongoose.model("Payment", PaymentSchema);
const DispenseLog = mongoose.models.DispenseLog || mongoose.model("DispenseLog", DispenseLogSchema);

async function syncPayments() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to MongoDB");

        const logs = await DispenseLog.find();
        console.log(`Found ${logs.length} dispense logs`);

        let createdCount = 0;
        let skippedCount = 0;

        for (const log of logs) {
            // Check if payment already exists for this dispense (using notes as a simple check)
            const existingPayment = await Payment.findOne({
                notes: new RegExp(`Pharmacy Dispense.*${log.dispenseId}|Manual Sale|DispenseLog:${log._id}`, 'i'),
                amount: log.totalAmount
            });

            if (existingPayment) {
                skippedCount++;
                continue;
            }

            // Map payment mode
            let method = "cash";
            if (log.paymentMode === "card") method = "credit_card";
            if (log.paymentMode === "upi") method = "eft";

            await Payment.create({
                patientId: log.patientId || null,
                customerName: !log.patientId ? (log.customerDetails?.name || "Walk-in Customer") : undefined,
                amount: log.totalAmount,
                paymentDate: log.dispensedAt,
                method: method,
                status: "completed",
                notes: `Migrated Pharmacy Dispense: ${log.dispenseId}`
            });
            createdCount++;
        }

        console.log(`Migration Complete: ${createdCount} payments created, ${skippedCount} skipped.`);
    } catch (err) {
        console.error("Migration Failed:", err);
    } finally {
        await mongoose.connection.close();
    }
}

syncPayments();
