import Patient from '../models/Patient.js';
import Appointment from '../models/Appointment.js';
import { ROLES } from '../config/roles.js';

// @desc    Register a new patient
// @route   POST /api/frontdesk/patients
// @access  Private (Front Desk only)
export const registerPatient = async (req, res) => {
    const { name, email, phone, dob, gender, address, insuranceDetails } = req.body;

    try {
        const patientExists = await Patient.findOne({ email });
        if (patientExists) return res.status(400).json({ message: 'Patient already exists' });

        const patient = await Patient.create({
            name,
            email,
            phone,
            dob,
            gender,
            address,
            insuranceDetails
        });

        res.status(201).json(patient);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Book an appointment
// @route   POST /api/frontdesk/appointments
// @access  Private (Front Desk only)
export const bookAppointment = async (req, res) => {
    const { patientId, doctorId, dateTime, reason } = req.body;

    try {
        // Basic queue management: count today's appointments for this doctor
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const count = await Appointment.countDocuments({
            doctor: doctorId,
            dateTime: { $gte: today }
        });

        const appointment = await Appointment.create({
            patient: patientId,
            doctor: doctorId,
            dateTime,
            reason,
            queueNumber: count + 1
        });

        res.status(201).json(appointment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Allocate bed to patient
// @route   PUT /api/frontdesk/allocate-bed/:id
// @access  Private (Front Desk only)
export const allocateBed = async (req, res) => {
    const { ward, bedNumber } = req.body;

    try {
        const patient = await Patient.findById(req.params.id);
        if (!patient) return res.status(404).json({ message: 'Patient not found' });

        patient.bedAllocated = {
            ward,
            bedNumber,
            allocatedAt: new Date()
        };

        await patient.save();
        res.json(patient);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get Queue Status
// @route   GET /api/frontdesk/queue
// @access  Private (Front Desk only)
export const getQueueStatus = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const appointments = await Appointment.find({
            dateTime: { $gte: today },
            status: 'Scheduled'
        }).populate('patient', 'name').populate('doctor', 'name');

        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
