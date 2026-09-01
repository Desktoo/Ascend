// src/modules/notification/crons/notification.cron.ts
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { DispatchNotificationDto } from '../notification.types';
import { InAppProvider } from '../providers/in-app.provider';

@Injectable()
export class NotificationCron {
  private readonly logger = new Logger(NotificationCron.name);

  constructor(
    private readonly inAppProvider: InAppProvider,
    private readonly prisma: PrismaService,
    @InjectQueue('notification-queue')
    private readonly notificationQueue: Queue,
  ) {}

  // =======================================================================
  // 1. PRODUCTION CRON (Runs every hour)
  // =======================================================================
  @Cron(CronExpression.EVERY_HOUR)
  async scheduleDailyReminders() {
    this.logger.log('Running hourly reminder scheduler...');

    // Fetch users (You can add pagination or specific timezone filtering here)
    const targetUsers = await this.prisma.client.user.findMany({
      take: 100,
      select: { id: true, dayStartTime: true },
    });

    if (targetUsers.length === 0) return;

    this.logger.log(
      `Found ${targetUsers.length} users. Calculating dynamic schedules.`,
    );

    const bulkJobs: {
      name: string;
      data: DispatchNotificationDto;
      opts: any;
    }[] = [];

    for (const user of targetUsers) {
      // Fallback to 09:00 if the user hasn't configured a start time yet
      const timeString = user.dayStartTime || '09:00';
      const [startHour, startMinute] = timeString.split(':').map(Number);

      // Baseline: Today at the user's specific start time
      const startTarget = new Date();
      startTarget.setHours(startHour, startMinute, 0, 0);

      const midTarget = new Date(startTarget.getTime() + 6 * 60 * 60 * 1000); // +6 hours
      const endTarget = new Date(startTarget.getTime() + 12 * 60 * 60 * 1000); // +12 hours

      // Helper to calculate precise millisecond delay and handle next-day roll-over
      const getSchedulingOpts = (target: Date, prefix: string) => {
        let delay = target.getTime() - Date.now();
        let scheduleDate = target;

        // If the calculated time has already passed today, schedule it for exactly tomorrow
        if (delay < 0) {
          scheduleDate = new Date(target.getTime() + 24 * 60 * 60 * 1000);
          delay = scheduleDate.getTime() - Date.now();
        }

        const dateStamp = scheduleDate.toISOString().split('T')[0];
        return {
          delay,
          jobId: `${prefix}-${user.id}-${dateStamp}`, // Strict deduplication lock
          removeOnComplete: true,
          removeOnFail: false,
        };
      };

      // 1. Start Day
      bulkJobs.push({
        name: 'send-notification',
        data: {
          userId: user.id,
          category: 'REMINDER',
          templateId: 'REMINDER_START_DAY',
        },
        opts: getSchedulingOpts(startTarget, 'start-day'),
      });

      // 2. Mid Day
      bulkJobs.push({
        name: 'send-notification',
        data: {
          userId: user.id,
          category: 'REMINDER',
          templateId: 'REMINDER_MID_DAY',
        },
        opts: getSchedulingOpts(midTarget, 'mid-day'),
      });

      // 3. End Day
      bulkJobs.push({
        name: 'send-notification',
        data: {
          userId: user.id,
          category: 'REMINDER',
          templateId: 'REMINDER_END_DAY',
        },
        opts: getSchedulingOpts(endTarget, 'end-day'),
      });
    }

    await this.notificationQueue.addBulk(bulkJobs);
    this.logger.log(
      `Successfully scheduled ${bulkJobs.length} dynamic reminders.`,
    );
  }

  // =======================================================================
  // 2. TIME-TRAVEL TESTING CRON (Disable in Production!)
  // =======================================================================
  // @Cron(CronExpression.EVERY_10_SECONDS) // <-- UNCOMMENT TO TEST, THEN RE-COMMENT
  async testNotificationFlow() {
    this.logger.log(
      'RUNNING TEST CRON: Scheduling rapid-fire notifications...',
    );

    // For testing, just grab the first user in the DB to avoid spamming everyone
    const testUser = await this.prisma.client.user.findFirst({
      where: { pushSubscriptions: { some: {} } },
      select: { id: true },
    });

    if (!testUser) {
      this.logger.error('No users found to test against.');
      return;
    }

    const msInMinute = 10 * 1000;
    const testStamp = new Date().toISOString(); // Appending exact ISO so Job IDs are always unique for rapid testing

    const testJobs = [
      {
        name: 'send-notification',
        data: {
          userId: testUser.id,
          category: 'REMINDER',
          templateId: 'REMINDER_START_DAY',
        },
        opts: {
          delay: 1 * msInMinute, // Fires in 1 minute
          jobId: `test-start-${testUser.id}-${testStamp}`,
          removeOnComplete: true,
        },
      },
      {
        name: 'send-notification',
        data: {
          userId: testUser.id,
          category: 'REMINDER',
          templateId: 'REMINDER_MID_DAY',
        },
        opts: {
          delay: 2 * msInMinute, // Fires in 2 minutes
          jobId: `test-mid-${testUser.id}-${testStamp}`,
          removeOnComplete: true,
        },
      },
      {
        name: 'send-notification',
        data: {
          userId: testUser.id,
          category: 'REMINDER',
          templateId: 'REMINDER_END_DAY',
        },
        opts: {
          delay: 3 * msInMinute, // Fires in 3 minutes
          jobId: `test-end-${testUser.id}-${testStamp}`,
          removeOnComplete: true,
        },
      },
    ];

    await this.notificationQueue.addBulk(testJobs);
    this.logger.log(
      `Test jobs injected! Watch your worker process over the next 3 minutes.`,
    );
  }
}
