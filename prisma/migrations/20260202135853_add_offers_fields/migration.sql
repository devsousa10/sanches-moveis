/*
  Warnings:

  - You are about to drop the column `discount` on the `Coupon` table. All the data in the column will be lost.
  - You are about to drop the column `maxUses` on the `Coupon` table. All the data in the column will be lost.
  - You are about to drop the column `minPurchase` on the `Coupon` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Coupon` table. All the data in the column will be lost.
  - You are about to drop the column `material` on the `Product` table. All the data in the column will be lost.
  - Added the required column `discountValue` to the `Coupon` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `StoreSettings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Coupon" DROP COLUMN "discount",
DROP COLUMN "maxUses",
DROP COLUMN "minPurchase",
DROP COLUMN "type",
ADD COLUMN     "discountType" TEXT NOT NULL DEFAULT 'PERCENT',
ADD COLUMN     "discountValue" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "minOrderValue" DECIMAL(10,2),
ADD COLUMN     "usageLimit" INTEGER;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "material",
ADD COLUMN     "isOffer" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "offerExpiresAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Review" ALTER COLUMN "comment" DROP NOT NULL;

-- AlterTable
ALTER TABLE "StoreSettings" ADD COLUMN     "bannerUrl" TEXT,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "secondaryColor" TEXT NOT NULL DEFAULT '#000000',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "phone" DROP NOT NULL,
ALTER COLUMN "phone" DROP DEFAULT,
ALTER COLUMN "address" DROP NOT NULL,
ALTER COLUMN "address" DROP DEFAULT,
ALTER COLUMN "primaryColor" SET DEFAULT '#EAB308',
ALTER COLUMN "logoUrl" DROP NOT NULL,
ALTER COLUMN "logoUrl" DROP DEFAULT;
