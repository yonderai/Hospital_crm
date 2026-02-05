export async function getAiInsight(symptoms: string, history: string = "None", medications: string = "None") {
    const ports = [5001, 5005];
    const hosts = ["127.0.0.1", "localhost"];

    for (const port of ports) {
        for (const host of hosts) {
            try {
                // console.log(`[AI] Checking http://${host}:${port}...`);
                const response = await fetch(`http://${host}:${port}/api/clinical-insight`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ symptoms, history, medications }),
                    // signal: AbortSignal.timeout(10000)
                });

                if (response.ok) {
                    const data = await response.json();
                    return data.insight;
                }
            } catch (error: any) {
                // Silently try next
            }
        }
    }

    console.error("[AI] AI Service completely unavailable on all ports/hosts.");
    return null;
}
