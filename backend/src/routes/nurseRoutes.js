import express from 'express';
import {
    getAssignedPatients,
    updatePatientVitals,
    sendEmergencyAlert,
    getNurseSchedule
} from '../controllers/nurseController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleGuard.js';
import { ROLES } from '../config/roles.js';

const router = express.Router();

// Protected and restricted to NURSE role
router.use(protect);
router.use(authorize(ROLES.NURSE));

router.get('/patients', getAssignedPatients);
router.put('/patients/:id/vitals', updatePatientVitals);
router.post('/emergency-alert', sendEmergencyAlert);
router.get('/schedule', getNurseSchedule);

export default router;
