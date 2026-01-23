import express from 'express';
import {
    getMedicalWallet,
    getBillingHistory,
    bookSelfAppointment,
    getMyQueueStatus
} from '../controllers/patientController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleGuard.js';
import { ROLES } from '../config/roles.js';

const router = express.Router();

// Protected and restricted to PATIENT role
router.use(protect);
router.use(authorize(ROLES.PATIENT));

router.get('/wallet', getMedicalWallet);
router.get('/billing', getBillingHistory);
router.post('/appointments', bookSelfAppointment);
router.get('/queue-status', getMyQueueStatus);

export default router;
