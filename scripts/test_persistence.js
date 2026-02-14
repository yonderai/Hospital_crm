
const mongoose = require('mongoose');
const fs = require('fs');

const envPath = './.env';
const envContent = fs.readFileSync(envPath, 'utf8');
const MONGODB_URI = envContent.split('\n')
    .find(line => line.startsWith('MONGODB_URI='))
    .split('=')[1]
    .trim()
    .replace(/^["'](.+)["']$/, '$1');

async function testPersistence() {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    // We'll define it EXACTLY as the app does now
    const Schema = mongoose.Schema;
    const LocationSchema = {
        zone: { type: String, required: true },
        block: { type: String, required: true },
        shelf: { type: String, required: true },
        drawer: { type: String },
    };

    const InventorySchema = new Schema({
        sku: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        location: LocationSchema
    }, { strict: true });

    if (mongoose.models.InventoryItem) delete mongoose.models.InventoryItem;
    const InventoryItem = mongoose.model('InventoryItem', InventorySchema);

    const testSku = "SYNC-TEST-" + Date.now();
    console.log(`Creating test item: ${testSku}`);

    try {
        const item = await InventoryItem.create({
            sku: testSku,
            name: "Sync Verification Item",
            location: {
                zone: "Tablet",
                block: "B-TEST",
                shelf: "S-TEST"
            }
        });

        console.log("Created Item Location:", item.location);

        const fetched = await InventoryItem.findById(item._id);
        console.log("Fetched Item Location:", fetched.location);

        if (fetched.location.block === "B-TEST") {
            console.log("SUCCESS: Block persisted correctly.");
        } else {
            console.error("FAILURE: Block missing in DB.");
        }

        await InventoryItem.deleteOne({ _id: item._id });
        console.log("Cleanup done.");
    } catch (err) {
        console.error("Test failed:", err.message);
    }

    await mongoose.disconnect();
}

testPersistence().catch(console.error);
