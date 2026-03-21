/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `discount` on the `Coupon` table. All the data in the column will be lost.
  - You are about to drop the column `maxUses` on the `Coupon` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Coupon` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Coupon` table. All the data in the column will be lost.
  - You are about to drop the column `freeShippingMin` on the `StoreSettings` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `StoreSettings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Address" DROP COLUMN "createdAt";

-- AlterTable
ALTER TABLE "Coupon" DROP COLUMN "discount",
DROP COLUMN "maxUses",
DROP COLUMN "type",
DROP COLUMN "updatedAt",
ADD COLUMN     "discountPercent" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "minPurchase" DECIMAL(10,2),
ADD COLUMN     "usageLimit" INTEGER;

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "material" DROP DEFAULT;

-- AlterTable
ALTER TABLE "StoreSettings" DROP COLUMN "freeShippingMin",
DROP COLUMN "updatedAt",
ADD COLUMN     "logoUrl" TEXT NOT NULL DEFAULT '';

-- CreateTable
CREATE TABLE "Review" (
    "id" SERIAL NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
