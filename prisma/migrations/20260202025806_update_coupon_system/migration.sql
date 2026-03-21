/*
  Warnings:

  - You are about to drop the column `discountPercent` on the `Coupon` table. All the data in the column will be lost.
  - You are about to drop the column `usageLimit` on the `Coupon` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Coupon" DROP COLUMN "discountPercent",
DROP COLUMN "usageLimit",
ADD COLUMN     "discount" DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN     "maxUses" INTEGER,
ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'PERCENT';
