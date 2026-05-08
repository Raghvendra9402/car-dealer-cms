/*
  Warnings:

  - You are about to alter the column `odometer_reading` on the `CarListing` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- AlterTable
ALTER TABLE "CarListing" ALTER COLUMN "odometer_reading" SET DATA TYPE INTEGER;
