-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "freeInstallments" INTEGER NOT NULL DEFAULT 12,
ADD COLUMN     "maxInstallments" INTEGER NOT NULL DEFAULT 12;
