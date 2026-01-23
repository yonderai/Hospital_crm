import LabReport from '../models/LabReport.js';

// @desc    Schedule a new diagnostic test
// @route   POST /api/diagnostics/schedule
// @access  Private (Diagnostics only)
export const scheduleTest = async (req, res) => {
    const { patientId, testName, category, requestedById } = req.body;

    try {
        const report = await LabReport.create({
            patient: patientId,
            testName,
            category,
            requestedBy: requestedById || req.user._id, // If admin or front desk requests
            status: 'Pending'
        });
        res.status(201).json(report);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update test status and upload results
// @route   PUT /api/diagnostics/reports/:id
// @access  Private (Diagnostics only)
export const updateReport = async (req, res) => {
    const { status, results, fileUrl } = req.body;

    try {
        const report = await LabReport.findById(req.params.id);
        if (!report) return res.status(404).json({ message: 'Report not found' });

        if (status) report.status = status;
        if (results) report.results = results;
        if (fileUrl) report.fileUrl = fileUrl;

        if (status === 'Completed') {
            report.completedAt = new Date();
        }

        await report.save();
        res.json(report);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all tests/reports
// @route   GET /api/diagnostics/reports
// @access  Private (Diagnostics only)
export const getReportsOverview = async (req, res) => {
    try {
        const reports = await LabReport.find()
            .populate('patient', 'name email')
            .populate('requestedBy', 'name')
            .sort({ createdAt: -1 });
        res.json(reports);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
