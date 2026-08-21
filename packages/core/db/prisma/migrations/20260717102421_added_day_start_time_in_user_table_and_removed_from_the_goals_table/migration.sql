/*
  Warnings:

  - You are about to drop the column `dayStartTime` on the `Goal` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Goal" DROP COLUMN "dayStartTime";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "dayStartTime" TEXT NOT NULL DEFAULT '09:00';
