import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class HealthService {
  private readonly logger = new Logger(HealthService.name);

  private lastAwakeTime: number = 0;

  private readonly WAKE_WINDOW = 3 * 60 * 1000;

  constructor(private readonly prisma: PrismaService) {}

  async warmDB(): Promise<{ status: string; message: string }> {
    const now = Date.now();

    // If we successfully queried the DB less than 3 minutes ago, skip the query!
    if (now - this.lastAwakeTime < this.WAKE_WINDOW) {
      return {
        status: 'skipped',
        message: 'Database is already assumed awake.',
      };
    }
    try {
      this.logger.log('Initiating database connection warming query');

      await this.prisma.client.$queryRaw`SELECT 1`;

      return { status: 'success', message: 'Database is awake and pooled' };
    } catch (error) {
      this.logger.error('Database Warming query failed', error);
      return { status: 'error', message: 'Database warm up sequence failed' };
    }
  }

  async wakeDBCronJob(): Promise<{ status: string; message: string }> {
    try {
      this.logger.log(
        'Cron heartbeat: Warming database serverless compute pool',
      );

      // Execute a completely direct, un-throttled raw query to keep compute warm
      await this.prisma.client.$queryRaw`SELECT 1`;

      return {
        status: 'success',
        message: 'Database compute forced warm successfully.',
      };
    } catch (error) {
      this.logger.error('Cron heartbeat failed to wake database', error);
      return { status: 'error', message: 'Database keep-alive ping failed.' };
    }
  }
}
