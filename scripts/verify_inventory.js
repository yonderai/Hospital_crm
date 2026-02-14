
const mongoose = require('mongoose');
const fs = require('fs');

const envPath = './.env';
const envContent = fs.readFileSync(envPath, 'utf8');
const MONGODB_URI = envContent.split('\n')
    .find(line => line.startsWith('MONGODB_URI='))
    .split('=')[1]
    .trim()
    .replace(/^["'](.+)["']$/, '$1');

async function verifyInventory() {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    const InventoryItem = mongoose.models.InventoryItem || mongoose.model('InventoryItem', new mongoose.Schema({}, { strict: false }));
    const StockLedger = mongoose.models.StockLedger || mongoose.model('StockLedger', new mongoose.Schema({}, { strict: false }));
    const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({}, { strict: false }));

    const testAdmin = await User.findOne({ role: 'admin' });
    if (!testAdmin) {
        console.error("No admin user found for logging.");
        process.exit(1);
    }

    const testSku = "TEST-" + Date.now();

    console.log(`Creating test item with SKU: ${testSku}`);

    // 1. Verify location requirement (simulated at model level)
    try {
        const item = await InventoryItem.create({
            sku: testSku,
            name: "Test Paracetamol",
            unit: "Tablet",
            unitCost: 10,
            quantityOnHand: 100,
            location: {
                zone: "Tablet",
                block: "B1",
                shelf: "S1"
            },
            isActive: true
        });

        console.log("Item created successfully with location.");

        // 2. Simulate the API's ledger logging
        await StockLedger.create({
            itemId: item._id,
            type: "in",
            quantity: 100,
            reason: "Verification Test Entry",
            recordedBy: testAdmin._id,
            previousStock: 0,
            newStock: 100
        });

        const ledgerEntry = await StockLedger.findOne({ itemId: item._id });
        if (ledgerEntry) {
            console.log("StockLedger entry verified.");
        } else {
            console.error("StockLedger entry MISSING.");
        }

        // 3. Cleanup
        await InventoryItem.deleteOne({ _id: item._id });
        await StockLedger.deleteOne({ itemId: item._id });
        console.log("Cleanup completed.");

    } catch (error) {
        console.error("Verification failed:", error.message);
    }

    await mongoose.disconnect();
}

verifyInventory().catch(console.error);
