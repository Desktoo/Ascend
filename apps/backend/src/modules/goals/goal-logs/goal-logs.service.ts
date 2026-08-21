import { Injectable } from '@nestjs/common';
import { DynamoDbService } from 'src/common/dynamo-db/dynamo-db.service';
import { CreateGoalLogDto, GoalLogItem } from 'src/common/types/types';

@Injectable()
export class GoalLogsService extends DynamoDbService {
  private buildKeys(userId: string, goalId: string, timestamp: string) {
    return {
      PK: `USER#${userId}`,
      SK: `LOG#GOAL#${goalId}#${timestamp}`,
    };
  }

  async logGoalDay(dto: CreateGoalLogDto): Promise<GoalLogItem> {
    const { PK, SK } = this.buildKeys(dto.userId, dto.goalId, dto.timestamp);

    const item: GoalLogItem = {
      PK,
      SK,
      userId: dto.userId,
      goalId: dto.goalId,
      timestamp: dto.timestamp,
      isOffDay: dto.isOffDay,
      wasSuccessful: dto.wasSuccessful,
      progressAtDate: dto.progressAtDate,
      velocityAtDate: dto.velocityAtDate,
      tasksSnapshot: dto.tasksSnapshot,
      createdAt: new Date().toISOString(),
    };

    // Forward the fully structured item payload down to the reusable base layer
    return this.putItem<GoalLogItem>(item);
  }

  async getLogsByUser(userId: string): Promise<GoalLogItem[]> {
    return this.queryByPartitionKey<GoalLogItem>(`USER#${userId}`);
  }

  async getLogsByGoal(userId: string, goalId: string): Promise<GoalLogItem[]> {
    return this.queryByPrefix<GoalLogItem>(
      `USER#${userId}`,
      `LOG#GOAL#${goalId}#`,
    );
  }

  async deleteLogsByGoalId(goalId: string): Promise<void> {
    // 1. Query structural composite keys (PK & SK) from DynamoDB
    const keysToDelete = await this.queryKeysByPartitionKey(goalId);

    if (keysToDelete.length === 0) {
      return;
    }

    // 2. Perform safe, chunked batch writes instead of sequential individual delete promises
    await this.batchDeleteItems(keysToDelete);
  }
}
