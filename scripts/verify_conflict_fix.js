
const mongoose = require('mongoose');
const fs = require('fs');

const envPath = '/Users/yuvrajsingh/medical/Hospital_crm/.env';
const envContent = fs.readFileSync(envPath, 'utf8');
const MONGODB_URI = envContent.split('\n')
    .find(line => line.startsWith('MONGODB_URI='))
    .split('=')[1]
    .trim()
    .replace(/^["'](.+)["']$/, '$1');

async function verifyFix() {
    await mongoose.connect(MONGODB_URI);
    const InventoryItem = mongoose.models.InventoryItem || mongoose.model('InventoryItem', new mongoose.Schema({}, { strict: false }));

    // Test data
    const location = { zone: 'Tablet', block: 'B-1', shelf: 'S-4', drawer: '' };

    console.log("Searching for conflict at normalized B-1, S-4...");
    const existing = await InventoryItem.findOne({
        "location.zone": "Tablet",
        "location.block": "B-1",
        "location.shelf": "S-4",
        "location.drawer": ""
    });

    if (existing) {
        console.log(`Found existing item: ${existing.name}. Conflict check will work.`);
    } else {
        console.error("No item found at B-1, S-4. Normalization might have failed.");
    }

    await mongoose.disconnect();
}

verifyFix().catch(console.error);
