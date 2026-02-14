
const mongoose = require('mongoose');
const fs = require('fs');

const envPath = './.env';
const envContent = fs.readFileSync(envPath, 'utf8');
const MONGODB_URI = envContent.split('\n')
    .find(line => line.startsWith('MONGODB_URI='))
    .split('=')[1]
    .trim()
    .replace(/^["'](.+)["']$/, '$1');

async function normalizeAll() {
    await mongoose.connect(MONGODB_URI);
    const InventoryItem = mongoose.models.InventoryItem || mongoose.model('InventoryItem', new mongoose.Schema({}, { strict: false }));

    const items = await InventoryItem.find({});
    console.log(`Found ${items.length} items to normalize.`);

    for (const item of items) {
        if (item.location) {
            const normalized = {
                zone: item.location.zone,
                block: (item.location.block || "").trim().toUpperCase(),
                shelf: (item.location.shelf || "").trim().toUpperCase(),
                drawer: (item.location.drawer || "").trim().toUpperCase()
            };

            await InventoryItem.updateOne(
                { _id: item._id },
                { $set: { location: normalized } }
            );
        }
    }

    console.log("Normalization complete.");
    await mongoose.disconnect();
}

normalizeAll().catch(console.error);
