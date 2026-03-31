/*
  Warnings:

  - You are about to drop the column `apartmentId` on the `Reservation` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Reservation" DROP CONSTRAINT "Reservation_apartmentId_fkey";

-- DropIndex
DROP INDEX "Reservation_apartmentId_idx";

-- AlterTable
ALTER TABLE "Apartment" ADD COLUMN     "pricePerDay" DECIMAL(10,2) NOT NULL DEFAULT 60,
ADD COLUMN     "promotionId" INTEGER;

-- AlterTable
ALTER TABLE "Reservation" DROP COLUMN "apartmentId",
ADD COLUMN     "persons" INTEGER NOT NULL DEFAULT 1;

-- CreateTable
CREATE TABLE "Payment" (
    "id" SERIAL NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "description" VARCHAR(200),
    "reservationId" INTEGER NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Promotion" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "isDeleted" BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "description" VARCHAR(200),

    CONSTRAINT "Promotion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ApartmentToReservation" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ApartmentToReservation_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ApartmentToReservation_B_index" ON "_ApartmentToReservation"("B");

-- AddForeignKey
ALTER TABLE "Apartment" ADD CONSTRAINT "Apartment_promotionId_fkey" FOREIGN KEY ("promotionId") REFERENCES "Promotion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "Reservation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ApartmentToReservation" ADD CONSTRAINT "_ApartmentToReservation_A_fkey" FOREIGN KEY ("A") REFERENCES "Apartment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ApartmentToReservation" ADD CONSTRAINT "_ApartmentToReservation_B_fkey" FOREIGN KEY ("B") REFERENCES "Reservation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
