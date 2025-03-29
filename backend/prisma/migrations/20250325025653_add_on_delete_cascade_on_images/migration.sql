-- DropForeignKey
ALTER TABLE "images" DROP CONSTRAINT "images_propertyId_fkey";

-- AddForeignKey
ALTER TABLE "images" ADD CONSTRAINT "images_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;
