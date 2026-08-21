/*
  Warnings:

  - You are about to drop the `TaskLog` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "TaskLog" DROP CONSTRAINT "TaskLog_taskId_fkey";

-- DropForeignKey
ALTER TABLE "TaskLog" DROP CONSTRAINT "TaskLog_userId_fkey";

-- DropTable
DROP TABLE "TaskLog";
