const mongoose = require("mongoose");
require("dotenv").config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error("Please define the MONGODB_URI environment variable inside .env.local");
    process.exit(1);
}

// Define specific sub-schema for phone validation test to mimic Patient schema behavior
const contactSchema = new mongoose.Schema({
    phone: { type: String, required: true, minlength: 10, maxlength: 10 },
}, { _id: false });

const TestPatientSchema = new mongoose.Schema({
    contact: contactSchema
});

// We don't need to load the actual model file if we just want to test the validation logic provided by Mongoose
// But to be 100% sure, let's try to mock using the actual rule we applied.

async function run() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to DB");

        const TestModel = mongoose.model("TestPhoneValidation", TestPatientSchema);

        // Test 1: Valid 10 digit
        console.log("Testing Valid 10-digit Phone...");
        try {
            const valid = new TestModel({ contact: { phone: "9876543210" } });
            await valid.validate();
            console.log("✅ Valid phone passed.");
        } catch (err) {
            console.error("❌ Valid phone failed:", err.message);
        }

        // Test 2: Invalid 9 digit
        console.log("Testing Invalid 9-digit Phone...");
        try {
            const invalidShort = new TestModel({ contact: { phone: "123456789" } });
            await invalidShort.validate();
            console.log("❌ Invalid (short) phone PASSED (Unexpected).");
        } catch (err) {
            console.log("✅ Invalid (short) phone correctly rejected:", err.message);
        }

        // Test 3: Invalid 11 digit
        console.log("Testing Invalid 11-digit Phone...");
        try {
            const invalidLong = new TestModel({ contact: { phone: "12345678901" } });
            await invalidLong.validate();
            console.log("❌ Invalid (long) phone PASSED (Unexpected).");
        } catch (err) {
            console.log("✅ Invalid (long) phone correctly rejected:", err.message);
        }

    } catch (error) {
        console.error("Script Error:", error);
    } finally {
        await mongoose.disconnect();
    }
}

run();
