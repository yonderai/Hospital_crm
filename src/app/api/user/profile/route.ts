import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import User from "@/lib/models/User";
import Patient from "@/lib/models/Patient";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user || !session.user.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        const userRole = session.user.role;
        const userEmail = session.user.email;

        let profileData = null;

        if (userRole === "patient") {
            const patient = await Patient.findOne({ "contact.email": userEmail }).lean();
            if (patient) {
                profileData = {
                    name: `${patient.firstName} ${patient.lastName}`,
                    firstName: patient.firstName,
                    lastName: patient.lastName,
                    email: userEmail,
                    role: "patient",
                    details: {
                        mrn: patient.mrn,
                        dob: patient.dob,
                        age: (() => {
                            if (!patient.dob) return null;
                            const today = new Date();
                            const birthDate = new Date(patient.dob);
                            const diffDays = Math.floor((today.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24));

                            if (diffDays < 30) return `${diffDays} Day${diffDays === 1 ? '' : 's'}`;

                            const diffMonths = Math.floor(diffDays / 30.4375); // Avg month length
                            if (diffMonths < 12) return `${diffMonths} Month${diffMonths === 1 ? '' : 's'}`;

                            const diffYears = Math.floor(diffDays / 365.25);
                            return `${diffYears} Year${diffYears === 1 ? '' : 's'}`;
                        })(),
                        rawAge: patient.age,
                        gender: patient.gender,
                        phone: patient.contact?.phone,
                        bloodType: patient.bloodType,
                        address: patient.contact?.address,
                        emergencyContact: patient.emergencyContact,
                        insurance: patient.insuranceInfo?.hasInsurance ? {
                            provider: patient.insuranceInfo.provider,
                            policyNumber: patient.insuranceInfo.policyNumber,
                            validUntil: patient.insuranceInfo.validUntil
                        } : null
                    },
                    createdAt: patient.createdAt
                };
            }
        } else {
            const staff = await User.findOne({ email: userEmail }).lean();
            if (staff) {
                profileData = {
                    name: `${staff.firstName} ${staff.lastName}`,
                    firstName: staff.firstName,
                    lastName: staff.lastName,
                    email: userEmail,
                    role: staff.role,
                    details: {
                        employeeId: staff.employeeId,
                        mobile: staff.mobile,
                        specialization: staff.specialization,
                        department: staff.department,
                        joiningDate: staff.joiningDate,
                        shift: staff.shift,
                        workingHours: staff.workingHours,
                        credentials: staff.credentials
                    },
                    createdAt: staff.createdAt
                };
            }
        }

        if (!profileData) {
            return NextResponse.json({ error: "Profile not found" }, { status: 404 });
        }

        return NextResponse.json(profileData);

    } catch (error) {
        console.error("Profile Fetch Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user || !session.user.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const data = await request.json();
        const userRole = session.user.role;
        const userEmail = session.user.email;

        if (userRole === "patient") {
            const updateData: any = {};
            if (data.firstName) updateData.firstName = data.firstName;
            if (data.lastName) updateData.lastName = data.lastName;
            if (data.dob) updateData.dob = new Date(data.dob);
            if (data.gender) updateData.gender = data.gender;
            if (data.bloodType) updateData.bloodType = data.bloodType;
            if (data.phone) updateData["contact.phone"] = data.phone;

            if (data.address) {
                if (data.address.street) updateData["contact.address.street"] = data.address.street;
                if (data.address.city) updateData["contact.address.city"] = data.address.city;
                if (data.address.state) updateData["contact.address.state"] = data.address.state;
                if (data.address.zipCode) updateData["contact.address.zipCode"] = data.address.zipCode;
            }

            const patient = await Patient.findOneAndUpdate(
                { "contact.email": userEmail },
                { $set: updateData },
                { new: true, runValidators: true }
            );

            if (!patient) return NextResponse.json({ error: "Patient record not found" }, { status: 404 });
            return NextResponse.json({ success: true, message: "Profile updated successfully" });

        } else {
            const updateData: any = {};
            if (data.firstName) updateData.firstName = data.firstName;
            if (data.lastName) updateData.lastName = data.lastName;
            if (data.mobile) updateData.mobile = data.mobile;
            if (data.specialization) updateData.specialization = data.specialization;
            if (data.department) updateData.department = data.department;

            const staff = await User.findOneAndUpdate(
                { email: userEmail },
                { $set: updateData },
                { new: true, runValidators: true }
            );

            if (!staff) return NextResponse.json({ error: "Staff record not found" }, { status: 404 });
            return NextResponse.json({ success: true, message: "Profile updated successfully" });
        }

    } catch (error: any) {
        console.error("Profile Update Error:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
