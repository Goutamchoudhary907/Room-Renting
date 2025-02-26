/*
  Warnings:

  - You are about to drop the column `availablity` on the `properties` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "properties" DROP COLUMN "availablity",
ADD COLUMN     "availability" JSONB;
