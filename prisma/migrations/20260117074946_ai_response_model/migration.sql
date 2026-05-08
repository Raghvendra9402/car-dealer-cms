-- CreateEnum
CREATE TYPE "AIResponseStatus" AS ENUM ('PENDING', 'DONE', 'ERROR');

-- CreateTable
CREATE TABLE "AIResponse" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "AIResponseStatus" NOT NULL DEFAULT 'PENDING',
    "result" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AIResponse_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AIResponse_userId_idx" ON "AIResponse"("userId");
