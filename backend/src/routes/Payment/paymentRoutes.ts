// routes/paymentRoutes.ts

import express from 'express';
const router = express.Router();
import { initiateBookingHandler, chargeBookingPaymentHandler, getPaymentDetailsHandler } from '../../controller/paymentController';
import { authMiddleware } from '../../middleware/middleware'; 

router.post('/initiate-payment', authMiddleware, initiateBookingHandler);
router.post('/charge-payment', authMiddleware, chargeBookingPaymentHandler);
router.get('/payments/:paymentId', authMiddleware, getPaymentDetailsHandler);

export default router;