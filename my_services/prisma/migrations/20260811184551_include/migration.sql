/*
  Warnings:

  - The primary key for the `SharedData` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The required column `id` was added to the `SharedData` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "SharedData" DROP CONSTRAINT "SharedData_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "SharedData_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE INDEX "SharedData_sharedTo_isSeen_idx" ON "SharedData"("sharedTo", "isSeen");
