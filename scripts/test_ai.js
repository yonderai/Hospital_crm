
async function testAI() {
    console.log("Testing AI Insight Endpoint...");
    const url = 'http://127.0.0.1:5001/api/clinical-insight';
    const payload = {
        symptoms: "Severe headache and sensitivity to light",
        history: "Patient complains of throbbing headache on the left side, worse with movement. Nausea present."
    };

    try {
        const start = Date.now();
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        console.log(`Status: ${response.status} ${response.statusText}`);
        const text = await response.text();
        console.log(`Response Time: ${Date.now() - start}ms`);
        console.log("Response Body:", text);

    } catch (error) {
        console.error("Fetch Error:", error);
    }
}

testAI();
