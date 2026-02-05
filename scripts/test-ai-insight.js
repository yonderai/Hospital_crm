const fetch = require('node-fetch');

async function testAi() {
    console.log("Testing AI Clinical Insight Endpoint...");
    try {
        const res = await fetch("http://127.0.0.1:5001/api/clinical-insight", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                symptoms: "Severe headache and sensitivity to light",
                history: "Family history of migraines",
                medications: "Paracetamol occasionally"
            })
        });

        const data = await res.json();
        if (res.ok) {
            console.log("✅ Success! AI Insight:");
            console.log(data.insight);
        } else {
            console.error("❌ Failed:", data.error);
        }
    } catch (err) {
        console.error("❌ Error connecting to Flask:", err.message);
    }
}

testAi();
