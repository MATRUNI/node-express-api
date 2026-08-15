/*
  Warnings:

  - Added the required column `expiresAt` to the `SharedData` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SharedData" ADD COLUMN     "expiresAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "data" SET DATA TYPE TEXT;

-- CreateIndex
CREATE INDEX "SharedData_expiresAt_idx" ON "SharedData"("expiresAt");

-- CreateIndex
CREATE INDEX "SharedDataRecipient_userId_idx" ON "SharedDataRecipient"("userId");
