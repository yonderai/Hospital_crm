import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import DispenseLog from "@/lib/models/DispenseLog";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !["pharmacist", "pharmacy", "admin", "doctor"].includes(session.user?.role as string)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        // Fetch logs (covering both Rx and Manual sales)
        const logs = await DispenseLog.find()
            .populate("patientId", "firstName lastName mrn")
            .populate("providerId", "firstName lastName")
            .sort({ dispensedAt: -1 })
            .limit(50);

        // Map to format expected by Frontend "DispensedMedicine" interface
        // interface DispensedMedicine {
        //     _id: string;
        //     patientId: { firstName: string, lastName: string, mrn: string };
        //     providerId: { firstName: string, lastName: string };
        //     medications: { drugName: string, quantity: number, unitPrice?: number }[];
        //     status: string;
        //     updatedAt: string;
        // }

        const history = logs.map(log => ({
            _id: log._id,
            patientId: log.patientId || { firstName: "Walk-in", lastName: "Customer", mrn: "N/A" },
            customerDetails: log.customerDetails,
            providerId: log.providerId || { firstName: "Unknown", lastName: "Pharmacist" },
            medications: log.items.map((i: any) => ({
                drugName: i.drugName,
                quantity: i.quantity,
                unitPrice: i.unitPrice
            })),
            status: "dispensed",
            paymentMode: log.paymentMode,
            updatedAt: log.dispensedAt
        }));

        return NextResponse.json(history);

    } catch (error) {
        console.error("Error fetching pharmacy history:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
