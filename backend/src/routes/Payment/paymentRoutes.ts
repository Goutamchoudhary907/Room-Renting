// routes/paymentRoutes.ts

import express from 'express';
const router = express.Router();
import { authMiddleware } from '../../middleware/middleware.js'; 
import { checkout, getPaymentDetails, getRazorpayKey, paymentVerification } from '../../controller/paymentController.js';

router.get('/getkey', getRazorpayKey);
router.post("/checkout",authMiddleware, checkout)
router.post("/paymentVerification",paymentVerification)
router.get('/:bookingId', authMiddleware, getPaymentDetails);


export default router;