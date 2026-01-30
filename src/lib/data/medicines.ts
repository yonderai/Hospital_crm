export interface Medicine {
    id: string;
    name: string;
    strength: string;
    form: "Tablet" | "Capsule" | "Syrup" | "Injection" | "Cream" | "Drops" | "Inhaler";
}

export const medicines: Medicine[] = [
    { id: "1", name: "Amoxicillin", strength: "500mg", form: "Capsule" },
    { id: "2", name: "Amoxicillin", strength: "250mg", form: "Capsule" },
    { id: "3", name: "Azithromycin", strength: "500mg", form: "Tablet" },
    { id: "4", name: "Paracetamol", strength: "500mg", form: "Tablet" },
    { id: "5", name: "Paracetamol", strength: "650mg", form: "Tablet" },
    { id: "6", name: "Metformin", strength: "500mg", form: "Tablet" },
    { id: "7", name: "Metformin", strength: "1000mg", form: "Tablet" },
    { id: "8", name: "Ibuprofen", strength: "400mg", form: "Tablet" },
    { id: "9", name: "Ibuprofen", strength: "200mg", form: "Syrup" },
    { id: "10", name: "Omeprazole", strength: "20mg", form: "Capsule" },
    { id: "11", name: "Pantoprazole", strength: "40mg", form: "Tablet" },
    { id: "12", name: "Atorvastatin", strength: "10mg", form: "Tablet" },
    { id: "13", name: "Atorvastatin", strength: "20mg", form: "Tablet" },
    { id: "14", name: "Amlodipine", strength: "5mg", form: "Tablet" },
    { id: "15", name: "Losartan", strength: "50mg", form: "Tablet" },
    { id: "16", name: "Cetirizine", strength: "10mg", form: "Tablet" },
    { id: "17", name: "Levocetirizine", strength: "5mg", form: "Tablet" },
    { id: "18", name: "Montelukast", strength: "10mg", form: "Tablet" },
    { id: "19", name: "Ambroxol", strength: "30mg/5ml", form: "Syrup" },
    { id: "20", name: "Dextromethorphan", strength: "10mg/5ml", form: "Syrup" },
    { id: "21", name: "Insulin Glargine", strength: "100IU/ml", form: "Injection" },
    { id: "22", name: "Insulin Lispro", strength: "100IU/ml", form: "Injection" },
    { id: "23", name: "Diclofenac", strength: "75mg/3ml", form: "Injection" },
    { id: "24", name: "Ceftriaxone", strength: "1g", form: "Injection" },
    { id: "25", name: "Ondansetron", strength: "4mg", form: "Tablet" },
    { id: "26", name: "Ondansetron", strength: "2mg/ml", form: "Injection" },
    { id: "27", name: "Ranitidine", strength: "150mg", form: "Tablet" },
    { id: "28", name: "Aspirin", strength: "75mg", form: "Tablet" },
    { id: "29", name: "Clopidogrel", strength: "75mg", form: "Tablet" },
    { id: "30", name: "Thyroxine", strength: "50mcg", form: "Tablet" }
];
