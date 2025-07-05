import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, AuthenticatedRequest } from '../../middleware/middleware.js';

const router = express.Router();
const prisma = new PrismaClient();

interface PropertyAvailabilityDB {
  blockedDates?: Array<{
    start: string;
    end: string;
  }>;
}

interface PropertyAvailability {
  blockedDates?: Array<{
    start: Date;
    end: Date;
  }>;
}

router.get('/:propertyId', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const property = await prisma.property.findFirst({
      where: {
        id: parseInt(req.params.propertyId),
        hostId: req.user?.id
      },
      select: { availability: true }
    });

    if (!property) {
       res.status(404).json({ error: 'Property not found or unauthorized' });
       return
    }

    const rawAvailability = property.availability as PropertyAvailabilityDB | null;

    const availability: PropertyAvailability = {
      blockedDates: rawAvailability?.blockedDates?.map(d => ({
        start: new Date(d.start),
        end: new Date(d.end)
      })) || []
    };

    res.json(availability.blockedDates);
  } catch (error) {
    console.error('Error fetching availability:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.post('/:propertyId', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  const { start, end, action } = req.body;
  const propertyId = parseInt(req.params.propertyId);

  try {
    const property = await prisma.property.findFirst({
      where: {
        id: propertyId,
        hostId: req.user?.id
      },
      select: { availability: true }
    });

    if (!property) {
       res.status(403).json({ error: 'Unauthorized' });
       return
    }

    // Parse and normalize current availability
    const currentAvailability: PropertyAvailabilityDB =
      property.availability && typeof property.availability === 'object' && 'blockedDates' in property.availability
        ? property.availability as PropertyAvailabilityDB
        : { blockedDates: [] };

    const newAvailability: PropertyAvailabilityDB = {
      blockedDates: [...(currentAvailability.blockedDates || [])]
    };

    const newStartISO = new Date(start).toISOString();
    const newEndISO = new Date(end).toISOString();

    if (action === 'block') {
      newAvailability.blockedDates?.push({ start: newStartISO, end: newEndISO });
    } else if (action === 'release') {
      newAvailability.blockedDates = newAvailability.blockedDates?.filter(
        d => d.start !== newStartISO || d.end !== newEndISO
      );
    } else {
       res.status(400).json({ error: 'Invalid action. Use "block" or "release"' });
    return 
    }

   await prisma.property.update({
  where: { id: propertyId },
  data: { availability: JSON.parse(JSON.stringify(newAvailability)) }
});


    res.json({ success: true });
  } catch (error) {
    console.error('Error updating availability:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
