import {
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateGoalDto, HorizonType } from './dto/goal.dto';
import { TasksService } from '../tasks/tasks.service';
import { Prisma } from '@day-mark/db';
import { HistoricalDayLog } from 'src/common/types/types';

@Injectable()
export class GoalsService {
  private readonly logger = new Logger(GoalsService.name);

  constructor(
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => TasksService))
    private readonly tasksService: TasksService,
  ) {}

  async createGoal(
    userId: string,
    createGoalDto: CreateGoalDto,
    timeZoneHeader?: string,
  ) {
    // 1. Destructure and separate the fields going to the Tasks table vs Goals table
    const { firstGoalTask, goalTaskDueTime, goalTaskPriority, ...goalData } =
      createGoalDto;

    try {
      this.logger.log(
        `Initiating transactional goal & blueprint setup for user: ${userId}`,
      );

      // Use a transaction to ensure both Goal and Task creation succeed together
      const result = await this.prisma.client.$transaction(
        async (tx: Prisma.TransactionClient) => {
          let resolvedTimeZone = timeZoneHeader;

          if (!resolvedTimeZone) {
            const user = await tx.user.findUnique({
              where: { id: userId },
              select: { timeZone: true },
            });
            resolvedTimeZone = user?.timeZone || 'Asia/Kolkata';
          }
          const timeFrameEnum =
            goalData.timeframe === HorizonType.WEEKLY ? 'WEEKLY' : 'MONTHLY';

          const targetDays = this.calculateTargetDays(
            timeFrameEnum,
            goalData.configuredWorkDaysPerWeek,
            goalData.monthlyWeekThemes?.length,
          );
          // 2. Create the entry in the Goals table
          const goal = await tx.goal.create({
            data: {
              title: goalData.title,
              description: goalData.description,
              rewardText: goalData.rewardText,
              timeFrame:
                goalData.timeframe === HorizonType.WEEKLY
                  ? 'WEEKLY'
                  : 'MONTHLY', // Maps incoming payload to DB Enum
              weekendsExcluded: goalData.weekendsExcluded,
              configeDaysPerWeek: goalData.configuredWorkDaysPerWeek,
              monthlyWeekSprints: goalData.monthlyWeekThemes || [],
              targetDays,
              startDate: new Date(goalData.startDate),
              createdAt: new Date(),
              userId,
            },
          });

          // 3. Construct the dynamic dueTime string matching: "YYYY-MM-DDThh:mm:ss"
          const scheduledDateString = new Date(goalData.startDate)
            .toISOString()
            .split('T')[0];
          // E.g., "2026-07-16" + "T" + "13:00" -> "2026-07-16T13:00"
          const combinedDueTime = new Date(
            `${goalData.startDate}T${goalTaskDueTime}:00`,
          );

          // 4. Delegate task orchestration to your pre-existing createTask architecture
          const task = await this.tasksService.createTask(
            userId,
            {
              title: firstGoalTask,
              priority: goalTaskPriority,
              dueTime: combinedDueTime,
              scheduledDate: scheduledDateString,
              type: 'GoalTask',
              goalId: goal.id,
            },
            resolvedTimeZone,
            tx,
          );

          return { goal, task };
        },
      );

      return {
        status: 'success',
        message: 'Goal and initialization task blueprint created successfully',
        data: result,
      };
    } catch (error) {
      this.logger.error('Failed transactional goal creation sequence', error);
      throw new InternalServerErrorException(
        'Could not complete goal blueprint setup. Transaction reverted.',
      );
    }
  }

  async getAllGoals(userId: string) {
    return await this.prisma.client.goal.findMany({
      where: {
        userId,
      },
      select: {
        id: true,
        title: true,
        timeFrame: true,
        currentProgress: true,
        startDate: true,
      },
    });
  }

  async getGoalById(userId: string, goalId: string) {
    const goal = await this.prisma.client.goal.findFirst({
      where: {
        id: goalId,
        userId,
      },
      include: {
        tasks: {
          select: {
            id: true,
            title: true,
            status: true,
            priority: true,
            scheduledDate: true,
            dueTime: true,
          },
        },
      },
    });

    if (!goal) {
      throw new NotFoundException(`Goal with ID ${goalId} not found`);
    }

    return goal;
  }

  async getActiveGoalsForToday(userId: string, userTimeZone: string) {
    const now = new Date();

    // 1. Get Day Name in user's timezone (e.g., "SATURDAY", "SUNDAY")
    const localizedDayName = new Intl.DateTimeFormat('en-US', {
      timeZone: userTimeZone,
      weekday: 'long',
    })
      .format(now)
      .toUpperCase();

    const isWeekend =
      localizedDayName === 'SATURDAY' || localizedDayName === 'SUNDAY';

    // 2. Query Prisma for goals where:
    // - status is ACTIVE (or SCHEDULED with startDate <= now)
    // - Goal is not yet finished (completedDays < targetDays)
    // - If today is a weekend, exclude goals where weekendsExcluded === true
    const activeGoals = await this.prisma.client.goal.findMany({
      where: {
        userId,
        status: { in: ['ACTIVE', 'SCHEDULED'] },
        startDate: { lte: now },
        completedDays: { lt: this.prisma.client.goal.fields.targetDays },
        ...(isWeekend ? { weekendsExcluded: false } : {}), // Dynamically exclude weekend-paused goals
      },
      select: {
        id: true,
        title: true,
        description: true,
        rewardText: true,
        completedDays: true,
      },
    });

    return activeGoals;
  }

  async getGoalsForPlanning(userId: string) {
    if (!userId) {
      throw new NotFoundException(
        `User ID is required to fetch goals for planning`,
      );
    }

    const goals = await this.prisma.client.goal.findMany({
      where: { userId, status: 'ACTIVE' },
      select: {
        id: true,
        title: true,
        completedDays: true,
        targetDays: true,
        description: true,
      },
    });

    return goals;
  }

  calculateGoalProgress(
    timeFrame: 'WEEKLY' | 'MONTHLY',
    configDaysPerWeek: number,
    totalActiveDays: number,
  ): number {
    const targetWeeks = timeFrame === 'WEEKLY' ? 1 : 5;
    const totalTargetDays = configDaysPerWeek * targetWeeks;

    if (totalTargetDays === 0) return 0;

    const progressPercentage = (totalActiveDays / totalTargetDays) * 100;

    return Math.min(100, Math.round(progressPercentage));
  }

  calculateGoalVelocity(historicalLogs: HistoricalDayLog[]): number {
    let scheduledTasksCount = 0;
    let completedTasksCount = 0;

    for (const log of historicalLogs) {
      if (log.isOffDay) continue;

      const dayTasks = log.tasksSnapshot || [];

      scheduledTasksCount += dayTasks.length;
      completedTasksCount += dayTasks.filter((t) => t.completed).length;
    }

    if (scheduledTasksCount === 0) return 100;

    const exactVelocity = (completedTasksCount / scheduledTasksCount) * 100;

    return Math.round(exactVelocity);
  }

  calculateTargetDays(
    timeFrame: 'WEEKLY' | 'MONTHLY',
    configDaysPerWeek: number,
    monthlySprintsCount?: number,
  ): number {
    if (timeFrame === 'WEEKLY') {
      return configDaysPerWeek; // e.g. 5 days for a 1-week goal
    }

    // For Monthly, use sprint array length if present, or fallback to 5 weeks
    const weeksCount =
      monthlySprintsCount && monthlySprintsCount > 0 ? monthlySprintsCount : 5;

    return configDaysPerWeek * weeksCount; // e.g. 5 * 5 = 25 target days
  }
}
