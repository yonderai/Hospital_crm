import Patient from '../models/Patient.js';
import Appointment from '../models/Appointment.js';
import LabReport from '../models/LabReport.js';
import Prescription from '../models/Prescription.js';
import Billing from '../models/Billing.js';

// Middleware or helper to find patient by user email
const getPatientByUser = async (userEmail) => {
    return await Patient.findOne({ email: userEmail });
};

// @desc    Get Patient's Medical Wallet (Digital Health Timeline)
// @route   GET /api/patient/wallet
// @access  Private (Patient only)
export const getMedicalWallet = async (req, res) => {
    try {
        const patient = await getPatientByUser(req.user.email);
        if (!patient) return res.status(404).json({ message: 'Patient profile not found for this user' });

        const reports = await LabReport.find({ patient: patient._id }).sort({ createdAt: -1 });
        const prescriptions = await Prescription.find({ patient: patient._id }).sort({ createdAt: -1 });
        const appointments = await Appointment.find({ patient: patient._id }).populate('doctor', 'name').sort({ dateTime: -1 });

        res.json({
            profile: patient,
            medicalTimeline: {
                reports,
                prescriptions,
                appointments
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get Patient's Billing History
// @route   GET /api/patient/billing
// @access  Private (Patient only)
export const getBillingHistory = async (req, res) => {
    try {
        const patient = await getPatientByUser(req.user.email);
        if (!patient) return res.status(404).json({ message: 'Patient profile not found' });

        const invoices = await Billing.find({ patient: patient._id }).sort({ createdAt: -1 });
        res.json(invoices);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Self-service appointment booking (Request)
// @route   POST /api/patient/appointments
// @access  Private (Patient only)
export const bookSelfAppointment = async (req, res) => {
    const { doctorId, dateTime, reason } = req.body;

    try {
        const patient = await getPatientByUser(req.user.email);
        if (!patient) return res.status(404).json({ message: 'Patient profile not found' });

        const appointment = await Appointment.create({
            patient: patient._id,
            doctor: doctorId,
            dateTime,
            reason,
            status: 'Scheduled'
        });

        res.status(201).json(appointment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get real-time queue status for patient's today's appointment
// @route   GET /api/patient/queue-status
// @access  Private (Patient only)
export const getMyQueueStatus = async (req, res) => {
    try {
        const patient = await getPatientByUser(req.user.email);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const appointment = await Appointment.findOne({
            patient: patient?._id,
            dateTime: { $gte: today },
            status: 'Scheduled'
        }).populate('doctor', 'name');

        if (!appointment) return res.json({ message: 'No appointment scheduled for today' });

        // Count people ahead in queue for the same doctor
        const ahead = await Appointment.countDocuments({
            doctor: appointment.doctor._id,
            dateTime: { $lt: appointment.dateTime, $gte: today },
            status: 'Scheduled'
        });

        res.json({
            appointment,
            queuePosition: ahead + 1,
            estimatedWaitTime: (ahead + 1) * 15 // Mock 15 mins per patient
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
