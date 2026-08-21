/*
  Warnings:

  - You are about to drop the column `dayStartReminder` on the `NotificationPreference` table. All the data in the column will be lost.
  - You are about to drop the column `inAppEnabled` on the `NotificationPreference` table. All the data in the column will be lost.
  - You are about to drop the column `rankChangeAlerts` on the `NotificationPreference` table. All the data in the column will be lost.
  - You are about to drop the column `reflectionReminder` on the `NotificationPreference` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "NotificationPreference" DROP COLUMN "dayStartReminder",
DROP COLUMN "inAppEnabled",
DROP COLUMN "rankChangeAlerts",
DROP COLUMN "reflectionReminder",
ADD COLUMN     "masterNotification" BOOLEAN NOT NULL DEFAULT true;
