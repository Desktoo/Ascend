import { Injectable } from '@nestjs/common';
import { DynamoDbService } from 'src/common/dynamo-db/dynamo-db.service';
import { CreateHabitLogDto, HabitLogItem } from 'src/common/types/types';

@Injectable()
export class HabitLogService extends DynamoDbService {
  /**
   * Helper to construct Single-Table Design keys consistently for habit logs
   */
  private buildKeys(userId: string, habitId: string, timestamp: string) {
    return {
      PK: `USER#${userId}`,
      SK: `LOG#HABIT#${habitId}#${timestamp}`,
    };
  }

  /**
   * Pushes a deep audit trail log entry down to AWS DynamoDB
   */
  async logHabit(dto: CreateHabitLogDto): Promise<HabitLogItem> {
    const { PK, SK } = this.buildKeys(dto.userId, dto.habitId, dto.timestamp);

    const item: HabitLogItem = {
      PK,
      SK,
      userId: dto.userId,
      habitId: dto.habitId,
      timestamp: dto.timestamp,
      status: dto.status,
      notes: dto.notes,
      metadata: dto.metadata,
      createdAt: new Date().toISOString(),
    };

    // Forward the fully structured item to the reusable DAL layer
    return this.putItem<HabitLogItem>(item);
  }

  /**
   * Retrieves all logs across all habits for a specific user
   */
  async getLogsByUser(userId: string): Promise<HabitLogItem[]> {
    return this.queryByPartitionKey<HabitLogItem>(`USER#${userId}`);
  }

  /**
   * Retrieves historical logs for a targeted habit belonging to a specific user
   */
  async getLogsByHabit(
    userId: string,
    habitId: string,
  ): Promise<HabitLogItem[]> {
    return this.queryByPrefix<HabitLogItem>(
      `USER#${userId}`,
      `LOG#HABIT#${habitId}#`,
    );
  }

  /**
   * Deletes a distinct habit log execution point
   */
  //  NEW SCALABLE WAY: Purges the entire habit history automatically
  async deleteLogsByHabitId(habitId: string): Promise<void> {
    // 1. Query only the structural composite keys (PK & SK) via the optimized client method
    // Note: Adjust the 'habitId' string if your actual PK contains a prefix like `HABIT#${habitId}`
    const keysToDelete = await this.queryKeysByPartitionKey(habitId);

    if (keysToDelete.length === 0) {
      return;
    }

    // 2. Perform highly efficient chunked batch deletes instead of firing individual delete promises
    await this.batchDeleteItems(keysToDelete);
  }
}
