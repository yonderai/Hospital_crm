import Patient from '../models/Patient.js';
import Appointment from '../models/Appointment.js';
import LabReport from '../models/LabReport.js';
import Prescription from '../models/Prescription.js';

// @desc    Get assigned patients for a doctor
// @route   GET /api/doctor/patients
// @access  Private (Doctor only)
export const getAssignedPatients = async (req, res) => {
    try {
        // Patients who have appointments with this doctor
        const appointments = await Appointment.find({ doctor: req.user._id })
            .populate('patient', 'name email phone dob gender bloodGroup');

        // Extract unique patients
        const patients = Array.from(new Set(appointments.map(a => a.patient._id.toString())))
            .map(id => appointments.find(a => a.patient._id.toString() === id).patient);

        res.json(patients);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get complete patient profile
// @route   GET /api/doctor/patients/:id
// @access  Private (Doctor only)
export const getPatientProfile = async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id);
        if (!patient) return res.status(404).json({ message: 'Patient not found' });

        const reports = await LabReport.find({ patient: req.params.id }).sort({ createdAt: -1 });
        const prescriptions = await Prescription.find({ patient: req.params.id }).sort({ createdAt: -1 });
        const appointments = await Appointment.find({ patient: req.params.id }).sort({ dateTime: -1 });

        res.json({
            profile: patient,
            reports,
            prescriptions,
            appointments
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get doctor schedule
// @route   GET /api/doctor/schedule
// @access  Private (Doctor only)
export const getSchedule = async (req, res) => {
    try {
        const appointments = await Appointment.find({ doctor: req.user._id })
            .populate('patient', 'name email')
            .sort({ dateTime: 1 });
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Issue prescription and add notes
// @route   POST /api/doctor/issue-prescription
// @access  Private (Doctor only)
export const issuePrescription = async (req, res) => {
    const { patientId, medicines, diagnosis, clinicalNotes } = req.body;

    try {
        const prescription = await Prescription.create({
            patient: patientId,
            doctor: req.user._id,
            medicines,
            diagnosis,
            clinicalNotes
        });

        // Also update patient's medical history
        await Patient.findByIdAndUpdate(patientId, {
            $push: {
                medicalHistory: {
                    diagnosis,
                    treatment: clinicalNotes || 'Prescription issued',
                    date: new Date(),
                    doctor: req.user._id
                }
            },
            ongoingTreatment: diagnosis
        });

        res.status(201).json(prescription);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
