import { PriorityLevel } from '@day-mark/db';
import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { DynamoDbService } from 'src/common/dynamo-db/dynamo-db.service';
import { getUserLogicalDate } from 'src/common/utils/time.utils';
import { TasksService } from 'src/modules/tasks/tasks.service';

export interface TomorrowTaskInput {
  goalId: string;
  taskTitle: string;
  priority: PriorityLevel;
  scheduledDate?: string; // "YYYY-MM-DD" passed directly from Frontend
  dueTime?: Date | string; // Directly passed from Frontend
}

export interface SelfReflectionItem {
  PK: string; // USER#<userId>
  SK: string; // REFLECTION#<YYYY-MM-DD>
  id: string;
  userId: string;
  reflectionText: string;
  submissionDate: string; // YYYY-MM-DD (Logical Date)
  submittedAt: string; // ISO String UTC
  timeZone: string;
}

export interface SubmitReflectionDto {
  dayStartTime: string; // e.g., "05:00"
  reflectionText: string;
  tomorrowTasks?: TomorrowTaskInput[];
  timeZone: string;
}

@Injectable()
export class SelfReflectionService {
  private readonly logger = new Logger(SelfReflectionService.name);

  constructor(
    private readonly dynamoDbService: DynamoDbService,
    private readonly tasksService: TasksService,
  ) {}

  async submitReflection(dto: SubmitReflectionDto, userId: string) {
    const { dayStartTime, reflectionText, tomorrowTasks = [], timeZone } = dto;

    // 1. Calculate user's active logical date (YYYY-MM-DD) based on dayStartTime & timeZone
    const logicalDateString = getUserLogicalDate(timeZone, dayStartTime);

    const pk = `USER#${userId}`;
    const sk = `REFLECTION#${logicalDateString}`;

    // 2. Check if a reflection log already exists for today's logical date
    const existingLogs =
      await this.dynamoDbService.queryByPrefix<SelfReflectionItem>(
        pk,
        `REFLECTION#${logicalDateString}`,
      );

    if (existingLogs.length > 0) {
      throw new ConflictException(
        `Self-reflection already submitted for logical date: ${logicalDateString}`,
      );
    }

    // 3. Prepare and persist reflection item to DynamoDB
    const reflectionId = crypto.randomUUID();
    const reflectionItem: SelfReflectionItem = {
      PK: pk,
      SK: sk,
      id: reflectionId,
      userId,
      reflectionText,
      submissionDate: logicalDateString,
      submittedAt: new Date().toISOString(),
      timeZone,
    };

    await this.dynamoDbService.putItem(reflectionItem);
    this.logger.log(
      `Reflection logged in DynamoDB for User [${userId}] on [${logicalDateString}]`,
    );

    // 4. Create tasks in SQL database via TasksService using frontend task data
    if (tomorrowTasks.length > 0) {
      for (const taskInput of tomorrowTasks) {
        const parsedDueTime = taskInput.dueTime
          ? new Date(taskInput.dueTime)
          : undefined;

        await this.tasksService.createTask(
          userId,
          {
            title: taskInput.taskTitle,
            priority: taskInput.priority || PriorityLevel.MEDIUM,
            scheduledDate: taskInput.scheduledDate ?? '', // Passed directly to TaskService
            dueTime: parsedDueTime,
            type: 'GoalTask',
            goalId: taskInput.goalId,
          },
          timeZone,
        );
      }
    }

    // 5. Return response payload
    return {
      success: true,
      reflectionId,
      logicalDate: logicalDateString,
      submittedAt: reflectionItem.submittedAt,
      createdTasksCount: tomorrowTasks.length,
    };
  }

  /**
   * Retrieves today's reflection log for the user's calculated logical date.
   */
  async getTodayReflection(
    userId: string,
    timeZone: string,
    dayStartTime: string = '05:00',
  ) {
    const logicalDateString = getUserLogicalDate(timeZone, dayStartTime);
    const pk = `USER#${userId}`;
    const skPrefix = `REFLECTION#${logicalDateString}`;

    const logs = await this.dynamoDbService.queryByPrefix<SelfReflectionItem>(
      pk,
      skPrefix,
    );

    return logs.length > 0 ? logs[0] : null;
  }
}
