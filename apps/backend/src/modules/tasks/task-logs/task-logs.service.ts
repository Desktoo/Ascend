import {
  Injectable,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { DynamoDbService } from 'src/common/dynamo-db/dynamo-db.service';

export type TaskType = 'Standard' | 'HabitTask' | 'GoalTask';
export type TaskPriority = 'HIGH' | 'MEDIUM' | 'LOW';
export type CompletionStatus = 'ON_TIME' | 'LATE';

export interface CreateTaskLogDto {
  userId: string;
  taskId: string;
  taskTitle: string;
  type: TaskType;
  priority: TaskPriority;
  scheduledDate: string; // "YYYY-MM-DD"
  dueTime?: string | null; // ISO UTC string or HH:mm format
  completedDate: string; // "YYYY-MM-DD"
  goalId?: string | null;
  habitId?: string | null;
}

export interface TaskLogItem {
  PK: string;
  SK: string;
  id: string;
  userId: string;
  taskId: string;
  taskTitle: string;
  type: TaskType;
  priority: TaskPriority;
  scheduledDate: string;
  dueTime: string | null;
  completedDate: string;
  completedAt: string; // ISO Timestamp
  isOntime: boolean; // Analytics flag
  completionStatus: CompletionStatus; // UI Badge indicator ('ON_TIME' | 'LATE')
  goalId: string | null;
  habitId: string | null;
  GSI1_PK?: string; // Present if goalId is set
  GSI1_SK?: string;
  GSI2_PK?: string; // Present if habitId is set
  GSI2_SK?: string;
}

@Injectable()
export class TaskLogService extends DynamoDbService {
  private readonly taskLogger = new Logger(TaskLogService.name);

  /**
   * 1. CREATE TASK LOG (Immutable Snapshot)
   */
  async createTaskLog(dto: CreateTaskLogDto): Promise<TaskLogItem> {
    const logId = randomUUID();
    const completedAtDate = new Date();
    const completedAt = completedAtDate.toISOString();

    // Determine Punctuality
    let isOntime = true;
    if (dto.dueTime) {
      const targetDue = new Date(dto.dueTime);
      if (!isNaN(targetDue.getTime())) {
        isOntime = completedAtDate <= targetDue;
      }
    }

    const completionStatus: CompletionStatus = isOntime ? 'ON_TIME' : 'LATE';

    const item: TaskLogItem = {
      PK: `USER#${dto.userId}`,
      SK: `TASKLOG#${dto.completedDate}#${dto.taskId}`,
      id: logId,
      userId: dto.userId,
      taskId: dto.taskId,
      taskTitle: dto.taskTitle,
      type: dto.type,
      priority: dto.priority,
      scheduledDate: dto.scheduledDate,
      dueTime: dto.dueTime || null,
      completedDate: dto.completedDate,
      completedAt,
      isOntime,
      completionStatus,
      goalId: dto.goalId || null,
      habitId: dto.habitId || null,
    };

    // Attach GSIs conditionally for Goal / Habit queries
    if (dto.goalId) {
      item.GSI1_PK = `GOAL#${dto.goalId}`;
      item.GSI1_SK = `COMPLETED#${dto.completedDate}#${dto.taskId}`;
    }

    if (dto.habitId) {
      item.GSI2_PK = `HABIT#${dto.habitId}`;
      item.GSI2_SK = `COMPLETED#${dto.completedDate}#${dto.taskId}`;
    }

    try {
      // Inherited directly from DynamoDbService!
      await this.putItem(item);
      this.taskLogger.log(
        `Task log recorded [Task ID: ${dto.taskId} | Status: ${completionStatus}]`,
      );
      return item;
    } catch (error) {
      this.taskLogger.error(
        `Failed to record task log for Task ID: ${dto.taskId}`,
        error,
      );
      throw new InternalServerErrorException('Failed to log task completion.');
    }
  }

  /**
   * 2. READ: Get All Logs for Dashboard Heatmap
   */
  async getUserHeatmapLogs(
    userId: string,
    yearOrMonthPrefix: string,
  ): Promise<TaskLogItem[]> {
    const pk = `USER#${userId}`;
    const skPrefix = `TASKLOG#${yearOrMonthPrefix}`;

    // Inherited from DynamoDbService
    return await this.queryByPrefix<TaskLogItem>(pk, skPrefix);
  }

  /**
   * 3. READ: Get All Logs for a Goal Workspace (Uses GSI1)
   */
  async getGoalTaskLogs(goalId: string): Promise<TaskLogItem[]> {
    const gsi1Pk = `GOAL#${goalId}`;
    // Inherited GSI query from DynamoDbService
    return await this.queryGSI<TaskLogItem>({
      indexName: 'GSI1',
      pkName: 'GSI1_PK',
      pkValue: gsi1Pk,
      skName: 'GSI1_SK',
      skPrefix: 'COMPLETED#',
    });
  }

  /**
   * 4. READ: Get All Logs for a Habit Workspace (Uses GSI2)
   */
  async getHabitTaskLogs(habitId: string): Promise<TaskLogItem[]> {
    const gsi2Pk = `HABIT#${habitId}`;

    // Inherited GSI query from DynamoDbService
    return await this.queryGSI<TaskLogItem>({
      indexName: 'GSI2',
      pkName: 'GSI2_PK',
      pkValue: gsi2Pk,
      skName: 'GSI2_SK',
      skPrefix: 'COMPLETED#',
    });
  }

  /**
   * 5. DELETE: Un-complete Task
   */
  async deleteTaskLog(
    userId: string,
    completedDate: string,
    taskId: string,
  ): Promise<{ success: boolean }> {
    const pk = `USER#${userId}`;
    const sk = `TASKLOG#${completedDate}#${taskId}`;

    // Inherited from DynamoDbService
    return await this.deleteItem(pk, sk);
  }

  /**
   * 6. DELETE BATCH: Purge All User Logs
   */
  async purgeAllUserTaskLogs(userId: string): Promise<{ success: boolean }> {
    const pk = `USER#${userId}`;

    // Inherited from DynamoDbService
    const keys = await this.queryKeysByPartitionKey(pk);
    if (keys.length === 0) return { success: true };

    return await this.batchDeleteItems(keys);
  }
}
