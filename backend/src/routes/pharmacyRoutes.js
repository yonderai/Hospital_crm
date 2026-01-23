import express from 'express';
import {
    dispenseMedicine,
    getInventoryOverview,
    updateInventory,
    getLowStockAlerts
} from '../controllers/pharmacyController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleGuard.js';
import { ROLES } from '../config/roles.js';

const router = express.Router();

// Protected and restricted to PHARMACY_INVENTORY role
router.use(protect);
router.use(authorize(ROLES.PHARMACY_INVENTORY));

router.post('/dispense', dispenseMedicine);
router.get('/inventory', getInventoryOverview);
router.post('/inventory', updateInventory);
router.get('/low-stock', getLowStockAlerts);

export default router;
