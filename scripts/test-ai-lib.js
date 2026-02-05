const fetch = require('node-fetch');

async function getAiInsight(symptoms, history = "None", medications = "None") {
    const ports = [5001, 5005];
    const hosts = ["127.0.0.1", "localhost"];

    for (const port of ports) {
        for (const host of hosts) {
            try {
                console.log(`[TEST] Checking http://${host}:${port}...`);
                const response = await fetch(`http://${host}:${port}/api/clinical-insight`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ symptoms, history, medications }),
                    timeout: 5000
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log(`[TEST] Success on http://${host}:${port}`);
                    return data.insight;
                } else {
                    console.log(`[TEST] Port ${port} Host ${host} Error: ${response.status}`);
                }
            } catch (error) {
                console.log(`[TEST] Port ${port} Host ${host} failed: ${error.message}`);
            }
        }
    }
    return null;
}

getAiInsight("Headache", "None", "None").then(res => {
    console.log("Result:", res ? "SUCCESS" : "FAILED");
    if (res) console.log("Insight Length:", res.length);
});
