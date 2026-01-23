import express from 'express';
import {
    getAssignedPatients,
    getPatientProfile,
    getSchedule,
    issuePrescription
} from '../controllers/doctorController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleGuard.js';
import { ROLES } from '../config/roles.js';

const router = express.Router();

// All doctor routes are protected and restricted to DOCTOR role
router.use(protect);
router.use(authorize(ROLES.DOCTOR));

router.get('/patients', getAssignedPatients);
router.get('/patients/:id', getPatientProfile);
router.get('/schedule', getSchedule);
router.post('/issue-prescription', issuePrescription);

export default router;
