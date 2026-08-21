/*
  Warnings:

  - Added the required column `targetDays` to the `Goal` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Goal" ADD COLUMN     "completedDays" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "targetDays" INTEGER NOT NULL;
