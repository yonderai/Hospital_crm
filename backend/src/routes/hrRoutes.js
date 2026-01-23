import express from 'express';
import {
    getAllStaff,
    updateStaffProfile,
    manageRosters,
    getComplianceStatus,
    getComplaints
} from '../controllers/hrController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleGuard.js';
import { ROLES } from '../config/roles.js';

const router = express.Router();

// Protected and restricted to HR role
router.use(protect);
router.use(authorize(ROLES.HR));

router.get('/staff', getAllStaff);
router.put('/staff/:id', updateStaffProfile);
router.post('/rosters', manageRosters);
router.get('/compliance', getComplianceStatus);
router.get('/complaints', getComplaints);

export default router;
