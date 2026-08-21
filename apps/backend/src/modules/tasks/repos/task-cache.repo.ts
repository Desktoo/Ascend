import { Injectable } from '@nestjs/common';
import { RedisCacheService } from 'src/common/redis-cache/redis-cache.service';
import { TaskMetaDataType } from 'src/common/types/types';

@Injectable()
export class TasksCacheRepository {
  constructor(private readonly cache: RedisCacheService) {}

  private getTaskKey(taskId: string): string {
    return `task:metadata:${taskId}`;
  }

  async setTaskMetaData(
    taskId: string,
    metaData: {
      type: 'Standard' | 'HabitTask' | 'GoalTask';
      parentId?: string;
    },
  ): Promise<void> {
    const ttlInSeconds = 48 * 60 * 60;
    await this.cache.set(this.getTaskKey(taskId), metaData, ttlInSeconds);
  }

  async getTaskMetaData(
    taskId: string,
  ): Promise<{ type: TaskMetaDataType; parentId?: string } | null> {
    const rawData = await this.cache.get(this.getTaskKey(taskId));
    if (!rawData) return null;

    return JSON.parse(rawData) as { type: TaskMetaDataType; parentId?: string };
  }

  async invalidateUserDashboardCache(userId: string): Promise<void> {
    await this.cache.del(`tasks:cache:${userId}`);
  }
}
