/*
  Warnings:

  - You are about to drop the column `daysSKipped` on the `Goal` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Goal" DROP COLUMN "daysSKipped",
ADD COLUMN     "daysSkipped" INTEGER NOT NULL DEFAULT 0;
