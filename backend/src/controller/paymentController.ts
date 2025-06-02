// controllers/paymentController.ts

import { Request, Response } from 'express';
import { initiatePayment, chargeOnDemandSubscription, getPaymentDetail } from '../services/paymentService';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { authMiddleware, AuthenticatedRequest } from '../middleware/middleware';

const prisma = new PrismaClient();

export const initiateBookingHandler = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user || !req.user.userId) {
      res.status(401).json({ message: 'Unauthorized: User not authenticated or missing user ID.' });
      return;
    }
    const userId = req.user.userId;
    console.log("Userid :" + userId);
    const { propertyId, rentalType, checkinDate, checkoutDate, moveInDate, leaseDuration, paymentMethod } = req.body;
    const bookingId = uuidv4();

    const newBooking = await prisma.booking.create({
      data: {
        bookingId: bookingId,
        userId: userId,
        propertyId: parseInt(propertyId, 10),
        rentalType: rentalType,
        checkinDate: checkinDate ? new Date(checkinDate) : null,
        checkoutDate: checkoutDate ? new Date(checkoutDate) : null,
        moveInDate: moveInDate ? new Date(moveInDate) : null,
        leaseDuration: leaseDuration ? parseInt(leaseDuration, 10) : null,
        paymentStatus: 'PENDING',
        dodoSubscriptionId: null
      },
    });

    const paymentPayload = {
      userId: userId.toString(),
      propertyId: propertyId,
      paymentMethod: paymentMethod,
      bookingId: bookingId,
      rentalType: rentalType,
      checkinDate: checkinDate ? new Date(checkinDate) : null,
      checkoutDate: checkoutDate ? new Date(checkoutDate) : null,
      moveInDate: moveInDate ? new Date(moveInDate) : null,
      leaseDuration: leaseDuration !== null ? parseInt(leaseDuration, 10) : undefined,
    };

    const paymentResponse = await initiatePayment(paymentPayload);

    res.status(200).json({ paymentLink: paymentResponse.payment_link, booking: paymentResponse.booking, subscriptionId: paymentResponse.subscriptionId });

  } catch (error: any) {
    console.error('Error initiating payment', error.message);
    res.status(500).json({ message: 'Failed to initiate payment', error: error.message });
  } finally {
    await prisma.$disconnect();
  }
};

export const chargeBookingPaymentHandler = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user || !req.user.userId) {
      res.status(401).json({ message: 'Unauthorized: User not authenticated or missing user ID.' });
      return;
    }
    const userId = req.user.userId;
    const { bookingId, amount } = req.body;

    const booking = await prisma.booking.findUnique({
      where: { bookingId: bookingId },
    });

    if (!booking || !booking.dodoSubscriptionId) {
       res.status(400).json({ message: 'Booking not found or Dodo subscription ID missing.' });
       return
    }

    const paymentResponse = await chargeOnDemandSubscription(booking.dodoSubscriptionId, parseFloat(amount));

    await prisma.booking.update({
      where: { bookingId: bookingId },
      data: {
        paymentStatus: 'SUCCESSFUL',
        transactionId: paymentResponse.payment_id, 
      },
    });

    res.status(200).json({ message: 'Payment successful', paymentResponse });
  } catch (error: any) {
    console.error('Error charging on-demand subscription:', error);
    res.status(500).json({ message: 'Failed to charge payment', error: error.message });
  } finally {
    await prisma.$disconnect();
  }
};

export const getPaymentDetailsHandler = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { paymentId } = req.params;

    if (!paymentId) {
       res.status(400).json({ message: 'Payment ID is required.' });
       return
    }

    const paymentDetails = await getPaymentDetail(paymentId);
    res.status(200).json(paymentDetails);

  } catch (error: any) {
    console.error('Error fetching payment details:', error);
    res.status(500).json({ message: 'Failed to fetch payment details', error: error.message });
  }
};