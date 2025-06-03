// // services/webhook.ts
// import { Request, Response } from 'express';
// import { Webhook } from "standardwebhooks";
// import { PrismaClient, PaymentStatus } from '@prisma/client';
// import { chargeOnDemandSubscription } from '../services/paymentService'

// const prisma = new PrismaClient();
// const webhook = new Webhook(process.env.DODO_PAYMENTS_WEBHOOK_KEY || '');

// const dodoWebhookHandler = async (req: Request, res: Response) => {
//     try {
//         const body = req.body;
//         const headers: { [key: string]: string } = {
//             "webhook-id": (req.headers["webhook-id"] || "") as string,
//             "webhook-signature": (req.headers["webhook-signature"] || "") as string,
//             "webhook-timestamp": (req.headers["webhook-timestamp"] || "") as string,
//         };
//         const raw = JSON.stringify(body);

//         // Verify the webhook signature
//         const isVerified = await webhook.verify(raw, headers);

//         if (!isVerified) {
//             console.error('Webhook signature verification failed!');
//              res.status(400).json({ error: 'Invalid webhook signature' });
//              return
//         }

//         console.log('Received Dodo Payments webhook:', body);

//         if (body.event === 'subscription.active') {
//             // Handle subscription activation
//             console.log('Subscription activated:', body.data);
//             const subscriptionId = body.data.subscription_id;

//             try {
//                 const booking = await prisma.booking.findUnique({
//                     where: { bookingId: subscriptionId }, 
//                     select: { bookingId: true, totalAmount: true },
//                 });

//                 if (!booking) {
//                     console.error(`Booking not found for subscription: ${subscriptionId}`);
//                      res.status(400).json({ error: 'Booking not found' });
//                      return
//                 }

//                 //  2. Use bookingId in the update
//                 const updatedBooking = await prisma.booking.update({
//                     where: { bookingId: booking.bookingId },
//                     data: { paymentStatus: PaymentStatus.SUBSCRIPTION_ACTIVE },
//                 });
//                 console.log('Booking status updated. Ready to charge subscription:', subscriptionId, updatedBooking);

//                 // Charge the subscription
//                 await chargeOnDemandSubscription(subscriptionId, Number(booking.totalAmount));
//                 console.log(`Successfully charged subscription ${subscriptionId} for booking ${booking.bookingId}`);

//             } catch (dbError: any) {
//                 console.error('Error updating booking or charging subscription:', dbError);
//                 const bookingToUpdate = await prisma.booking.findUnique({
//                     where: { bookingId: subscriptionId }
//                 });
//                 if (bookingToUpdate) {
//                     await prisma.booking.update({
//                         where: { bookingId: bookingToUpdate.bookingId }, // Use bookingId
//                         data: { paymentStatus: PaymentStatus.SUBSCRIPTION_ACTIVATION_FAILED }, // Or a status
//                     });
//                 }
//                  res.status(500).json({ error: 'Database error' });
//                  return
//             }
//         } else if (body.event === 'payment.failed') {
//             // Handle payment failure
//             console.error('Payment failed:', body.data);
//             const subscriptionId = body.data.subscription_id;
//             const booking = await prisma.booking.findUnique({
//                 where: { bookingId: subscriptionId }
//             });
//             if (booking) {
//                 await prisma.booking.update({
//                     where: { bookingId: booking.bookingId }, 
//                     data: { paymentStatus: PaymentStatus.FAILED },
//                 });
//             }
//             else {
//                 console.error(`Booking not found for subscription on payment failed: ${subscriptionId}`);
//             }

//         }
//         else if (body.event === 'payment.succeeded') { 
//             console.log('Payment succeeded:', body.data);
//             const subscriptionId = body.data.subscription_id; 
//             const paymentMethod = body.data.payment_method;

//             const bookingToUpdate = await prisma.booking.findUnique({
//                 where: { bookingId: subscriptionId }
//             });

//             if (bookingToUpdate) {
//                 await prisma.booking.update({
//                     where: { bookingId: bookingToUpdate.bookingId },
//                     data: {
//                         paymentStatus: PaymentStatus.SUCCESSFUL, 
//                         paymentMethodUsed: paymentMethod, 
//                     },
//                 });
//                 console.log(`Booking ${bookingToUpdate.bookingId} updated with payment method: ${paymentMethod}`);
//             }
//             else {
//                 console.error(`Booking not found for subscription on payment succeeded: ${subscriptionId}`);
//             }
//         }

//         else {
//             console.log('Received other event:', body.event);
//         }

//         res.status(200).json({ received: true });
//     } catch (error: any) {
//         console.error('Error processing webhook:', error);
//         res.status(200).json({ error: 'Webhook handler failed' }); 
//     }
// };

// export default dodoWebhookHandler;