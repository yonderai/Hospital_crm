
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from '@/lib/db';
import Appointment from "@/lib/models/Appointment";
import User from "@/lib/models/User";
import Patient from "@/lib/models/Patient";
import { startOfDay, endOfDay, startOfWeek, endOfWeek, addDays, format, parseISO } from "date-fns";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const { searchParams } = new URL(req.url);
        const dateParam = searchParams.get("date"); // ISO Date String "YYYY-MM-DD"
        const view = searchParams.get("view") || "day"; // "day" | "week"
        const department = searchParams.get("department");

        const targetDate = dateParam ? parseISO(dateParam) : new Date();

        // 1. Fetch Doctors
        const doctorQuery: any = { role: "doctor", isActive: true };
        if (department && department !== "All") {
            doctorQuery.department = department; // Ensure User model has 'department'
        }
        const doctors = await User.find(doctorQuery).select("firstName lastName department specialities");

        // 2. Prepare Time Range based on View
        let rangeStart, rangeEnd;

        if (view === "week") {
            rangeStart = startOfWeek(targetDate, { weekStartsOn: 1 }); // Monday start
            rangeEnd = endOfWeek(targetDate, { weekStartsOn: 1 });
        } else {
            rangeStart = startOfDay(targetDate);
            rangeEnd = endOfDay(targetDate);
        }

        // 3. Fetch Appointments in Range
        const appointments = await Appointment.find({
            providerId: { $in: doctors.map(d => d._id) },
            startTime: { $gte: rangeStart, $lte: rangeEnd },
            status: { $nin: ["cancelled", "no-show"] }
        }).populate("patientId", "firstName lastName");

        // 4. Transform Data
        const scheduleData = doctors.map(doctor => {
            const docName = `${doctor.firstName} ${doctor.lastName}`;
            const doctorAppointments = appointments.filter(apt => apt.providerId.toString() === doctor._id.toString());

            if (view === "week") {
                // Week View Aggregation
                const weekStats = [];
                let currentDay = rangeStart;
                for (let i = 0; i < 7; i++) {
                    const dayStart = startOfDay(currentDay);
                    const dayEnd = endOfDay(currentDay);

                    const dailyApps = doctorAppointments.filter(apt =>
                        new Date(apt.startTime) >= dayStart && new Date(apt.startTime) <= dayEnd
                    );

                    // Simple logic: total slots = 16 (8 hours * 2 slots/hr)
                    const totalSlots = 16;
                    const bookedSlots = dailyApps.length;

                    weekStats.push({
                        date: format(currentDay, "yyyy-MM-dd"),
                        dayName: format(currentDay, "EEE"), // Mon, Tue...
                        booked: bookedSlots,
                        total: totalSlots,
                        status: bookedSlots >= totalSlots ? "Full" : "Available"
                    });

                    currentDay = addDays(currentDay, 1);
                }

                return {
                    doctor: {
                        id: doctor._id,
                        name: docName,
                        department: doctor.department || "General",
                    },
                    weekStats
                };
            } else {
                // Day View Slots
                // Generate slots from 09:00 to 17:00
                const slots = [];
                const startHour = 9;
                const endHour = 17;

                for (let h = startHour; h < endHour; h++) {
                    for (let m of [0, 30]) {
                        const slotTimeStr = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
                        const slotDate = new Date(targetDate);
                        slotDate.setHours(h, m, 0, 0);

                        // Find booking for this slot
                        const booking = doctorAppointments.find(apt =>
                            new Date(apt.startTime).getTime() === slotDate.getTime()
                        );

                        slots.push({
                            time: format(slotDate, "hh:mm a"),
                            status: booking ? "booked" : "available",
                            patient: booking ? booking.patientId?.firstName + " " + booking.patientId?.lastName : null,
                            appointmentId: booking?.appointmentId
                        });
                    }
                }

                return {
                    doctor: {
                        id: doctor._id,
                        name: docName,
                        department: doctor.department || "General",
                    },
                    slots,
                    summary: {
                        available: slots.filter(s => s.status === "available").length,
                        booked: slots.filter(s => s.status === "booked").length
                    }
                };
            }
        });

        return NextResponse.json({
            date: format(targetDate, "yyyy-MM-dd"),
            view,
            schedule: scheduleData
        });

    } catch (error: any) {
        console.error("Schedule API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
