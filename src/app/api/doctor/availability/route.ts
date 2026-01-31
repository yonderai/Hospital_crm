
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Appointment from "@/lib/models/Appointment";
import User from "@/lib/models/User";

export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== 'doctor') {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const dateParam = searchParams.get("date");
        const date = dateParam ? new Date(dateParam) : new Date();

        // Set range for the entire day (00:00:00 to 23:59:59 UTC)
        const startOfDay = new Date(date);
        startOfDay.setUTCHours(0, 0, 0, 0);

        const endOfDay = new Date(date);
        endOfDay.setUTCHours(23, 59, 59, 999);

        await dbConnect();

        const doctorId = (session.user as any).id;
        const doctor = await User.findById(doctorId);

        if (!doctor) {
            return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
        }

        // Get working hours or default
        const workStart = doctor.workingHours?.start || "09:00";
        const workEnd = doctor.workingHours?.end || "17:00";

        // Fetch appointments for the day
        const appointments = await Appointment.find({
            providerId: doctorId,
            startTime: { $gte: startOfDay, $lte: endOfDay },
            status: { $nin: ["cancelled", "no-show"] } // Exclude cancelled appointments
        });

        // Generate Time Slots
        const slots = [];
        let bookedCount = 0;
        let freeCount = 0;

        // Parse start/end times
        const [startHour, startMin] = workStart.split(':').map(Number);
        const [endHour, endMin] = workEnd.split(':').map(Number);

        let currentSlot = new Date(startOfDay);
        currentSlot.setHours(startHour, startMin, 0, 0);

        const endTime = new Date(startOfDay);
        endTime.setHours(endHour, endMin, 0, 0);

        // Simple 60-minute slots logic
        while (currentSlot < endTime) {
            const slotStart = new Date(currentSlot);
            const slotEnd = new Date(currentSlot);
            slotEnd.setMinutes(slotEnd.getMinutes() + 60);

            // Check if slot overlaps with any appointment
            // Overlap logic: (SlotStart < ApptEnd) && (SlotEnd > ApptStart)
            const isBooked = appointments.some(appt => {
                const apptStart = new Date(appt.startTime);
                const apptEnd = new Date(appt.endTime);
                return slotStart < apptEnd && slotEnd > apptStart;
            });

            const status = isBooked ? "booked" : "free";
            if (isBooked) bookedCount++;
            else freeCount++;

            slots.push({
                time: slotStart.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }),
                status: status
            });

            // Move to next slot
            currentSlot.setMinutes(currentSlot.getMinutes() + 60);
        }

        const totalHours = slots.length;

        return NextResponse.json({
            date: date.toISOString().split('T')[0],
            workingHours: `${workStart} - ${workEnd}`,
            totalHours,
            bookedSlots: bookedCount,
            freeSlots: freeCount,
            slots
        });

    } catch (error) {
        console.error("Error fetching availability:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
