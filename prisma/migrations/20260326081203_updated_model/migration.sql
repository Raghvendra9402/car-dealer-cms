/*
  Warnings:

  - You are about to drop the column `make` on the `CarListing` table. All the data in the column will be lost.
  - Added the required column `makeId` to the `CarListing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `modelId` to the `CarListing` table without a default value. This is not possible if the table is not empty.
  - Made the column `bodyType` on table `CarListing` required. This step will fail if there are existing NULL values in that column.
  - Made the column `seats` on table `CarListing` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "MakeName" AS ENUM ('TOYOTA', 'HONDA', 'HYUNDAI', 'SUZUKI', 'TATA', 'MAHINDRA', 'FORD', 'BMW', 'MERCEDES', 'AUDI', 'VOLKSWAGEN', 'KIA', 'NISSAN', 'TESLA', 'HUMMER');

-- DropIndex
DROP INDEX "CarListing_make_idx";

-- AlterTable
ALTER TABLE "CarListing" DROP COLUMN "make",
ADD COLUMN     "makeId" TEXT NOT NULL,
ADD COLUMN     "modelId" TEXT NOT NULL,
ALTER COLUMN "bodyType" SET NOT NULL,
ALTER COLUMN "seats" SET NOT NULL;

-- DropEnum
DROP TYPE "Make";

-- CreateTable
CREATE TABLE "Make" (
    "id" TEXT NOT NULL,
    "name" "MakeName" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Make_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Model" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "makeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Model_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CarListing_makeId_idx" ON "CarListing"("makeId");

-- CreateIndex
CREATE INDEX "CarListing_modelId_idx" ON "CarListing"("modelId");

-- AddForeignKey
ALTER TABLE "CarListing" ADD CONSTRAINT "CarListing_makeId_fkey" FOREIGN KEY ("makeId") REFERENCES "Make"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarListing" ADD CONSTRAINT "CarListing_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "Model"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Model" ADD CONSTRAINT "Model_makeId_fkey" FOREIGN KEY ("makeId") REFERENCES "Make"("id") ON DELETE CASCADE ON UPDATE CASCADE;
