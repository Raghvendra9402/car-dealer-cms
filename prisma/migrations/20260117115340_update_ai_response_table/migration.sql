/*
  Warnings:

  - You are about to drop the column `userId` on the `AIResponse` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "AIResponse_userId_idx";

-- AlterTable
ALTER TABLE "AIResponse" DROP COLUMN "userId";
