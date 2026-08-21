import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { TaskDTO } from './dto/tasks.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { RedisCacheService } from 'src/common/redis-cache/redis-cache.service';
import {
  getTaskXp,
  TASK_XP,
} from 'src/common/gamification/constants/xpCalculator';
import { GamificationService } from 'src/common/gamification/gamification.service';
import { HabitLogService } from '../habits/habit-log/habit-log.service';
import { Prisma } from '@day-mark/db';
import { getLocalDateBounds } from 'src/common/utils/time.utils';
import { TasksCacheRepository } from './repos/task-cache.repo';
import { GamificationCacheRepository } from 'src/common/gamification/repos/gamification-cache.repo';
import { HabitsService } from '../habits/habits.service';
import { TaskLogService } from './task-logs/task-logs.service';
import { GoalsService } from '../goals/goals.service';
import { HistoricalDayLog } from 'src/common/types/types';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisCacheService,
    private readonly gamification: GamificationService,
    private readonly taskCache: TasksCacheRepository,
    private readonly gamificationCache: GamificationCacheRepository,
    private readonly habitLogService: HabitLogService,
    private readonly habitService: HabitsService,
    private readonly taskLogService: TaskLogService,
    @Inject(forwardRef(() => GoalsService))
    private readonly goalsService: GoalsService,
  ) {}

  private getCacheKey(userId: string): string {
    return `user:${userId}:tasks`;
  }

  async createTask(
    userId: string,
    data: TaskDTO,
    timeZone: string,
    tx?: Prisma.TransactionClient,
  ) {
    // 1. Mutex Check: A task shouldn't belong to both a habit and a goal simultaneously
    if (data.habitId && data.goalId) {
      throw new BadRequestException(
        'A task cannot belong to both a Habit and a Goal simultaneously.',
      );
    }

    let resolvedTimeZone = timeZone;

    const prismaClient = tx || this.prisma.client;

    if (!resolvedTimeZone) {
      const user = await prismaClient.user.findUnique({
        where: { id: userId },
        select: { timeZone: true },
      });
      resolvedTimeZone = user?.timeZone || 'Asia/Kolkata';
    }

    let scheduledDate: string | undefined;
    let computedDueTimeUtc = data.dueTime;

    if (data.dueTime) {
      const rawDate = new Date(data.dueTime);

      const formatter = new Intl.DateTimeFormat('en-CA', {
        timeZone: resolvedTimeZone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
      scheduledDate = formatter.format(rawDate); // Returns "YYYY-MM-DD" cleanly

      // 2. Ensure dueTime is a valid JavaScript Date object
      computedDueTimeUtc = rawDate;
    }
    const taskType = data.type || 'Standard';

    const newTask = await prismaClient.task.create({
      data: {
        userId,
        title: data.title,
        habitId: data.habitId,
        goalId: data.goalId,
        priority: data.priority,
        scheduledDate,
        dueTime: computedDueTimeUtc,
        type: taskType,
      },
    });

    try {
      await this.taskCache.setTaskMetaData(newTask.id, {
        type: taskType,
        parentId: data.habitId || data.goalId,
      });
    } catch (error) {
      console.error(
        `[Cache Error] Failed to write metadata for task: ${newTask.id}`,
        error,
      );
    }

    await this.redis.del(this.getCacheKey(userId));

    return newTask;
  }

  async getAllTasks(userId: string) {
    const cacheKey = this.getCacheKey(userId);

    try {
      const cachedTasks = await this.redis.get(cacheKey);
      if (cachedTasks) {
        return JSON.parse(cachedTasks) as unknown[];
      }
    } catch (redisError) {
      console.error('Redis read failure, switching to Prisma:', redisError);
    }

    // Cache miss - Fetch data securely from DB
    const DBTasks = await this.prisma.client.task.findMany({
      where: {
        userId: userId,
      },
    });

    try {
      // Cache the result for future requests (TTL: 1 hour)
      await this.redis.set(cacheKey, DBTasks, 3600);
    } catch (redisError) {
      console.error(
        'Failed to populate Redis cache after database hit: ',
        redisError,
      );
    }

    return DBTasks;
  }

  async getDashboardTasks(userId: string) {
    const user = await this.prisma.client.user.findUniqueOrThrow({
      where: { id: userId },
      select: { timeZone: true, dayStartTime: true },
    });

    const { startOfToday, endOfToday } = getLocalDateBounds(
      user.timeZone,
      user.dayStartTime,
    );

    const [todaysTasks, abandonedTasks] = await Promise.all([
      this.prisma.client.task.findMany({
        where: {
          userId,
          dueTime: {
            gte: startOfToday,
            lte: endOfToday,
          },
        },
      }),

      this.prisma.client.task.findMany({
        where: {
          userId,
          status: 'PENDING',
          dueTime: {
            lt: startOfToday,
          },
        },
      }),
    ]);

    return { todaysTasks, abandonedTasks };
  }

  async completeTask(userId: string, taskId: string) {
    const start = performance.now();

    try {
      // 1. Transactional Postgres Task State Update
      const updatedTask = await this.prisma.client.task.update({
        where: { id: taskId, userId: userId, status: 'PENDING' },
        data: { status: 'DONE' },
        select: {
          id: true,
          title: true,
          priority: true,
          type: true,
          scheduledDate: true,
          dueTime: true,
          habitId: true,
          goalId: true,
        },
      });

      // 2. Fetch/Fallback Routing Metadata
      const fallbackParentId = updatedTask.habitId || updatedTask.goalId || '';
      const metaData = await this.getTaskRoutingMeta(
        taskId,
        updatedTask.type,
        fallbackParentId,
      );

      // 3. Delegate Modular Sub-System Rules Based on Task Type
      await this.handleTaskTypeSideEffects(userId, taskId, metaData);

      const todayString = new Date().toISOString().split('T')[0];
      this.taskLogService
        .createTaskLog({
          userId,
          taskId: updatedTask.id,
          taskTitle: updatedTask.title,
          type: updatedTask.type,
          priority: updatedTask.priority,
          scheduledDate: updatedTask.scheduledDate ?? '',
          dueTime: updatedTask.dueTime
            ? updatedTask.dueTime.toISOString()
            : null,
          completedDate: todayString,
          goalId: updatedTask.goalId,
          habitId: updatedTask.habitId,
        })
        .catch((err) =>
          this.logger.error(
            `Asynchronous task log generation failed for DynamoDB [Task ID: ${taskId}]:`,
            err,
          ),
        );

      // 4. Calculate and Process Gamification XP Gain
      await this.handleGamificationRewards(userId, updatedTask.priority);

      // 5. Evict stale state keys from cache layers
      await this.redis.del(this.getCacheKey(userId));

      const end = performance.now();
      this.logger.log(
        `Task completion engine footprint: ${(end - start).toFixed(2)}ms`,
      );

      return { success: true };
    } catch (error) {
      this.logger.error(
        `Critical transaction collapse on Task completion [ID: ${taskId}]:`,
        error,
      );
      throw new Error('Error in the complete Task method', { cause: error });
    }
  }

  async deleteTask(userId: string, taskId: string) {
    const deleteResult = await this.prisma.client.task.deleteMany({
      where: {
        id: taskId,
        userId,
      },
    });

    if (deleteResult.count === 0) {
      throw new NotFoundException('Task Missing or unauthorised to delete');
    }

    await this.redis.del(this.getCacheKey(userId));
    return { success: true };
  }

  async rescheduleTasks(userId: string, taskIds: string[]) {
    await this.prisma.client.task.updateMany({
      where: {
        userId,
        id: { in: taskIds },
      },
      data: {
        dueTime: new Date(),
      },
    });

    await this.redis.del(this.getCacheKey(userId));

    return { success: true };
  }

  async purgePastTasks(userId: string, abandonedIds: string[]) {
    const user = await this.prisma.client.user.findUniqueOrThrow({
      where: { id: userId },
      select: { timeZone: true, dayStartTime: true },
    });
    const { startOfToday } = getLocalDateBounds(
      user.timeZone,
      user.dayStartTime,
    );
    await this.prisma.client.task.deleteMany({
      where: {
        userId,
        OR: [
          { id: { in: abandonedIds } },
          { status: 'DONE', dueTime: { lt: startOfToday } },
        ],
      },
    });

    await this.redis.del(this.getCacheKey(userId));
    return { success: true };
  }

  private async getTaskRoutingMeta(
    taskId: string,
    dbFallbackType: string,
    dbParentId: string,
  ) {
    let metaData = await this.taskCache.getTaskMetaData(taskId);

    if (!metaData || !metaData.parentId) {
      this.logger.warn(
        `Cache miss for task metadata: ${taskId}. Falling back to DB layout schemas.`,
      );
      metaData = {
        type: dbFallbackType as 'Standard' | 'HabitTask' | 'GoalTask',
        parentId: dbParentId,
      };
    }
    return metaData;
  }

  private async handleTaskTypeSideEffects(
    userId: string,
    taskId: string,
    metaData: {
      type: 'Standard' | 'HabitTask' | 'GoalTask';
      parentId?: string;
    },
  ): Promise<void> {
    switch (metaData.type) {
      case 'HabitTask': {
        if (!metaData.parentId) {
          this.logger.error(
            `Cannot log habit metrics mapping: Missing parentId allocation for task: ${taskId}`,
          );
          break;
        }

        const habitId = metaData.parentId;
        const today = new Date();
        const currentYear = today.getFullYear();
        const currentMonth = today.getMonth(); // 0-indexed (0 = Jan, 11 = Dec)

        await this.habitService.processHabitMetricsCompletion(userId, habitId);

        // Calculate data configurations
        const daysInThisMonth = new Date(
          currentYear,
          currentMonth + 1,
          0,
        ).getDate();
        const yearMonthString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;
        const dayIndex = today.getDate() - 1; // 0-indexed string matrix alignment

        const baselineSkippedString = 'S'.repeat(daysInThisMonth).split('');

        baselineSkippedString[dayIndex] = 'D';
        const initialHistoryString = baselineSkippedString.join('');

        // Perform atomic database bitmask string character flip using raw safe SQL overlay
        await this.prisma.client.$executeRaw`
          INSERT INTO "HabitMonthlyLogs" ("id", "userId", "habitId", "yearMonth", "history")
          VALUES (${crypto.randomUUID()}, ${userId}, ${habitId}, ${yearMonthString}, ${initialHistoryString})
          ON CONFLICT ("habitId", "yearMonth") 
          DO UPDATE SET history = overlay("HabitMonthlyLogs".history placing 'D' from ${dayIndex + 1} for 1);
        `;

        // Async fire-and-forget deep audit trail ledger entry down to AWS DynamoDB
        this.habitLogService
          .logHabit({
            userId,
            habitId: metaData.parentId,
            timestamp: today.toISOString(),
            status: 'COMPLETED',
            notes: `Task execution checkpoint passed. Task ID: ${taskId}`,
          })
          .catch((err) =>
            this.logger.error(
              `Asynchronous persistent ledger sync failed for DynamoDB:`,
              err,
            ),
          );

        this.logger.log(
          `HabitMonthlyLog array overlay operation completed for Habit ID: ${metaData.parentId}`,
        );
        break;
      }

      case 'GoalTask': {
        const goalId = metaData.parentId;

        if (!goalId) {
          this.logger.error(
            `Missing goalId context for GoalTask completion [Task ID: ${taskId}]`,
          );
          break;
        }

        const goal = await this.prisma.client.goal.findUnique({
          where: { id: goalId, userId },
          select: {
            id: true,
            timeFrame: true,
            targetDays: true,
            completedDays: true,
            configeDaysPerWeek: true,
          },
        });

        if (!goal) {
          this.logger.error(
            `Goal not found for metrics update [Goal ID: ${goalId}]`,
          );
          break;
        }

        const newCompletedDays = goal.completedDays + 1;

        const newProgressPercent = this.goalsService.calculateGoalProgress(
          goal.timeFrame,
          goal.configeDaysPerWeek,
          newCompletedDays,
        );

        const goalLogs = await this.taskLogService.getGoalTaskLogs(goalId);

        // Convert DynamoDB logs to HistoricalDayLog format expected by GoalsService
        const historicalLogs: HistoricalDayLog[] = goalLogs.map((log) => ({
          isOffDay: false,
          tasksSnapshot: [
            {
              name: log.taskTitle,
              completed: true,
            },
          ],
        }));

        const calculatedVelocity =
          this.goalsService.calculateGoalVelocity(historicalLogs);

        // 5. Evaluate overall goal completion gate (completedDays >= targetDays)
        const isGoalFinished = newCompletedDays >= goal.targetDays;

        await this.prisma.client.goal.update({
          where: { id: goalId },
          data: {
            completedDays: newCompletedDays,
            currentProgress: newProgressPercent,
            currentVelocity: calculatedVelocity,
            status: isGoalFinished ? 'COMPLETED' : 'ACTIVE',
          },
        });

        this.logger.log(
          `GoalTask metrics updated [Goal ID: ${goalId} | Days: ${newCompletedDays}/${goal.targetDays} | Progress: ${newProgressPercent}% | Velocity: ${calculatedVelocity}%]`,
        );
        break;
      }

      case 'Standard':
      default: {
        this.logger.log(
          `No secondary ledger storage routes required for Standard Task structure: ${taskId}`,
        );
        break;
      }
    }
  }

  private async handleGamificationRewards(
    userId: string,
    taskPriority: string,
  ): Promise<void> {
    let currentLevelString = await this.gamificationCache.getHashField(
      userId,
      'level',
    );

    if (!currentLevelString) {
      const userDb = await this.prisma.client.user.findUnique({
        where: { id: userId },
        select: { level: true },
      });
      currentLevelString = String(userDb?.level ?? 1);
    }

    const baseWeight = (TASK_XP[taskPriority] || TASK_XP.MEDIUM) as number;
    const pointsGained = getTaskXp(Number(currentLevelString), baseWeight);

    await this.gamification.processXpGain(userId, pointsGained);
  }
}
