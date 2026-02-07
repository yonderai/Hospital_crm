
const aiOutput = `"🧠 AI Clinical Insights (auto-generated) ---------------------------------------------------
------ • Reported symptoms: Severe migraine, nausea • Relevant history: Not available • Past medications: Not available • Possible conditions (non-diagnostic): – Migraine disorder – Medication overuse headache • Suggested next checks: – Neurological examination – Headache diary to track frequency and severity • Risk flags: – Potential for medication overuse or rebound headache"`;

// Current Logic
const currentRegex = /\s*([•\-–])\s*/g;
const processed = aiOutput.replace(currentRegex, '\n$1 ').split('\n');

console.log("--- PROCESSED LINES (Current) ---");
processed.forEach((line, i) => {
    const cleanLine = line.trim();
    if (!cleanLine || cleanLine.includes('---') || cleanLine.includes('AI Clinical Insights')) return;
    console.log(`[${i}] ${cleanLine}`);
});

// Proposed Logic
// Goal: 
// 1. Remove the "🧠 AI Clinical Insights..." header block entirely.
// 2. Treat "•" as a major separator (New Line).
// 3. Treat "–" (en-dash) or "-" as sub-separators (New Line).
// 4. Handle multiple dashes "------" gracefully.

const proposedRegex = /([•\-–])/g;
// Let's try to just insert newline before any bullet-like char that has text after it?
// Or just clean up the "------" first.

let betterOutput = aiOutput
    // Remove the known header line
    .replace(/["']?🧠 AI Clinical Insights.*?-{3,}/s, '')
    // Remove "------" garbage
    .replace(/-{2,}/g, '')
    // Force newline before bullets
    .replace(/([•*–-])/g, '\n$1')

console.log("\n--- PROCESSED LINES (Proposed) ---");
betterOutput.split('\n').map(line => line.trim()).filter(l => l).forEach(l => console.log(l));
