import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface AvailabilityResult {
  available: boolean;
  conflict?: {
    id: number;
    bookingId: string;
    checkinDate: Date | null;
    checkoutDate: Date | null;
    moveInDate: Date | null;
    leaseDuration: number | null;
  };
}

interface PropertyAvailability {
  blockedDates?: Array<{
    start: Date;
    end: Date;
  }>;
}

export async function checkPropertyAvailability(
  propertyId: number,
  dates: { start: Date; end: Date },
  rentalType: 'short-term' | 'long-term'
): Promise<AvailabilityResult> {
  // 1. Get all successful bookings for the property
  const property = await prisma.property.findUnique({
    where: { id: propertyId },
    include: {
      bookings: {
        where: { paymentStatus: 'SUCCESSFUL' }
      }
    }
  });

  if (!property) return { available: false };

  // 2. Check against ALL bookings regardless of rental type
  for (const booking of property.bookings) {
    let bookingStart: Date | null = null;
    let bookingEnd: Date | null = null;

    // Determine booking dates based on rental type
    if (booking.rentalType === 'short-term' && booking.checkinDate && booking.checkoutDate) {
      bookingStart = new Date(booking.checkinDate);
      bookingEnd = new Date(booking.checkoutDate);
    } 
    else if (booking.rentalType === 'long-term' && booking.moveInDate) {
  bookingStart = new Date(booking.moveInDate);
  const months = booking.leaseDuration || 1;
  bookingEnd = new Date(bookingStart);
  bookingEnd.setMonth(bookingEnd.getMonth() + months);
}


    // Check date overlap
   if (bookingStart && bookingEnd) {
  const isConflict =
    dates.start < bookingEnd && dates.end > bookingStart;


      if (isConflict) {
        return {
          available: false,
          conflict: {
            id: booking.id,
            bookingId: booking.bookingId,
            checkinDate: booking.checkinDate,
            checkoutDate: booking.checkoutDate,
            moveInDate: booking.moveInDate,
            leaseDuration: booking.leaseDuration
          }
        };
      }
    }
  }

  return { available: true };
}
export async function updatePropertyAvailability(
  propertyId: number,
  dates: { start: Date; end: Date },
  action: 'block' | 'release'
) {
   // 1. Get current availabilitywhat i 
  const property= await prisma.property.findUnique({
    where:{id:propertyId},
    select:{availability:true}
  });

  function parseAvailability(raw: any): PropertyAvailability {
  if (!raw?.blockedDates) return { blockedDates: [] };

  return {
    blockedDates: raw.blockedDates.map((d: any) => ({
      start: new Date(d.start),
      end: new Date(d.end)
    }))
  };
}

    // 2. Parse current availability (with type safety)
  const currentAvailability: PropertyAvailability = property?.availability 
    ? parseAvailability(property.availability)
    : { blockedDates: [] };



  // 3. Create new availability object
  const newAvailability: PropertyAvailability = {
    blockedDates: [...(currentAvailability.blockedDates || [])]
  };

   // 4. Update based on action
   if (action === 'block') {
    newAvailability.blockedDates = newAvailability.blockedDates || [];
    newAvailability.blockedDates.push({
      start: dates.start,
      end: dates.end
    });
  }else {
  newAvailability.blockedDates = (newAvailability.blockedDates || []).filter(
    d => !(
      new Date(d.start).getTime() === dates.start.getTime() &&
      new Date(d.end).getTime() === dates.end.getTime()
    )
  );
}

  // 5. Save back to database
  await prisma.property.update({
    where: { id: propertyId },
    data: { availability: JSON.parse(JSON.stringify(newAvailability)) }
  });
  
}