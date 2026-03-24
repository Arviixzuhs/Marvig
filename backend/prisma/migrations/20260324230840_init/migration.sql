/*
  Warnings:

  - You are about to drop the column `isDelete` on the `Apartament` table. All the data in the column will be lost.
  - You are about to drop the column `isDelete` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `isDelete` on the `Reservation` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Apartament" DROP COLUMN "isDelete",
ADD COLUMN     "isDeleted" BOOLEAN DEFAULT false;

-- AlterTable
ALTER TABLE "Employee" DROP COLUMN "isDelete",
ADD COLUMN     "isDeleted" BOOLEAN DEFAULT false;

-- AlterTable
ALTER TABLE "Reservation" DROP COLUMN "isDelete",
ADD COLUMN     "isDeleted" BOOLEAN DEFAULT false;
