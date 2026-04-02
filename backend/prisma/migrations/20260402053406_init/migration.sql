/*
  Warnings:

  - Added the required column `type` to the `Promotion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `value` to the `Promotion` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PromotionType" AS ENUM ('FIXED', 'PERCENTAGE');

-- AlterTable
ALTER TABLE "Promotion" ADD COLUMN     "type" "PromotionType" NOT NULL,
ADD COLUMN     "value" DECIMAL(10,2) NOT NULL;
