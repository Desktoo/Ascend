// src/modules/notification/crons/notification.cron.ts
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { DispatchNotificationDto } from '../notification.types';

@Injectable()
export class NotificationCron {
  private readonly logger = new Logger(NotificationCron.name);

  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue('notification-queue')
    private readonly notificationQueue: Queue,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async scheduleDailyReminders() {
    this.logger.log('Running hourly reminder scheduler...');

    // 1. Fetch users. (Add your timezone/time-window logic here)
    const targetUsers = await this.prisma.client.user.findMany({
      // where: { dayStartTime: '09:00' },
      take: 100, // Batching is good practice
      select: { id: true },
    });

    if (targetUsers.length === 0) return;

    this.logger.log(`Found ${targetUsers.length} users. Scheduling jobs.`);

    const msInHour = 0 * 60 * 1000;
    const bulkJobs: {
      name: string;
      data: DispatchNotificationDto;
      opts: any;
    }[] = [];

    // Create a unique date string (e.g., "2026-08-16") to construct unique Job IDs
    const dateStamp = new Date().toISOString().split('T')[0];

    // 2. Prepare the jobs with strict Job IDs for deduplication
    for (const user of targetUsers) {
      // Start Day (+24 Hours)
      bulkJobs.push({
        name: 'send-notification',
        data: {
          userId: user.id,
          category: 'REMINDER',
          templateId: 'START_DAY',
        },
        opts: {
          delay: 24 * msInHour,
          jobId: `start-day-${user.id}-${dateStamp}`, // <-- CRITICAL: Prevents duplicate scheduling
          removeOnComplete: true, // Keep Redis memory clean
          removeOnFail: false, // Keep failed jobs for debugging
        },
      });

      // Mid Day (+30 Hours)
      bulkJobs.push({
        name: 'send-notification',
        data: {
          userId: user.id,
          category: 'REMINDER',
          templateId: 'MID_DAY',
        },
        opts: {
          delay: 30 * msInHour,
          jobId: `mid-day-${user.id}-${dateStamp}`,
          removeOnComplete: true,
        },
      });

      // End Day (+36 Hours)
      bulkJobs.push({
        name: 'send-notification',
        data: {
          userId: user.id,
          category: 'REMINDER',
          templateId: 'END_DAY',
        },
        opts: {
          delay: 36 * msInHour,
          jobId: `end-day-${user.id}-${dateStamp}`,
          removeOnComplete: true,
        },
      });
    }

    // 3. Push all delayed jobs to BullMQ in a single Redis pipeline
    await this.notificationQueue.addBulk(bulkJobs);
    this.logger.log(
      `Successfully scheduled ${bulkJobs.length} delayed reminders.`,
    );
  }
}
