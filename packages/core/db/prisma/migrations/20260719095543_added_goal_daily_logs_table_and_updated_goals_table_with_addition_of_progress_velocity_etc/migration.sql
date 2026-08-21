-- AlterTable
ALTER TABLE "Goal" ADD COLUMN     "currentProgress" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "currentVelocity" INTEGER NOT NULL DEFAULT 100,
ADD COLUMN     "totalActiveDays" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "GoalDailyLog" (
    "id" TEXT NOT NULL,
    "goalId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "wasSuccessful" BOOLEAN NOT NULL,
    "progressAtDate" INTEGER NOT NULL,
    "VelocityAtDate" INTEGER NOT NULL,
    "tasksSnapshot" JSONB NOT NULL,

    CONSTRAINT "GoalDailyLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "GoalDailyLog_goalId_idx" ON "GoalDailyLog"("goalId");

-- CreateIndex
CREATE UNIQUE INDEX "GoalDailyLog_goalId_date_key" ON "GoalDailyLog"("goalId", "date");

-- AddForeignKey
ALTER TABLE "GoalDailyLog" ADD CONSTRAINT "GoalDailyLog_goalId_fkey" FOREIGN KEY ("goalId") REFERENCES "Goal"("id") ON DELETE CASCADE ON UPDATE CASCADE;
