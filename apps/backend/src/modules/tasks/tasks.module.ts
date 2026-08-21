import { forwardRef, Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { AuthModule } from '../auth/auth.module';
import { AuthGaurd } from 'src/common/gaurds/auth.gaurds';
import { JwtService } from '@nestjs/jwt';
import { GamificationService } from 'src/common/gamification/gamification.service';
import { HabitLogService } from '../habits/habit-log/habit-log.service';
import { TasksCacheRepository } from './repos/task-cache.repo';
import { GamificationCacheRepository } from 'src/common/gamification/repos/gamification-cache.repo';
import { GoalsModule } from '../goals/goals.module';
import { HabitsModule } from '../habits/habits.module';
import { TaskLogService } from './task-logs/task-logs.service';
import { DynamoDbService } from 'src/common/dynamo-db/dynamo-db.service';
import { GamificationModule } from 'src/common/gamification/gamification.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    forwardRef(() => UserModule),
    forwardRef(() => AuthModule),
    GamificationModule,
    forwardRef(() => GoalsModule),
    forwardRef(() => HabitsModule),
  ],
  providers: [
    TasksService,
    PrismaService,
    AuthGaurd,
    JwtService,
    TasksCacheRepository,
    GamificationCacheRepository,
    GamificationService,
    HabitLogService,
    TaskLogService,
    DynamoDbService,
  ],
  controllers: [TasksController],
  exports: [
    TasksService,
    TaskLogService,
    TasksCacheRepository,
    GamificationCacheRepository,
  ],
})
export class TasksModule {}
