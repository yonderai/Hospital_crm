const mongoose = require('mongoose');

const MONGODB_URI = "mongodb+srv://yuvrajsingh02608_db_user:yuvrajsingh@yondermedicareai.b6dwyv5.mongodb.net/yonder_medicare?retryWrites=true&w=majority";

async function seedInventory() {
    try {
        await mongoose.connect(MONGODB_URI);
        const InventoryItem = mongoose.models.InventoryItem || mongoose.model('InventoryItem', new mongoose.Schema({
            sku: String,
            name: String,
            category: String,
            unit: String,
            quantityOnHand: Number,
            reorderLevel: Number,
            unitCost: Number,
            sellingPrice: Number,
            expiryDate: Date,
            lotNumber: String
        }, { strict: false }));

        const items = [
            { sku: 'MED001', name: 'Paracetamol 500mg', category: 'medication', unit: 'tablet', quantityOnHand: 500, reorderLevel: 100, unitCost: 1, sellingPrice: 5, expiryDate: new Date('2026-12-31'), lotNumber: 'BATCH-A1' },
            { sku: 'MED002', name: 'Amoxicillin 250mg', category: 'medication', unit: 'capsule', quantityOnHand: 200, reorderLevel: 50, unitCost: 5, sellingPrice: 15, expiryDate: new Date('2026-06-30'), lotNumber: 'BATCH-B2' },
            { sku: 'MED003', name: 'Ibuprofen 400mg', category: 'medication', unit: 'tablet', quantityOnHand: 300, reorderLevel: 80, unitCost: 2, sellingPrice: 8, expiryDate: new Date('2027-01-15'), lotNumber: 'BATCH-C3' },
            { sku: 'MED004', name: 'Metformin 500mg', category: 'medication', unit: 'tablet', quantityOnHand: 50, reorderLevel: 60, unitCost: 3, sellingPrice: 10, expiryDate: new Date('2025-12-01'), lotNumber: 'BATCH-D4' }, // Low stock
            { sku: 'MED005', name: 'Atorvastatin 10mg', category: 'medication', unit: 'tablet', quantityOnHand: 1000, reorderLevel: 200, unitCost: 10, sellingPrice: 30, expiryDate: new Date('2026-02-20'), lotNumber: 'BATCH-E5' },
            { sku: 'MED006', name: 'Cemol', category: 'medication', unit: 'syrup', quantityOnHand: 20, reorderLevel: 15, unitCost: 15, sellingPrice: 40, expiryDate: new Date('2026-03-10'), lotNumber: 'BATCH-F6' },
        ];

        console.log('Seeding Inventory...');
        for (const item of items) {
            await InventoryItem.updateOne(
                { sku: item.sku },
                { $set: item },
                { upsert: true }
            );
        }
        console.log('Inventory Seeded!');

    } catch (e) { console.error(e); }
    finally { await mongoose.disconnect(); }
}

seedInventory();
