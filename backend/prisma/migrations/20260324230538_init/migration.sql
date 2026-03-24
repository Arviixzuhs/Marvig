-- AlterTable
ALTER TABLE "Apartament" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "isDelete" BOOLEAN DEFAULT false;

-- AlterTable
ALTER TABLE "Employee" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "isDelete" BOOLEAN DEFAULT false;

-- AlterTable
ALTER TABLE "Reservation" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "isDelete" BOOLEAN DEFAULT false;
