-- CreateEnum
CREATE TYPE "BodyType" AS ENUM ('SEDAN', 'HATCHBACK', 'SUV', 'COUPE', 'CONVERTIBLE', 'PICKUP', 'VAN', 'MINIVAN', 'WAGON', 'SPORTS_CAR', 'CROSSOVER', 'ROADSTER', 'OFF_ROAD');

-- CreateEnum
CREATE TYPE "Make" AS ENUM ('TOYOTA', 'HONDA', 'HYUNDAI', 'SUZUKI', 'TATA', 'MAHINDRA', 'FORD', 'BMW', 'MERCEDES', 'AUDI', 'VOLKSWAGEN', 'KIA', 'NISSAN', 'TESLA', 'HUMMER');

-- AlterEnum
ALTER TYPE "ModelFuelType" ADD VALUE 'CNG';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ModelTransMission" ADD VALUE 'AMT';
ALTER TYPE "ModelTransMission" ADD VALUE 'CVT';
ALTER TYPE "ModelTransMission" ADD VALUE 'DCT';

-- AlterTable
ALTER TABLE "CarListing" ADD COLUMN     "bodyType" "BodyType",
ADD COLUMN     "make" "Make",
ADD COLUMN     "seats" INTEGER,
ADD COLUMN     "tags" TEXT[];

-- CreateIndex
CREATE INDEX "CarListing_make_idx" ON "CarListing"("make");

-- CreateIndex
CREATE INDEX "CarListing_bodyType_idx" ON "CarListing"("bodyType");

-- CreateIndex
CREATE INDEX "CarListing_tags_idx" ON "CarListing"("tags");
