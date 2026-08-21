import { forwardRef, Module } from '@nestjs/common';
import { HabitsController } from './habits.controller';
import { HabitsService } from './habits.service';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { HabitLogService } from './habit-log/habit-log.service';
import { BullModule } from '@nestjs/bullmq';
import { HABITS_QUEUE } from 'src/common/queues/queue-names';
import { HabitTaskProcessor } from './consumers/habit-tasks.processor';
import { HabitsCacheRepository } from './repos/habit-cache.repo';
import { TasksCacheRepository } from '../tasks/repos/task-cache.repo';
import { TasksModule } from '../tasks/tasks.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: HABITS_QUEUE,
    }),
    forwardRef(() => TasksModule),
  ],
  controllers: [HabitsController],
  providers: [
    HabitsService,
    PrismaService,
    JwtService,
    HabitLogService,
    HabitTaskProcessor,
    HabitsCacheRepository,
    TasksCacheRepository,
  ],
  exports: [HabitsService],
})
export class HabitsModule {}
