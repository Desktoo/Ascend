import { Module } from '@nestjs/common';
import { GamificationService } from './gamification.service';
import { PrismaService } from '../prisma/prisma.service';
import { GamificationCacheRepository } from './repos/gamification-cache.repo';

@Module({
  providers: [GamificationService, PrismaService, GamificationCacheRepository],
  exports: [GamificationCacheRepository, GamificationService],
})
export class GamificationModule {}
