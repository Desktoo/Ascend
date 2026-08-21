import { Injectable, Logger } from '@nestjs/common';
import { HealthService } from './health.service';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class HealthCron {
  private readonly logger = new Logger(HealthCron.name);

  constructor(private readonly healthService: HealthService) {}

  @Cron('*/4 * * * *')
  async wakeDB() {
    this.logger.log(`Executing automated DB waking call cron task...`);

    const res = await this.healthService.wakeDBCronJob();

    this.logger.log(`Cron execution outcome: ${res.status} - ${res.message}`);
  }
}
