-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "description" TEXT DEFAULT '',
ADD COLUMN     "featured" BOOLEAN NOT NULL DEFAULT false;
