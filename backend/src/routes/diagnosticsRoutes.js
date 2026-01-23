import express from 'express';
import {
    scheduleTest,
    updateReport,
    getReportsOverview
} from '../controllers/diagnosticsController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleGuard.js';
import { ROLES } from '../config/roles.js';

const router = express.Router();

// Protected and restricted to DIAGNOSTICS role
router.use(protect);
router.use(authorize(ROLES.DIAGNOSTICS));

router.post('/schedule', scheduleTest);
router.get('/reports', getReportsOverview);
router.put('/reports/:id', updateReport);

export default router;
