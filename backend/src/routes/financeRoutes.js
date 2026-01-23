import express from 'express';
import {
    addExpense,
    getPayrollData,
    manageProcurement,
    getAssetOverview
} from '../controllers/financeController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleGuard.js';
import { ROLES } from '../config/roles.js';

const router = express.Router();

// Protected and restricted to BACK_OFFICE_FINANCE role
router.use(protect);
router.use(authorize(ROLES.BACK_OFFICE_FINANCE));

router.post('/expenses', addExpense);
router.get('/payroll', getPayrollData);
router.post('/procurement', manageProcurement);
router.get('/assets', getAssetOverview);

export default router;
