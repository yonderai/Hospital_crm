import express from 'express';
import {
    createInvoice,
    updatePaymentStatus,
    getInvoices,
    insurancePreAuth
} from '../controllers/revenueController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleGuard.js';
import { ROLES } from '../config/roles.js';

const router = express.Router();

// Protected and restricted to REVENUE_OFFICE role
router.use(protect);
router.use(authorize(ROLES.REVENUE_OFFICE));

router.post('/invoices', createInvoice);
router.get('/invoices', getInvoices);
router.put('/invoices/:id/pay', updatePaymentStatus);
router.post('/insurance/pre-auth', insurancePreAuth);

export default router;
