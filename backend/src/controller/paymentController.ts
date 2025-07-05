// controllers/paymentController.ts

import { Request, Response } from 'express';
import { PrismaClient,Prisma } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { authMiddleware, AuthenticatedRequest } from '../middleware/middleware.js';
import razorpayInstance from '../services/razorpayInstance.js';
import crypto from "crypto"
import { checkPropertyAvailability, updatePropertyAvailability } from '../utils/availabilityUtils.js';
const prisma = new PrismaClient();


export const checkout= async (req:AuthenticatedRequest, res:Response) =>{
  let booking: any = null;
  let payment: any = null;
  const {
    amount,
    propertyId,
    rentalType,
    checkInDate,
    checkOutDate,
    moveInDate,
    leaseDuration,
    specialRequests='',
    guestCount = 1 
  }=req.body;
     // Validate dates
    const isShortTerm = !!checkInDate && !!checkOutDate;
    const isLongTerm = !!moveInDate;
  try {

      // Validate required fields
      if (!propertyId || !amount) {
        res.status(400).json({ 
         success: false,
         error: 'Property ID and amount are required' 
       });
       return
     }
       // Get the property to check the host
       const property = await prisma.property.findUnique({
        where: { id: propertyId },
        select: { hostId: true }
      });

   
       // Prevent host from booking their own property
    if (property?.hostId === req.user?.userId) {
       res.status(400).json({ message: "You cannot book your own property" });
       return
    }



    if ((rentalType === 'short-term' || rentalType === 'both') && !isShortTerm) {
      res.status(400).json({
        success: false,
        error: 'Check-in and check-out dates are required for short-term rentals'
      });
      return;
    }

    if ((rentalType === 'long-term' || rentalType === 'both') && !isLongTerm) {
      res.status(400).json({
        success: false,
        error: 'Move-in date is required for long-term rentals'
      });
      return;
    }

    const userId = req.user?.['userId'] || req.user?.['id']; 
    
    if (!userId) {
       res.status(401).json({ 
        success: false,
        error: 'User not authenticated or invalid token structure' 
      });
      return
    }

   const isShort = isShortTerm && (rentalType === 'short-term' || rentalType === 'both');

    const dates = isShort
      ? { start: new Date(checkInDate), end: new Date(checkOutDate) }
      : {
        start: new Date(moveInDate),
        end: new Date(new Date(moveInDate).setMonth(new Date(moveInDate).getMonth() + (leaseDuration || 1)))
      };

    const {available, conflict}= await checkPropertyAvailability(
      propertyId,
      dates,
      rentalType
    );
    
     if(!available){
       res.status(409).json({
        success:false ,
        error: "Property not available for selected dates" ,
        conflict:conflict ? {
          bookingId:conflict.bookingId,
          dates:{
            from:conflict.checkinDate || conflict.moveInDate, 
            to:conflict.checkoutDate || 'ongoing'
          }
        }:undefined
      });
      return
     }

     // Block the property dates
     await updatePropertyAvailability(propertyId, dates, 'block');

       // Create records in a transaction
     await prisma.$transaction(async (tx: Prisma.TransactionClient) => {

     // Create preliminary booking record
       booking= await prisma.booking.create({
      data:{
        bookingId:`Book-${Date.now()}`,
        user: { connect: { id: Number(userId) } }, 
        property: { connect: { id: propertyId } },
       rentalType,
       paymentStatus: 'PENDING',
       totalAmount:amount,
       specialRequests,
       guestCount,
         release_after: isShort
            ? new Date(checkOutDate)
            : new Date(new Date(moveInDate).setMonth(new Date(moveInDate).getMonth() + (leaseDuration || 1))),
          ...(isShort && {
            checkinDate: new Date(checkInDate),
            checkoutDate: new Date(checkOutDate)
          }),
          ...(!isShort && {
            moveInDate: new Date(moveInDate),
            leaseDuration
          })
        }
      });

      // Create preliminary payment record
       payment=await prisma.payment.create({
        data:{
          razorpayOrderId: 'temp_' + uuidv4(), // Temporary unique value
          razorpayPaymentId: 'temp_' + uuidv4(),
          razorpaySignature: '',
          amount:amount,
          currency:"INR",
          status:"PENDING",
          user: { connect: { id: Number(userId) } }, // Using connect
          property: { connect: { id: propertyId } }, 
          booking: { connect: { id: booking.id } }   
        }
      })
      return {booking, payment};
    },{
      maxWait:15_000,
      timeout:15_000
    })

  // Create Razorpay order (but don't store its ID in database yet)
  const order = await razorpayInstance.orders.create({
    amount: Math.round(Number(amount) * 100),
    currency: "INR",
    receipt: `bk_${uuidv4().substring(0, 36)}`,
    notes: {
      propertyId,
      userId,
      rentalType,
      ...(isShort && { checkInDate, checkOutDate }),
        ...(!isShort  && { moveInDate, leaseDuration }),
      bookingId: booking.bookingId,
      paymentId: payment.id
    }
  });

    // Update payment with actual Razorpay order ID
    await prisma.payment.update({
      where: { id: payment.id },
      data: { razorpayOrderId: order.id }
    });


    res.status(200).json({
      success:true,
      order,
      bookingId:booking.bookingId,
      paymentId:payment.id
    });

  } catch (error) {
      // If booking was created but error occurred later
 if (booking) {
      const isShort = isShortTerm && (rentalType === 'short-term' || rentalType === 'both');
      const dates = isShort
        ? { start: new Date(checkInDate), end: new Date(checkOutDate) }
        : {
          start: new Date(moveInDate),
          end: new Date(new Date(moveInDate).setMonth(new Date(moveInDate).getMonth() + (leaseDuration || 1)))
        };
      await updatePropertyAvailability(propertyId, dates, 'release');
      await prisma.booking.update({
        where: { id: booking.id },
        data: {
          paymentStatus: 'FAILED'
        }
      });
    }



    console.error('Checkout error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to create payment order',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }

}

export const paymentVerification= async (req:AuthenticatedRequest, res:Response) =>{
    
  const {
    razorpay_order_id,
    razorpay_payment_id, 
    razorpay_signature,
    bookingId
  } = req.body;
  
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
     res.status(400).json({ 
      success: false, 
      error: 'Missing payment verification data' 
    });
    return
  }

try{
  const body= razorpay_order_id + "|" + razorpay_payment_id ;

  const expectedSignature= crypto.createHmac('sha256',process.env.RAZORPAY_API_SECRET as string)
                                 .update(body.toString())
                                 .digest('hex'); 

   if (expectedSignature !== razorpay_signature) {
    // Update records as failed if signature doesn't match

    const booking = await prisma.booking.findUnique({
      where: { bookingId },
      select: { propertyId: true }
    });
   await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
  await tx.booking.update({
    where: { bookingId },
    data: { paymentStatus: 'FAILED' }
  });
  await tx.payment.updateMany({
    where: { razorpayOrderId: razorpay_order_id },
    data: { status: 'FAILED' }
  });
});

     res.status(400).json({ 
      success: false, 
      error: 'Invalid payment signature',
      redirectUrl: `${process.env.FRONTEND_URL}/booking/${bookingId}/failed`,
      propertyId: booking?.propertyId
    });
    return
  }

   // Update records with actual payment details
const [updatedBooking] = await prisma.$transaction(async (tx) => {
  const updatedBooking = await tx.booking.update({
    where: { bookingId },
    data: {
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      paymentStatus: 'SUCCESSFUL', 
      updatedAt: new Date()
    },
    include: { property: true, user: true }
  });

  const updatedPayment = await tx.payment.updateMany({
    where: { booking: { bookingId } },
    data: {
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      status: 'SUCCESSFUL',
      updatedAt: new Date()
    }
  });

 return [updatedBooking];
});
  // After transaction completes
const verifiedBooking = await prisma.booking.findUnique({
  where: { bookingId },
  select: { paymentStatus: true }
});
console.log('Verified booking status:', verifiedBooking?.paymentStatus);

  // Update property availability

await prisma.property.update({
  where: { id: updatedBooking.property.id },
  data: { bookingStatus: 'BOOKED' }
});

 res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      redirectUrl: `${process.env.FRONTEND_URL}/booking/${bookingId}/success?payment_id=${razorpay_payment_id}`,
      bookingId
    });
}catch(error){
console.error("Payment verification failed :", error);

  // Get booking to release dates
  const booking = await prisma.booking.findUnique({
    where: { bookingId },
    select: { 
      propertyId: true,
      rentalType: true,
      checkinDate: true,
      checkoutDate: true,
      moveInDate: true,
      leaseDuration: true 
    }
  });
  if (booking) {
   const isShort = booking.rentalType === 'short-term' || 
                (booking.rentalType === 'both' && booking.checkinDate && booking.checkoutDate);

const dates = isShort
  ? { start: booking.checkinDate!, end: booking.checkoutDate! }
  : {
      start: booking.moveInDate!,
      end: new Date(new Date(booking.moveInDate!).setMonth(
        new Date(booking.moveInDate!).getMonth() + (booking.leaseDuration || 1)
      ))
    };

    
    await updatePropertyAvailability(booking.propertyId, dates, 'release');
  }

 // Attempt to mark as failed in database
 try {
await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
  await tx.booking.update({
    where: { bookingId },
    data: { paymentStatus: 'FAILED' }
  });
  await tx.payment.updateMany({
    where: { razorpayOrderId: razorpay_order_id },
    data: { status: 'FAILED' }
  });
});

 } catch (dbError) {
  console.error('Failed to update failed status:', dbError);
 }
 res.status(500).json({ 
  success: false, 
  error: 'Payment verification failed',
  redirectUrl: `${process.env.FRONTEND_URL}/booking/${bookingId}/failed`
});


}
}


export const getPaymentDetails=async (req:AuthenticatedRequest, res:Response) =>{
  try {
    const {bookingId} =req.params;

    const booking=await prisma.booking.findUnique({
      where:{bookingId},
      include:{
        property:{
          select:{
            id:true,
            title:true,
            images:{take:1}    // Just get first image for thumbnail
          }
        },
        user:{
          select:{
            id:true,
            firstName:true,
            lastName:true,
            email:true
          }
        },
        payment:true
      }
    });

    if(!booking){
       res.status(404).json({ 
        success: false,
        error: 'Booking not found' 
      });
      return
    }
    res.status(200).json({
      success: true,
      booking
    });


  } catch (error) {
    console.error('Error fetching payment details:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch payment details' 
    });
  }
}

export const getRazorpayKey = (req: Request, res: Response) => {
  try {
    const key = process.env.RAZORPAY_API_KEY;
    if (!key) {
      throw new Error('Razorpay API key not configured');
    }
    res.status(200).json({ key });
  } catch (error) {
    console.error('Error getting Razorpay key:', error);
    res.status(500).json({ 
      error: 'Failed to get Razorpay key',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};