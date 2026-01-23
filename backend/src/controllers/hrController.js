import User from '../models/User.js';

// @desc    Get all staff (Doctors, Nurses, etc.)
// @route   GET /api/hr/staff
// @access  Private (HR only)
export const getAllStaff = async (req, res) => {
    try {
        const staff = await User.find({ role: { $ne: 'PATIENT' } }).select('-password');
        res.json(staff);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update staff status or details
// @route   PUT /api/hr/staff/:id
// @access  Private (HR only)
export const updateStaffProfile = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Manage Rosters (Mock logic)
// @route   POST /api/hr/rosters
// @access  Private (HR only)
export const manageRosters = async (req, res) => {
    const { staffId, shift, date, ward } = req.body;
    try {
        // In a production system, this would save to a Roster model
        res.json({ message: 'Roster updated successfully', roster: { staffId, shift, date, ward } });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get Compliance Status
// @route   GET /api/hr/compliance
// @access  Private (HR only)
export const getComplianceStatus = async (req, res) => {
    res.json([
        { regulation: 'HIPAA Training', status: '95% Compliant' },
        { regulation: 'Medical License Renewal', status: 'Pending for 2 staff members' },
        { regulation: 'Safety Audit', status: 'Completed Dec 2025' }
    ]);
};

// @desc    Handle Complaints
// @route   GET /api/hr/complaints
// @access  Private (HR only)
export const getComplaints = async (req, res) => {
    res.json([
        { from: 'Patient A', subject: 'Wait time', status: 'Open' },
        { from: 'Doctor B', subject: 'Equipment issue', status: 'Resolved' }
    ]);
};
