import { Module } from '@nestjs/common';
import { HealthService } from './health.service';
import { HealthController } from './health.controller';
import { PrismaModule } from 'src/common/prisma/prisma.module';
import { HealthCron } from './health.cron';

@Module({
  imports: [PrismaModule],
  providers: [HealthService, HealthCron],
  controllers: [HealthController],
})
export class HealthModule {}
