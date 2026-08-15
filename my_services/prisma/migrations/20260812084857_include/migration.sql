/*
  Warnings:

  - You are about to drop the column `isSeen` on the `SharedData` table. All the data in the column will be lost.
  - You are about to drop the column `sharedTo` on the `SharedData` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "SharedData_sharedTo_isSeen_idx";

-- AlterTable
ALTER TABLE "SharedData" DROP COLUMN "isSeen",
DROP COLUMN "sharedTo";

-- CreateTable
CREATE TABLE "SharedDataRecipient" (
    "sharedDataId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "SharedDataRecipient_pkey" PRIMARY KEY ("sharedDataId","userId")
);

-- AddForeignKey
ALTER TABLE "SharedDataRecipient" ADD CONSTRAINT "SharedDataRecipient_sharedDataId_fkey" FOREIGN KEY ("sharedDataId") REFERENCES "SharedData"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SharedDataRecipient" ADD CONSTRAINT "SharedDataRecipient_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
