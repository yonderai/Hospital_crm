
import mongoose from "mongoose"; // Allow import without specific file extension
import dotenv from "dotenv";
dotenv.config({ path: ".env" });

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/medicore";

async function check() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to DB");

        const collection = mongoose.connection.collection("invoices");
        const count = await collection.countDocuments({});
        console.log("Total Invoices in DB:", count);

        const drafts = await collection.countDocuments({ status: "draft" });
        console.log("Draft Invoices:", drafts);

        const all = await collection.find({}).toArray();
        console.log("First Invoice:", all[0] || "None");

    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
    }
}

check();
