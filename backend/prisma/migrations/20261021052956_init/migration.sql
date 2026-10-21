-- CreateEnum
CREATE TYPE "SeasonType" AS ENUM ('LOW', 'HIGH', 'MEDIUM', 'SPECIAL');

-- CreateEnum
CREATE TYPE "PriceModifierType" AS ENUM ('INCREASE', 'DECREASE');

-- CreateEnum
CREATE TYPE "AdjustmentUnit" AS ENUM ('PERCENTAGE', 'FIXED_AMOUNT');

-- AlterTable
ALTER TABLE "Apartment" ADD COLUMN     "seasonId" INTEGER;

-- CreateTable
CREATE TABLE "Season" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "value" DECIMAL(10,2) NOT NULL,
    "unit" "AdjustmentUnit" NOT NULL DEFAULT 'PERCENTAGE',
    "action" "PriceModifierType" NOT NULL DEFAULT 'INCREASE',
    "type" "SeasonType" NOT NULL DEFAULT 'HIGH',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Season_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Season_startDate_endDate_idx" ON "Season"("startDate", "endDate");

-- CreateIndex
CREATE INDEX "Season_isActive_idx" ON "Season"("isActive");

-- AddForeignKey
ALTER TABLE "Apartment" ADD CONSTRAINT "Apartment_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "Season"("id") ON DELETE SET NULL ON UPDATE CASCADE;
