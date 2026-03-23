-- CreateEnum
CREATE TYPE "ApartmentStatus" AS ENUM ('OCCUPIED', 'RESERVED', 'AVAILABLE', 'MAINTENANCE');

-- CreateEnum
CREATE TYPE "ReservationStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "RentalType" AS ENUM ('FIXED_SEASON', 'DAILY');

-- CreateTable
CREATE TABLE "Apartament" (
    "id" SERIAL NOT NULL,
    "floor" INTEGER NOT NULL,
    "number" VARCHAR(50) NOT NULL,
    "status" "ApartmentStatus" NOT NULL DEFAULT 'AVAILABLE',
    "bedrooms" INTEGER NOT NULL DEFAULT 1,
    "bathrooms" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "squareMeters" DOUBLE PRECISION,

    CONSTRAINT "Apartament_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApartmentImage" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "apartamentId" INTEGER NOT NULL,

    CONSTRAINT "ApartmentImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reservation" (
    "id" SERIAL NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "type" "RentalType" NOT NULL DEFAULT 'DAILY',
    "status" "ReservationStatus" NOT NULL DEFAULT 'PENDING',
    "totalPrice" DECIMAL(10,2) NOT NULL,
    "userId" INTEGER NOT NULL,
    "apartamentId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reservation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Apartament_number_key" ON "Apartament"("number");

-- CreateIndex
CREATE INDEX "Reservation_userId_idx" ON "Reservation"("userId");

-- CreateIndex
CREATE INDEX "Reservation_apartamentId_idx" ON "Reservation"("apartamentId");

-- AddForeignKey
ALTER TABLE "ApartmentImage" ADD CONSTRAINT "ApartmentImage_apartamentId_fkey" FOREIGN KEY ("apartamentId") REFERENCES "Apartament"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_apartamentId_fkey" FOREIGN KEY ("apartamentId") REFERENCES "Apartament"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
