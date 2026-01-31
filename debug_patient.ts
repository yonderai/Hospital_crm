import dbConnect from "./src/lib/db";
import Patient from "./src/lib/models/Patient";

async function debug() {
    await dbConnect();
    const patient = await Patient.findOne({ "contact.email": "shruti@example.com" });
    if (patient) {
        console.log("Patient Found:", patient.firstName, patient.lastName);
        console.log("DOB:", patient.dob);
        console.log("Age (stored):", patient.age);
    } else {
        console.log("Patient not found");
    }
}

debug().then(() => process.exit(0)).catch(err => {
    console.error(err);
    process.exit(1);
});
