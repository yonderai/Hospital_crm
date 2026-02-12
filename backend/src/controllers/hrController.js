import Staff from '../models/Staff.js';
import { ROLES } from '../config/roles.js';

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

// @desc    Create new staff member
// @route   POST /api/hr/staff
// @access  Private (HR only)
export const createStaff = async (req, res) => {
    const { firstName, lastName, email, phone, role, department, designation, baseSalary } = req.body;

    try {
        // 1. Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // 2. Create User (Auth)
        const user = await User.create({
            firstName,
            lastName,
            email,
            password: 'a', // Default password
            role,
            department,
            phone,
            employeeId: `EMP-${Date.now().toString().slice(-4)}` // Simple ID generation
        });

        // 3. Create Staff Profile (HR Data)
        const staff = await Staff.create({
            userId: user._id,
            employeeId: user.employeeId,
            firstName,
            lastName,
            email,
            phone,
            role,
            department,
            designation,
            baseSalary: Number(baseSalary),
            dateJoined: new Date(),
            status: 'active',
            bankDetails: {
                accountName: `${firstName} ${lastName}`,
                bankName: 'Pending',
                accountNumber: 'Pending',
                ifscCode: 'Pending'
            }
        });

        res.status(201).json({ message: 'Staff created successfully', data: staff });
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
