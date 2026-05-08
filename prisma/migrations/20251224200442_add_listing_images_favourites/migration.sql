-- CreateEnum
CREATE TYPE "Role" AS ENUM ('BUYER', 'SELLER');

-- CreateEnum
CREATE TYPE "ModelTransMission" AS ENUM ('AUTOMATIC', 'MANUAL');

-- CreateEnum
CREATE TYPE "ModelFuelType" AS ENUM ('PETROL', 'DIESEL', 'HYBRID', 'ELECTRIC');

-- CreateEnum
CREATE TYPE "ListingStatus" AS ENUM ('ACTIVE', 'SOLD');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "Role" NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CarListing" (
    "id" TEXT NOT NULL,
    "car_year" INTEGER NOT NULL,
    "car_name" TEXT NOT NULL,
    "description" TEXT,
    "odometer_reading" BIGINT NOT NULL,
    "transmission" "ModelTransMission" NOT NULL,
    "fuelType" "ModelFuelType" NOT NULL,
    "color" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "status" "ListingStatus" NOT NULL DEFAULT 'ACTIVE',
    "sellerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CarListing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ListingImage" (
    "id" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,

    CONSTRAINT "ListingImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Favourites" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,

    CONSTRAINT "Favourites_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CarListing_price_idx" ON "CarListing"("price");

-- CreateIndex
CREATE INDEX "CarListing_transmission_idx" ON "CarListing"("transmission");

-- CreateIndex
CREATE INDEX "CarListing_fuelType_idx" ON "CarListing"("fuelType");

-- CreateIndex
CREATE INDEX "CarListing_location_idx" ON "CarListing"("location");

-- CreateIndex
CREATE INDEX "CarListing_odometer_reading_idx" ON "CarListing"("odometer_reading");

-- CreateIndex
CREATE UNIQUE INDEX "Favourites_listingId_userId_key" ON "Favourites"("listingId", "userId");

-- AddForeignKey
ALTER TABLE "CarListing" ADD CONSTRAINT "CarListing_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListingImage" ADD CONSTRAINT "ListingImage_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "CarListing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favourites" ADD CONSTRAINT "Favourites_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favourites" ADD CONSTRAINT "Favourites_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "CarListing"("id") ON DELETE CASCADE ON UPDATE CASCADE;
