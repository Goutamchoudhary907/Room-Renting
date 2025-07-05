import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();
const CRON_SECRET = process.env.CRON_SECRET;

function verifyCronAuth(req: Request, res: Response, next: Function) {
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== CRON_SECRET) {
     res.status(401).json({ message: 'Unauthorized' });
     return
  }
  next();
}

router.post("/update-availability", verifyCronAuth, async (req: Request, res: Response) => {
  try {
    const now = new Date();
    const bookingsToRelease = await prisma.booking.findMany({
      where: {
        checkoutDate: {
          lt: now,
        },
        property: {
          bookingStatus: 'BOOKED',
        },
      },
      select: {
        propertyId: true,
      },
    });

   const propertyIdsToUpdate = bookingsToRelease.map((b: { propertyId: number }) => b.propertyId);

    const updated = await prisma.property.updateMany({
      where: {
        id: { in: propertyIdsToUpdate },
        bookingStatus: 'BOOKED',
      },
      data: {
        bookingStatus: 'AVAILABLE',
      },
    });

    res.json({
      message: "Booking status updated",
      updatedProperties: updated.count,
    });
  } catch (err) {
    console.error("Cron job failed:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await prisma.$disconnect();
  }
});

export default router;
