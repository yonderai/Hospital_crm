import express from 'express';
import {
    registerPatient,
    bookAppointment,
    allocateBed,
    getQueueStatus
} from '../controllers/frontdeskController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleGuard.js';
import { ROLES } from '../config/roles.js';

const router = express.Router();

// Protected and restricted to FRONT_DESK role
router.use(protect);
router.use(authorize(ROLES.FRONT_DESK));

router.post('/patients', registerPatient);
router.post('/appointments', bookAppointment);
router.put('/allocate-bed/:id', allocateBed);
router.get('/queue', getQueueStatus);

export default router;
