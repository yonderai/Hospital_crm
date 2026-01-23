import express from 'express';
import {
    getAdminDashboard,
    getExpenses,
    getStockOverview,
    getStaffOverview,
    getBillingOverview
} from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleGuard.js';
import { ROLES } from '../config/roles.js';

const router = express.Router();

// All admin routes are protected and restricted to ADMIN role
router.use(protect);
router.use(authorize(ROLES.ADMIN));

router.get('/summary', getAdminDashboard);
router.get('/expenses', getExpenses);
router.get('/stock', getStockOverview);
router.get('/staff', getStaffOverview);
router.get('/billing', getBillingOverview);

export default router;
