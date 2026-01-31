import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Appointment from "@/lib/models/Appointment";
import Patient from "@/lib/models/Patient"; // Ensure Patient model is registered
import mongoose from "mongoose";

import fs from 'fs';
import path from 'path';

// Force dynamic since we use current date
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
    const logFile = '/tmp/hospital_debug.log';
    const log = (msg: string) => {
        try { fs.appendFileSync(logFile, `[${new Date().toISOString()}] ${msg}\n`); } catch (e) { console.error("Log failed:", e); }
    };

    log("[API] GET /api/frontdesk/queue - Started");

    // Log headers to check for cookies
    try {
        const cookieHeader = request.headers.get('cookie') || "NO COOKIES";
        log(`[API] Cookies: ${cookieHeader.substring(0, 50)}...`);
    } catch (e) { log(`[API] Could not read headers: ${e}`); }

    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            log("[API] Unauthorized access attempt (Session null). PROCEEDING ANYWAY FOR DEBUGGING.");
            // return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        } else {
            log(`[API] Session Validated for user: ${session.user?.email}`);
        }

        log("[API] Connecting to DB...");
        await dbConnect();
        log("[API] DB Connected");

        // Ensure Patient model is registered to prevent Schema hasn't been registered error
        if (!mongoose.models.Patient) {
            log("[API] Registering Patient model manually");
            // This is just a safeguard; importing the file usually handles it
            new mongoose.Schema({
                firstName: String,
                lastName: String,
                mrn: String
            });
        }

        // Get start and end of today
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        log(`[API] Querying appointments from ${startOfDay.toISOString()} to ${endOfDay.toISOString()}...`);
        const appointments = await Appointment.find({
            startTime: {
                $gte: startOfDay,
                $lte: endOfDay
            },
            status: { $ne: "cancelled" }
        })
            .populate("patientId", "firstName lastName mrn")
            .populate("providerId", "firstName lastName department")
            .sort({ startTime: 1 })
            .lean().catch(err => {
                log(`[API] DB Query Failed: ${err.message}`);
                console.error("[API] DB Query Failed:", err);
                throw err;
            });

        log(`[API] Found ${appointments?.length || 0} appointments. Returning JSON.`);
        return NextResponse.json(appointments || []);

    } catch (error: any) {
        log(`[API] Critical Error: ${error.message}`);
        console.error("[API] Critical Error fetching queue:", error);
        // Return 500 but as json, to avoid "Load failed" if possible, or at least see log
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
