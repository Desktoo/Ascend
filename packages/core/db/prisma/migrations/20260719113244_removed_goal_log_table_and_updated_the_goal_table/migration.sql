/*
  Warnings:

  - You are about to drop the `GoalDailyLog` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "GoalDailyLog" DROP CONSTRAINT "GoalDailyLog_goalId_fkey";

-- DropTable
DROP TABLE "GoalDailyLog";
