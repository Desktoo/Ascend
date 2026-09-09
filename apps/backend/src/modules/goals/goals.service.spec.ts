import { Test, TestingModule } from '@nestjs/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { GoalsService } from './goals.service';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { TasksService } from '../tasks/tasks.service';

describe('GoalsService', () => {
  let service: GoalsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GoalsService,
        { provide: PrismaService, useValue: {} },
        { provide: TasksService, useValue: {} },
      ],
    }).compile();

    service = module.get<GoalsService>(GoalsService);
  });

  describe('calculateGoalProgress', () => {
    it('should calculate weekly progress correctly', () => {
      const result = service.calculateGoalProgress('WEEKLY', 5, 2);
      expect(result).toBe(40); // 2 / 5 * 100
    });

    it('should calculate monthly progress correctly', () => {
      const result = service.calculateGoalProgress('MONTHLY', 5, 10);
      expect(result).toBe(40); // 10 / (5 * 5) = 10/25 = 40%
    });
  });

  describe('calculateGoalVelocity', () => {
    it('should calculate velocity accurately based on logs', () => {
      const logs = [
        { isOffDay: false, tasksSnapshot: [{ completed: true }, { completed: false }] },
        { isOffDay: false, tasksSnapshot: [{ completed: true }] },
        { isOffDay: true, tasksSnapshot: [] } // Should be ignored
      ] as any;
      
      const velocity = service.calculateGoalVelocity(logs);
      // Total scheduled: 3. Total completed: 2.
      // 2 / 3 = 66.66% -> 67
      expect(velocity).toBe(67);
    });

    it('should return 100 if no tasks are scheduled', () => {
      const velocity = service.calculateGoalVelocity([]);
      expect(velocity).toBe(100);
    });
  });

  describe('calculateTargetDays', () => {
    it('should fallback to 5 weeks for monthly if sprints are not provided', () => {
      expect(service.calculateTargetDays('MONTHLY', 4, 0)).toBe(20);
    });
  });
});
