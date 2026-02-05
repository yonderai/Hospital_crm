async function testAi() {
    const ports = [5001, 5005];
    const hosts = ["127.0.0.1", "localhost"];

    for (const port of ports) {
        for (const host of hosts) {
            try {
                console.log(`[AI-TEST] Checking http://${host}:${port}...`);
                const response = await fetch(`http://${host}:${port}/api/clinical-insight`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        symptoms: "Fatigue and dizziness",
                        history: "Hypotension",
                        medications: "None"
                    })
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log(`[AI-TEST] Success on http://${host}:${port}`);
                    console.log("Insight:", data.insight.substring(0, 100) + "...");
                    return;
                } else {
                    console.log(`[AI-TEST] Port ${port} Host ${host} Error: ${response.status}`);
                    console.log("Body:", await response.text());
                }
            } catch (error) {
                console.log(`[AI-TEST] Port ${port} Host ${host} failed: ${error.message}`);
            }
        }
    }
}

testAi();
