import Patient from '../models/Patient.js';
import Appointment from '../models/Appointment.js';

// @desc    Get patients in assigned ward/floor
// @route   GET /api/nurse/patients
// @access  Private (Nurse only)
export const getAssignedPatients = async (req, res) => {
    const { ward } = req.query;

    try {
        const query = ward ? { 'bedAllocated.ward': ward } : { 'bedAllocated.ward': { $exists: true } };
        const patients = await Patient.find(query);
        res.json(patients);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update patient vitals and clinical status
// @route   PUT /api/nurse/patients/:id/vitals
// @access  Private (Nurse only)
export const updatePatientVitals = async (req, res) => {
    const { vitals } = req.body;

    try {
        const appointment = await Appointment.findOne({ patient: req.params.id }).sort({ dateTime: -1 });
        if (!appointment) return res.status(404).json({ message: 'No recent appointment found to update vitals' });

        appointment.vitals = { ...appointment.vitals, ...vitals };
        await appointment.save();

        res.json(appointment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Send emergency alert
// @route   POST /api/nurse/emergency-alert
// @access  Private (Nurse only)
export const sendEmergencyAlert = async (req, res) => {
    const { patientId, message } = req.body;

    try {
        // In a real system, this would trigger a socket event or SMS/Push
        console.log(`EMERGENCY ALERT for Patient ${patientId}: ${message}`);
        res.json({ message: 'Emergency alert sent successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get Nurse Schedule
// @route   GET /api/nurse/schedule
// @access  Private (Nurse only)
export const getNurseSchedule = async (req, res) => {
    // Mock data for demo, would usually come from an HR/Roster model
    res.json([
        { shift: 'Morning', floor: '3rd Floor', ward: 'ICU', date: new Date().toISOString() }
    ]);
};
