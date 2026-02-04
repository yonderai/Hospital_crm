const mongoose = require("mongoose");
require("dotenv").config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error("Please define the MONGODB_URI environment variable inside .env.local");
    process.exit(1);
}

async function dbConnect() {
    if (mongoose.connection.readyState >= 1) return;
    return mongoose.connect(MONGODB_URI);
}

// Minimal Schema
const Prescription = mongoose.models.Prescription || mongoose.model("Prescription", new mongoose.Schema({ status: String }, { strict: false }));

async function fixGhostRx() {
    await dbConnect();
    console.log("Connected to DB");

    const ghostRxId = "697dd9032265b7918ca1e689"; // Found in debug step

    console.log(`Updating Ghost Rx: ${ghostRxId}`);

    const result = await Prescription.updateOne(
        { _id: ghostRxId },
        { $set: { status: "completed" } } // Mark as completed to clear from pending queue
    );

    console.log("Update Result:", result);
    process.exit(0);
}

fixGhostRx().catch(console.error);
