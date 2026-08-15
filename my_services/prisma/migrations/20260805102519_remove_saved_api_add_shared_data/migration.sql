/*
  Warnings:

  - You are about to drop the column `savedAPI` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "savedAPI";

-- CreateTable
CREATE TABLE "SharedData" (
    "ownerId" TEXT NOT NULL,
    "sharedTo" TEXT,
    "data" BYTEA NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SharedData_pkey" PRIMARY KEY ("ownerId")
);

-- AddForeignKey
ALTER TABLE "SharedData" ADD CONSTRAINT "SharedData_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
