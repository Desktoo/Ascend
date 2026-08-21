/*
  Warnings:

  - You are about to drop the column `deadline` on the `Goal` table. All the data in the column will be lost.
  - You are about to drop the column `durationDays` on the `Goal` table. All the data in the column will be lost.
  - You are about to drop the column `taskTitle` on the `Goal` table. All the data in the column will be lost.
  - Added the required column `timeFrame` to the `Goal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedTime` to the `Goal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weekendsExcluded` to the `Goal` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "HorizonType" AS ENUM ('WEEKLY', 'MONTHLY');

-- AlterTable
ALTER TABLE "Goal" DROP COLUMN "deadline",
DROP COLUMN "durationDays",
DROP COLUMN "taskTitle",
ADD COLUMN     "configeDaysPerWeek" INTEGER NOT NULL DEFAULT 5,
ADD COLUMN     "dayStartTime" TEXT NOT NULL DEFAULT '90:00',
ADD COLUMN     "monthlyWeekSprints" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "rewardText" TEXT,
ADD COLUMN     "timeFrame" "HorizonType" NOT NULL,
ADD COLUMN     "updatedTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "weekendsExcluded" BOOLEAN NOT NULL;

-- DropEnum
DROP TYPE "HabitStatus";

-- CreateTable
CREATE TABLE "TaskLog" (
    "id" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "goalId" TEXT,
    "habitId" TEXT,
    "title" TEXT NOT NULL,
    "taskType" "TaskType" NOT NULL,
    "priority" "PriorityLevel" NOT NULL,
    "dueTime" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TaskLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TaskLog_userId_idx" ON "TaskLog"("userId");

-- CreateIndex
CREATE INDEX "TaskLog_goalId_idx" ON "TaskLog"("goalId");

-- CreateIndex
CREATE INDEX "TaskLog_habitId_idx" ON "TaskLog"("habitId");

-- CreateIndex
CREATE INDEX "TaskLog_completedAt_idx" ON "TaskLog"("completedAt");

-- AddForeignKey
ALTER TABLE "TaskLog" ADD CONSTRAINT "TaskLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskLog" ADD CONSTRAINT "TaskLog_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
