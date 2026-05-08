/*
  Warnings:

  - You are about to drop the column `message` on the `Reservation` table. All the data in the column will be lost.
  - Added the required column `mobile` to the `Reservation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Reservation" DROP COLUMN "message",
ADD COLUMN     "mobile" TEXT NOT NULL;
