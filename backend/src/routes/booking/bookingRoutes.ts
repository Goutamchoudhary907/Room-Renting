// routes/bookingRoutes.ts

import express from 'express';
const router = express.Router();
import { authMiddleware } from '../../middleware/middleware.js'; 
import { checkAvailability, checkBookingStatus, getProperyStatus, myBooking } from '../../controller/bookingController.js';

router.get('/my-bookings', authMiddleware, myBooking);
router.get('/check-availability', checkAvailability)
router.get("/:id/status", getProperyStatus)
router.get('/check-status/:propertyId', authMiddleware,checkBookingStatus);
export default router;