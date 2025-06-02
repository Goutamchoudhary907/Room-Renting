/*
  Warnings:

  - You are about to drop the column `formattedAddres` on the `properties` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "properties" DROP COLUMN "formattedAddres",
ADD COLUMN     "flatOrHouse" TEXT,
ADD COLUMN     "formattedAddress" TEXT,
ADD COLUMN     "landmark" TEXT,
ADD COLUMN     "locality" TEXT,
ALTER COLUMN "address" DROP NOT NULL;
