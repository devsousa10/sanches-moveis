/*
  Warnings:

  - You are about to drop the column `active` on the `Coupon` table. All the data in the column will be lost.
  - You are about to drop the column `percent` on the `Coupon` table. All the data in the column will be lost.
  - Added the required column `discount` to the `Coupon` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Coupon` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Coupon" DROP COLUMN "active",
DROP COLUMN "percent",
ADD COLUMN     "discount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "expiresAt" TIMESTAMP(3),
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "maxUses" INTEGER,
ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'PERCENT',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "usedCount" INTEGER NOT NULL DEFAULT 0;
