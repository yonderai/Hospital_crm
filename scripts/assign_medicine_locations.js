
const mongoose = require('mongoose');
const fs = require('fs');

const envPath = '/Users/yuvrajsingh/medical/Hospital_crm/.env';
const envContent = fs.readFileSync(envPath, 'utf8');
const MONGODB_URI = envContent.split('\n')
    .find(line => line.startsWith('MONGODB_URI='))
    .split('=')[1]
    .trim()
    .replace(/^["'](.+)["']$/, '$1');

async function assignLocations() {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    const InventoryItem = mongoose.models.InventoryItem || mongoose.model('InventoryItem', new mongoose.Schema({}, { strict: false }));

    const assignments = [
        { sku: 'MED001', name: 'Amoxicillin', zone: 'Tablet', block: 'T1', shelf: 'S1' },
        { sku: 'MED002', name: 'Paracetamol', zone: 'Tablet', block: 'T1', shelf: 'S2' },
        { sku: 'SUP001', name: 'Surgical Mask', zone: 'Surgical', block: 'M1', shelf: 'S1' },
        { sku: 'SUP002', name: 'Exam Gloves', zone: 'Surgical', block: 'G1', shelf: 'S1' },
        { sku: 'SYP001', name: 'Cough Syrup', zone: 'Syrup', block: 'SY1', shelf: 'S1' },
        { sku: 'INJ001', name: 'Insulin', zone: 'Injection', block: 'IJ1', shelf: 'S1' }
    ];

    for (const item of assignments) {
        const result = await InventoryItem.updateOne(
            { sku: item.sku },
            {
                $set: {
                    "location.zone": item.zone,
                    "location.block": item.block,
                    "location.shelf": item.shelf
                }
            }
        );
        if (result.modifiedCount > 0) {
            console.log(`Updated ${item.name} (${item.sku}) -> ${item.zone} Block ${item.block}`);
        } else {
            console.log(`No changes for ${item.name} (${item.sku}) - item might not exist or already updated.`);
        }
    }

    // Assign generic locations to any remaining items without a block
    const remaining = await InventoryItem.updateMany(
        { "location.block": { $exists: false } },
        {
            $set: {
                "location.zone": "Others",
                "location.block": "Z9",
                "location.shelf": "S9"
            }
        }
    );
    console.log(`Assigned generic locations to ${remaining.modifiedCount} other items.`);

    await mongoose.disconnect();
}

assignLocations().catch(console.error);
