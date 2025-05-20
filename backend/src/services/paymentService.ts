// services/paymentService.ts

import DodoPayments from 'dodopayments';
import { PrismaClient } from '@prisma/client';
import { log } from 'console';

const prisma = new PrismaClient();

// let baseURL = 'https://test.dodopayments.com'; 
// if (process.env.NODE_ENV === 'production') {
//   baseURL = 'https://live.dodopayments.com'; 
// }

const client = new DodoPayments({
  bearerToken:process.env.DODO_PAYMENTS_API_KEY ,
  baseURL: 'https://test.dodopayments.com'
});
interface InitiatePaymentPayload {
  userId: string;
  propertyId: string;
  paymentMethod: 'upi' | 'card';
  bookingId: string;
  rentalType: 'short-term' | 'long-term';
  checkinDate?: Date | null;
  checkoutDate?: Date | null;
  moveInDate?: Date | null;
  leaseDuration?: number;
  payment_link?: boolean;
  return_url?: string;
}

async function initiatePayment(payload: InitiatePaymentPayload) {
  try {
    const {
      userId,
      propertyId,
      bookingId,
      rentalType,
      checkinDate,
      checkoutDate,
      moveInDate,
      leaseDuration,
    } = payload;

    const rentalDetails = await prisma.property.findUnique({
      where: {
        id: parseInt(propertyId, 10),
      },
    });

    const userDetails = await prisma.user.findUnique({
      where: {
        id: parseInt(userId, 10),
      },
    });

    if (!rentalDetails || !userDetails) {
      throw new Error('Could not retrieve rental or user details.');
    }

    let amount: number;

    if (rentalType === 'short-term' && rentalDetails.pricePerNight && checkinDate && checkoutDate) {
      const checkin = new Date(checkinDate);
      const checkout = new Date(checkoutDate);
      const numberOfNights = Math.ceil((checkout.getTime() - checkin.getTime()) / (1000 * 60 * 60 * 24));
      const subTotal = rentalDetails.pricePerNight * numberOfNights;
      const serviceCharge = Math.ceil(subTotal * 0.05);
      amount = subTotal + serviceCharge;
    } else if (rentalType === 'long-term' && rentalDetails.pricePerMonth && leaseDuration) {
      amount = leaseDuration * rentalDetails.pricePerMonth;
    } else {
      throw new Error('Could not determine booking amount based on rental type and details.');
    }

    const amountInPaise = Math.round(amount * 100);
   log(`Calculated amount: ${amount} INR (${amountInPaise} paise)`);
    const subscriptionResponse = await client.subscriptions.create({
      customer: {
        email: userDetails.email,
        name: `${userDetails.firstName} ${userDetails.lastName}`,
      },
      on_demand: {
        product_price: amountInPaise,
        mandate_only: false, 
      },
      billing: {
        city: 'N/A',
        country: 'IN',
        state: 'N/A',
        street: 'N/A',
        zipcode: '000000',
      },
      metadata: {
        userId: userId.toString(),
        propertyId: propertyId.toString(),
        bookingId: bookingId.toString(),
        rentalType: rentalType,
      },
      product_id: "pdt_agbP47u6rLd9tjINLcGud", 
      quantity: 1,
      payment_link:true,
      return_url: `http://localhost:3000/booking-confirmation/${bookingId}`,
    });

    console.log('On-Demand Subscription Created:', subscriptionResponse);

    const updatedBooking = await prisma.booking.update({
      where: { bookingId: bookingId },
      data: { 
        dodoSubscriptionId: subscriptionResponse.subscription_id,
        totalAmount: amount,
      },
    });
    console.log('Booking updated with totalAmount:', updatedBooking);

    console.log('Response being sent:', {
      payment_link: subscriptionResponse.payment_link,
      booking: updatedBooking,
      subscriptionId: subscriptionResponse.subscription_id,
    });
    return { payment_link: subscriptionResponse.payment_link, booking: updatedBooking, subscriptionId: subscriptionResponse.subscription_id };

  } catch (error: any) {
    console.error('Full DodoPayments error:', {
      message: error.message,
      code: error.code,
      response: {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers
      },
      config: {
        url: error.config?.url,
        method: error.config?.method,
        data: error.config?.data
      }
    });
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

async function chargeOnDemandSubscription(subscriptionId: string, amount: number) {
  try {
    const amountInPaise = Math.round(amount * 100);
    const response = await client.subscriptions.charge(subscriptionId, { product_price: amountInPaise });

    console.log('On-Demand Subscription Charged:', response);
    return response; 
  } catch (error: any) {
    console.error(`Error charging on-demand subscription ${subscriptionId}:`, error);
    throw error;
  }
}

async function getPaymentDetail(paymentId: string) {
  try {
    const response = await client.payments.retrieve(paymentId);
    console.log('Payment Details:', response);
    return response;
  } catch (error: any) {
    console.error(`Error retrieving payment details for ${paymentId}:`, error);
    throw error;
  }
}

export { initiatePayment, InitiatePaymentPayload, chargeOnDemandSubscription,getPaymentDetail };