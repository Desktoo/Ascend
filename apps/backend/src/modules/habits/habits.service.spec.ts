import { Test, TestingModule } from '@nestjs/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { HabitsService } from './habits.service';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { HabitLogService } from './habit-log/habit-log.service';
import { RedisCacheService } from 'src/common/redis-cache/redis-cache.service';
import { HabitsCacheRepository } from './repos/habit-cache.repo';
import { TasksCacheRepository } from '../tasks/repos/task-cache.repo';
import { getQueueToken } from '@nestjs/bullmq';
import { HABITS_QUEUE } from 'src/common/queues/queue-names';

describe('HabitsService', () => {
  let service: HabitsService;
  let queueMock: any;

  beforeEach(async () => {
    queueMock = { add: vi.fn() };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HabitsService,
        { provide: PrismaService, useValue: { client: { user: { findMany: vi.fn().mockResolvedValue([{timeZone: 'UTC'}]) } } } },
        { provide: HabitLogService, useValue: {} },
        { provide: RedisCacheService, useValue: {} },
        { provide: HabitsCacheRepository, useValue: {} },
        { provide: TasksCacheRepository, useValue: {} },
        { provide: getQueueToken(HABITS_QUEUE), useValue: queueMock },
      ],
    }).compile();

    service = module.get<HabitsService>(HabitsService);
  });

  describe('calculateNewStabilityScore', () => {
    it('should increase score if completed', () => {
      // Cast to any to access private method for logic testing
      const result = (service as any).calculateNewStabilityScore(50, true);
      // target = 100, current = 50. K = 0.25
      // 100 * 0.25 + 50 * 0.75 = 25 + 37.5 = 62.5 -> 63
      expect(result).toBe(63);
    });

    it('should decrease score if missed', () => {
      const result = (service as any).calculateNewStabilityScore(50, false);
      // target = 0, current = 50.
      // 0 * 0.25 + 50 * 0.75 = 37.5 -> 38
      expect(result).toBe(38);
    });
  });

  describe('handleDailyOrchestration', () => {
    it('should queue jobs for unique timezones', async () => {
      await service.handleDailyOrchestration();
      expect(queueMock.add).toHaveBeenCalled();
    });
  });
});
