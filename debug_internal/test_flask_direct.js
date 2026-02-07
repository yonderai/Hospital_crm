async function testBooking() {
    console.log("Checking Flask Server (Native Fetch)...");
    try {
        const res = await fetch("http://127.0.0.1:5001/api/clinical-insight", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                symptoms: "TEST SYMPTOM: Severe Headaches",
                history: "None",
                medications: "None"
            })
        });

        console.log("Flavor Status:", res.status);
        if (res.ok) {
            const data = await res.json();
            console.log("Flask Response Success:", data.model_used);
        } else {
            const text = await res.text();
            console.log("Flask Response Error:", text);
        }
    } catch (e) {
        console.error("Flask Connection Failed:", e.message);
        console.error("Ensure backend is running on port 5001");
    }
}

testBooking();
