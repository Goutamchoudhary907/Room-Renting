import { AuthenticatedRequest } from '../middleware/middleware.js';
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { checkPropertyAvailability } from '../utils/availabilityUtils.js';
import { json } from 'body-parser';
const prisma = new PrismaClient();

export const myBooking= async(req:AuthenticatedRequest , res:Response) =>{
    const userId = req.user?.['userId'] || req.user?.['id']; 


    if(!userId){
        res.status(400).json({error:"user ID required"});
        return;
    }
    try {
        const bookings=await prisma.booking.findMany({
            where:{
                userId:Number(userId),
                paymentStatus: "SUCCESSFUL"
            },
            include:{property:{
                include:{images:{take:1}}
            },
        },
        orderBy:{createdAt:"desc"}
        });
         res.status(200).json({ 
            success: true, 
            bookings: bookings || [] 
        });
        return
    } catch (error) {
        res.status(500).json({error:"failed to fetch bookings"});
    }
}

interface PropertyAvailability {
    blockedDates?: Array<{
      start: string; 
      end: string;
    }>;
  }

export const checkAvailability = async (req: Request, res: Response) => {
  try {
    
    const { propertyId, startDate, endDate, rentalType } = req.query;
    
    if (!propertyId || !startDate || !endDate || !rentalType) {
       res.status(400).json({ error: "Missing required parameters" });
       return
    }

    const result = await checkPropertyAvailability(
      Number(propertyId),
      { 
        start: new Date(startDate as string), 
        end: new Date(endDate as string) 
      },
      rentalType as 'short-term' | 'long-term'
    );

    res.json({
      available: result.available,
      conflict: result.conflict ? {
        bookingId: result.conflict.bookingId,
        dates: {
          from: result.conflict.checkinDate || result.conflict.moveInDate,
          to: result.conflict.checkoutDate || 'ongoing'
        }
      } : null
    });
  } catch (error) {
    console.error('Availability check error:', error);
    res.status(500).json({
      error: "Availability check failed",
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
export const getProperyStatus=async (req:Request, res:Response) =>{
    try {
        const propertyId=Number(req.params.id);

        if(isNaN(propertyId)){
            res.status(400).json({
                success:false,
                error:"Invalid property ID"
            });
        }

        const property = await prisma.property.findUnique({
            where: { id: propertyId },
            select:{
                bookingStatus:true ,
                availability:true
            }
          });
          if (!property) {
             res.status(404).json({
              success: false,
              error: 'Property not found'
            });
            return
          }
          const availability = property.availability as PropertyAvailability | null;
     res.status(200).json({
        success: true,
            status: property.bookingStatus,
            blockedDates: availability?.blockedDates || []
      });
      return
    } catch (error) {
        console.error('Error fetching property status:', error);
         res.status(500).json({
          success: false,
          error: 'Failed to get property status',
          details: error instanceof Error ? error.message : 'Unknown error'
        });
        return
    }
}
export const checkBookingStatus = async ( req: AuthenticatedRequest , res: Response) => {
  try {
    const { propertyId } = req.params;
    const userId = req.user?.['userId'] || req.user?.['id'];

    if (!propertyId || isNaN(parseInt(propertyId))) {
       res.status(400).json({ error: "Invalid property ID" });
       return
    }

    if (!userId) {
       res.status(401).json({ error: "Unauthorized" });
       return
    }

    const booking = await prisma.booking.findFirst({
      where: {
        propertyId: parseInt(propertyId),
        userId: Number(userId),
        paymentStatus: "SUCCESSFUL",
        OR: [
          { checkoutDate: { gte: new Date() } },
          { 
            AND: [
              { moveInDate: { not: null } },
              { release_after: { gte: new Date() } }
            ]
          }
        ]
      },
      select: {
        id: true,
        bookingId: true,
        checkinDate: true,
        checkoutDate: true,
        moveInDate: true,
        release_after: true
      }
    });

    res.json({
      hasBooked: !!booking,
      bookingDetails: booking || null 
    });

  } catch (error) {
    console.error('Booking status check failed:', error);
    res.status(500).json({ 
      error: "Failed to check booking status",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
};