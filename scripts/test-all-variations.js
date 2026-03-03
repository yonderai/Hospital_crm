const mongoose = require('mongoose');

const username = "yuvrajsingh02608_db_user";
const passwords = ["yuvraj singh 121", "yuvraj%20singh%20121", "yuvrajsingh121", "yuvrajsingh02608_db_user"];
const clusters = ["yuvrajsingh02608_db_user.b6dwyv5.mongodb.net", "yuvrajsingh02608_db_user.b6dwyv5.mongodb.net"];

async function testConnection(pwm, cluster) {
    const uri = `mongodb+srv://${username}:${pwm}@${cluster}/yonder_medicare?retryWrites=true&w=majority`;
    console.log(`Testing: mongodb+srv://${username}:****@${cluster}/...`);
    try {
        await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
        console.log(`✅ SUCCESS with cluster ${cluster} and password variation!`);
        console.log(`URI: ${uri}`);
        const fs = require('fs');
        fs.writeFileSync('success_uri.txt', uri);
        await mongoose.disconnect();
        return true;
    } catch (err) {
        console.log(`❌ FAILED: ${err.message}`);
        return false;
    }
}

async function runTests() {
    for (const cluster of clusters) {
        for (const pw of passwords) {
            const success = await testConnection(pw, cluster);
            if (success) {
                console.log("\n--- FOUND VALID CONNECTION ---");
                return;
            }
        }
    }
    console.log("\nAll combinations failed.");
}

runTests();
