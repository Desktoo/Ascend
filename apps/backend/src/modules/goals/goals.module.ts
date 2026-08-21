import { forwardRef, Module } from '@nestjs/common';
import { GoalsService } from './goals.service';
import { GoalsController } from './goals.controller';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { GamificationService } from 'src/common/gamification/gamification.service';
import { HabitLogService } from '../habits/habit-log/habit-log.service';
import { JwtService } from '@nestjs/jwt';
import { TasksModule } from '../tasks/tasks.module';
import { GamificationModule } from 'src/common/gamification/gamification.module';
import { GoalLogsService } from './goal-logs/goal-logs.service';

@Module({
  imports: [forwardRef(() => TasksModule), GamificationModule],
  providers: [
    GoalsService,
    PrismaService,
    GamificationService,
    HabitLogService,
    JwtService,
    GoalLogsService,
  ],
  controllers: [GoalsController],
  exports: [GoalsService],
})
export class GoalsModule {}
