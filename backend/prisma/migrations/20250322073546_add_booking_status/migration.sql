-- CreateEnum
CREATE TYPE "BookingStatusEnum" AS ENUM ('AVAILABLE', 'BOOKED', 'UNAVAILABLE');

-- AlterTable
ALTER TABLE "properties" ADD COLUMN     "bookingStatus" "BookingStatusEnum" NOT NULL DEFAULT 'AVAILABLE';
ALTER TABLE "properties" ALTER COLUMN "maxGuests" DROP NOT NULL;
