import {
  Injectable,
  Logger,
  NotFoundException,
  OnApplicationBootstrap,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { HabitDto } from './dto/habit.dto';
import { CachedHabitMeta } from 'src/common/types/types';
import { Prisma } from '@day-mark/db';
import { Cron } from '@nestjs/schedule';
import { HabitLogService } from './habit-log/habit-log.service';
import { InjectQueue } from '@nestjs/bullmq';
import { HABIT_JOBS, HABITS_QUEUE } from 'src/common/queues/queue-names';
import { Queue } from 'bullmq';
import { TZDate } from '@date-fns/tz';
import { HabitsCacheRepository } from './repos/habit-cache.repo';
import { RedisCacheService } from 'src/common/redis-cache/redis-cache.service';
import { TasksCacheRepository } from '../tasks/repos/task-cache.repo';

@Injectable()
// TODO: remove OnApplicationBootStrap its only for testing
export class HabitsService implements OnApplicationBootstrap {
  private readonly logger = new Logger(HabitsService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly habitLogService: HabitLogService,
    private readonly redis: RedisCacheService,
    private readonly habitCache: HabitsCacheRepository,
    private readonly taskCache: TasksCacheRepository,
    @InjectQueue(HABITS_QUEUE) private readonly habitsQueue: Queue,
  ) {}

  // TODO: this is the test for habits hence remove it
  async onApplicationBootstrap() {
    this.logger.log(
      '--- TEST TRIGGER: Forcing daily orchestration workflow ---',
    );
    await this.handleDailyOrchestration();
  }

  @Cron('0 * * * *')
  async handleDailyOrchestration() {
    this.logger.log(
      `Triggering automated daily timezone registration cycle...`,
    );

    try {
      const timeConfigs = await this.prisma.client.user.findMany({
        distinct: ['timeZone'],
        select: { timeZone: true },
      });

      this.logger.log(
        `Found ${timeConfigs.length} unique timezones for active execution windows...`,
      );

      for (const config of timeConfigs) {
        if (!config.timeZone) continue;

        const { timeZone } = config;

        let localNow: TZDate;

        try {
          localNow = new TZDate(new Date(), timeZone);
        } catch (tzError) {
          this.logger.warn(
            `Invalid timezone encountered: ${timeZone}`,
            tzError,
          );
          continue;
        }

        const currentLocalHour = localNow.getHours();
        const windowStartMinutes = currentLocalHour * 60;
        const windowEndMinutes = windowStartMinutes + 60;

        const localDateString = new Intl.DateTimeFormat('en-CA', {
          timeZone,
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        }).format(new Date());

        const formattedHour = String(currentLocalHour).padStart(2, '0');

        const uniqueJobId = `init_window:${timeZone}-H${formattedHour}:${localDateString}`;

        await this.habitsQueue.add(
          HABIT_JOBS.INITIALIZE_TIMEZONE_TASKS,
          {
            timeZone,
            windowStartMinutes,
            windowEndMinutes,
            localDateString,
          },
          {
            delay: 0,
            jobId: uniqueJobId,
          },
        );

        this.logger.log(
          `Queued immediate batch [${timeZone} @ Hour ${formattedHour}] | Window: [${windowStartMinutes}m - ${windowEndMinutes}m]`,
        );
      }
    } catch (error) {
      this.logger.error(
        'Critical failure running Custom Start Engine loop:',
        error,
      );
    }
  }

  async createHabit(userId: string, habitDto: HabitDto) {
    const todayWeekDay = new Date()
      .toLocaleDateString('en-US', { weekday: 'long' })
      .toUpperCase();

    const shouldCreatTaskToday = habitDto.selectedDays.includes(todayWeekDay);

    const habit = await this.prisma.client.habit.create({
      data: {
        title: habitDto.title,
        description: habitDto.description ?? '',
        daysOfWeek: habitDto.selectedDays,
        tag: habitDto.selectedTag,
        taskTitle: habitDto.taskTitle,
        taskDueTime: habitDto.dueTime,
        taskPriority: habitDto.priority,
        user: { connect: { id: userId } },
        tasks: shouldCreatTaskToday
          ? {
              create: [
                {
                  userId,
                  title: habitDto.taskTitle,
                  priority: habitDto.priority,
                  type: 'HabitTask',
                  dueTime: this.parseLocalTimeToDateTime(
                    new Date(),
                    habitDto.dueTime,
                  ),
                },
              ],
            }
          : undefined,
      },
      include: {
        tasks: true,
      },
    });

    void (async () => {
      try {
        await this.habitCache.initializeHabitCache(userId, habit.id, {
          currentStreak: '0',
          longestStreak: '0',
          stabilityScore: '0',
          isScheduledForToday: shouldCreatTaskToday,
        });
      } catch (error) {
        console.error(
          `[Cache Error] Failed to initialize state for state for habit ${habit.id}:`,
          error,
        );
      }
    })();

    return habit;
  }

  async getAllHabits(userId: string) {
    const habits = await this.prisma.client.habit.findMany({
      where: { userId: userId },
      select: {
        id: true,
        title: true,
        isActive: true,
        stabilityScore: true,
        currentStreak: true,
        longestStreak: true,
      },
    });

    if (habits.length === 0) return [];

    const habitIds = habits.map((h) => h.id);

    const cachedMetaDataArray = await this.habitCache.getHabitsMetaBulk(
      userId,
      habitIds,
    );

    return habits.map((habit, index) => {
      const cache = (cachedMetaDataArray[index] ||
        {}) as Partial<CachedHabitMeta>;

      // Helper to safely parse strings/numbers or fallback to DB
      const parseOrFallback = (
        cachedVal: string | undefined,
        dbVal: number | null | undefined,
      ): number => {
        if (cachedVal !== undefined && cachedVal !== null && cachedVal !== '') {
          const parsed = parseInt(cachedVal, 10);
          if (!Number.isNaN(parsed)) return parsed;
        }
        return dbVal ?? 0;
      };

      return {
        id: habit.id,
        title: habit.title,
        isActive: habit.isActive,
        currentStreak: parseOrFallback(
          cache.currentStreak,
          habit.currentStreak,
        ),
        longestStreak: parseOrFallback(
          cache.longestStreak,
          habit.longestStreak,
        ),
        stabilityScore: parseOrFallback(
          cache.stabilityScore,
          habit.stabilityScore,
        ),
      };
    });
  }

  async getHabitById(userId: string, habitId: string) {
    if (!userId || !habitId) return;

    try {
      const habit = await this.prisma.client.habit.findUniqueOrThrow({
        where: {
          id: habitId,
          userId: userId,
        },
      });

      return habit;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(
          `Habit registry with ID "${habitId}" could not be located.`,
        );
      }
      throw error;
    }
  }

  async toggleHabit(userId: string, habitId: string) {
    if (!userId) {
      throw new UnauthorizedException('Unauthorised user');
    }

    const habit = await this.prisma.client.habit.findFirst({
      where: {
        id: habitId,
        userId,
      },
      select: { isActive: true },
    });

    if (!habit) {
      throw new NotFoundException(
        `Habit with ID: ${habitId} from user:${userId} not found`,
      );
    }

    const updatedhabit = await this.prisma.client.habit.update({
      where: {
        id: habitId,
      },
      data: { isActive: !habit.isActive },
    });

    return {
      success: true,
      data: updatedhabit,
    };
  }

  async deleteHabit(userId: string, habitId: string) {
    this.logger.log(
      `Initiating deletion for Habit ID: ${habitId} by User ID: ${userId}`,
    );

    // 1. Verify existence and ownership, then delete from Postgres
    // This triggers relational cascades (HabitMonthlyLogs, Tasks) automatically via DB engine
    const deleteResult = await this.prisma.client.habit.deleteMany({
      where: {
        id: habitId,
        userId: userId,
      },
    });

    // 2. If no rows were affected, the habit didn't exist or belonged to someone else
    if (deleteResult.count === 0) {
      throw new NotFoundException('Habit not found or unauthorized to delete');
    }

    // 3. Asynchronously fire-and-forget the purge down to AWS DynamoDB
    // We handle errors locally so that a DynamoDB network hiccup won't crash the user response
    this.habitLogService
      .deleteLogsByHabitId(habitId) // Adjust method name to match your actual HabitLogService API
      .then(() => {
        this.logger.log(
          `Successfully purged persistent audit trails from DynamoDB for Habit ID: ${habitId}`,
        );
      })
      .catch((dynamoError) => {
        this.logger.error(
          `Failed to clean up persistent DynamoDB ledger rows for Habit ID: ${habitId}`,
          dynamoError,
        );
      });

    // 4. Clear the stale tasks cache layer for this user
    try {
      await this.redis.del(`user:${userId}:tasks`);
    } catch (cacheError) {
      this.logger.error(
        `Failed to evict tasks cache for user ${userId} following habit deletion`,
        cacheError,
      );
    }

    return {
      success: true,
      message:
        'Habit, history strings, and all associated persistent logs successfully purged.',
    };
  }

  async getMonthlyHabitLogs(userId: string, habitId: string) {
    if (!userId) throw new UnauthorizedException('User is not Authrized');

    const habitLogs = await this.prisma.client.habitMonthlyLogs.findMany({
      where: {
        userId: userId,
        habitId: habitId,
      },
      select: { history: true, yearMonth: true },
    });

    return habitLogs;
  }

  async generateHabitTasksForScheduleGroup(
    timeZone: string,
    windowStartMinutes: number,
    windowEndMinutes: number,
    localDateString: string,
  ) {
    this.logger.log(
      `Execution batch triggered for Group: [${timeZone} | Window: ${windowStartMinutes}m-${windowEndMinutes}m]`,
    );

    const now = new Date();

    // Get Day Name (e.g., "MONDAY")
    const localizedDayName = new Intl.DateTimeFormat('en-US', {
      timeZone,
      weekday: 'long',
    })
      .format(now)
      .toUpperCase();

    const startString = `${String(Math.floor(windowStartMinutes / 60)).padStart(2, '0')}:00`;
    const endString = `${String(Math.floor(windowEndMinutes / 60)).padStart(2, '0')}:00`;

    // 1. Fetch all matching active habits for users belonging to this specific schedule group
    const pendingHabits = await this.prisma.client.habit.findMany({
      where: {
        isActive: true,
        daysOfWeek: { has: localizedDayName },
        user: {
          timeZone,
          dayStartTime: {
            gte: startString,
            lt: endString,
          },
        },
      },
      select: {
        id: true,
        userId: true,
        taskTitle: true,
        taskPriority: true,
        taskDueTime: true,
      },
    });

    if (pendingHabits.length === 0) {
      this.logger.log(
        `Zero active matching habits found scheduled for ${localizedDayName} in group [${timeZone} | Window: ${windowStartMinutes}m-${windowEndMinutes}m].`,
      );
      return;
    }

    this.logger.log(
      `Processing batch creation for ${pendingHabits.length} habits...`,
    );

    // 2. Map structures into a single batch transaction query to avoid open loop bottlenecks
    for (const habit of pendingHabits) {
      try {
        const dueTime = this.parseLocalTimeToDateTime(
          new Date(localDateString),
          habit.taskDueTime,
        );
        const habitTask = await this.prisma.client.task.create({
          data: {
            userId: habit.userId,
            title: habit.taskTitle,
            priority: habit.taskPriority,
            scheduledDate: localDateString,
            dueTime,
            type: 'HabitTask',
          },
        });

        await this.taskCache.setTaskMetaData(habitTask.id, {
          type: 'HabitTask',
          parentId: habit.id,
        });

        const userDashboardCacheKey = `tasks:cache:${habit.userId}`;
        await this.redis.del(userDashboardCacheKey);
      } catch (innerError) {
        this.logger.error(
          `Failed processing automated generation loop for Habit ID: ${habit.id}`,
          innerError,
        );
      }
    }

    this.logger.log(
      `Completed task creation batch cycle for group: [${timeZone} | Window: ${windowStartMinutes}m-${windowEndMinutes}m]`,
    );
  }

  async processHabitMetricsCompletion(
    userId: string,
    habitId: string,
  ): Promise<void> {
    const cachedMeta = await this.habitCache.getHabitHash(userId, habitId);

    let currentStreak = 0;
    let longestStreak = 0;
    let stabilityScore = 0;

    if (cachedMeta && Object.keys(cachedMeta).length > 0) {
      currentStreak = parseInt(cachedMeta.currentStreak, 10);
      longestStreak = parseInt(cachedMeta.longestStreak, 10);
      stabilityScore = parseInt(cachedMeta.stabilityScore, 10);
    } else {
      const dbHabit = await this.prisma.client.habit.findUnique({
        where: { id: habitId },
        select: {
          currentStreak: true,
          longestStreak: true,
          stabilityScore: true,
        },
      });

      if (dbHabit) {
        currentStreak = dbHabit.currentStreak;
        longestStreak = dbHabit.longestStreak;
        stabilityScore = dbHabit.stabilityScore;
      }
    }

    currentStreak += 1;
    if (currentStreak > longestStreak) {
      longestStreak = currentStreak;
    }

    const newStabilityScore = this.calculateNewStabilityScore(
      stabilityScore,
      true,
    );

    const ttlSeconds = 48 * 60 * 60;
    await this.habitCache.updateHabitMeta(
      userId,
      habitId,
      {
        currentStreak: String(currentStreak),
        longestStreak: String(longestStreak),
        stabilityScore: String(newStabilityScore),
        isScheduledForToday: 'true',
      },
      ttlSeconds,
    );

    this.prisma.client.habit
      .update({
        where: { id: habitId },
        data: {
          currentStreak,
          longestStreak,
          stabilityScore: newStabilityScore,
        },
      })
      .catch((err) =>
        this.logger.error(
          `Asynchronous Postgres write sync failed for Habit ID: ${habitId}`,
          err,
        ),
      );
  }

  private calculateNewStabilityScore(
    currentScore: number,
    isCompletedToday: boolean,
  ): number {
    const K = 0.25; // Smoothing factor (Adjusts how fast a single failure hurts the score)
    const target = isCompletedToday ? 100 : 0;

    const newScore = target * K + currentScore * (1 - K);
    return Math.min(100, Math.max(0, Math.round(newScore)));
  }

  private parseLocalTimeToDateTime(baseDate: Date, timeString: string): Date {
    const [hours, minutes] = timeString.split(':').map(Number);
    const combinedDateTime = new Date(baseDate);
    combinedDateTime.setHours(hours || 0, minutes || 0, 0, 0);
    return combinedDateTime;
  }
}
