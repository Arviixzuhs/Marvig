/*
  Warnings:

  - Made the column `userTargetRole` on table `Notification` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Notification" ALTER COLUMN "userTargetRole" SET NOT NULL,
ALTER COLUMN "userTargetRole" SET DEFAULT 'USER';
