/*
  Warnings:

  - A unique constraint covering the columns `[habitId,scheduledDate]` on the table `Task` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
ALTER TYPE "GoalStatus" ADD VALUE 'SCHEDULED';

-- CreateIndex
CREATE UNIQUE INDEX "Task_habitId_scheduledDate_key" ON "Task"("habitId", "scheduledDate");
