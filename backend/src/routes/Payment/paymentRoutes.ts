// routes/paymentRoutes.ts

import express from 'express';
const router = express.Router();
import { authMiddleware } from '../../middleware/middleware.js'; 
import { checkout } from '@/controller/paymentController.js';

router.post("/checkout", checkout)
export default router;