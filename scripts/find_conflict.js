
const mongoose = require('mongoose');
const fs = require('fs');

const envPath = './.env';
const envContent = fs.readFileSync(envPath, 'utf8');
const MONGODB_URI = envContent.split('\n')
    .find(line => line.startsWith('MONGODB_URI='))
    .split('=')[1]
    .trim()
    .replace(/^["'](.+)["']$/, '$1');

async function findConflict() {
    await mongoose.connect(MONGODB_URI);
    const InventoryItem = mongoose.models.InventoryItem || mongoose.model('InventoryItem', new mongoose.Schema({}, { strict: false }));

    const items = await InventoryItem.find({
        "location.zone": "Tablet",
        "location.block": { $regex: /^b-1$/i },
        "location.shelf": { $regex: /^s-4$/i }
    });

    console.log(`Found ${items.length} items at Block B-1, Shelf S-4:`);
    items.forEach(item => {
        console.log(`- ${item.name} (${item.sku}):`, JSON.stringify(item.location));
    });

    await mongoose.disconnect();
}

findConflict().catch(console.error);
