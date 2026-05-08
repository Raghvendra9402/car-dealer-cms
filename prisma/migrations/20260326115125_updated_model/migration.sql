/*
  Warnings:

  - A unique constraint covering the columns `[name,makeId]` on the table `Model` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Model_name_makeId_key" ON "Model"("name", "makeId");
