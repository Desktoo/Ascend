import { Test, TestingModule } from '@nestjs/testing';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { TasksService } from './tasks.service';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { RedisCacheService } from 'src/common/redis-cache/redis-cache.service';
import { GamificationService } from 'src/common/gamification/gamification.service';
import { HabitLogService } from '../habits/habit-log/habit-log.service';
import { TasksCacheRepository } from './repos/task-cache.repo';
import { GamificationCacheRepository } from 'src/common/gamification/repos/gamification-cache.repo';
import { HabitsService } from '../habits/habits.service';
import { TaskLogService } from './task-logs/task-logs.service';
import { GoalsService } from '../goals/goals.service';
import { UserCacheRepository } from '../user/repos/user-cache.repo';
import { BadRequestException } from '@nestjs/common';
import { TaskDTO } from './dto/tasks.dto';

describe('TasksService', () => {
  let service: TasksService;
  let prismaService: any;
  let redisCacheService: any;
  let userCache: any;
  let taskCache: any;

  beforeEach(async () => {
    // Mocking Dependencies
    prismaService = {
      client: {
        task: {
          create: vi.fn(),
          findMany: vi.fn(),
          update: vi.fn(),
          deleteMany: vi.fn(),
          updateMany: vi.fn(),
        },
        user: {
          findUnique: vi.fn(),
          findUniqueOrThrow: vi.fn(),
        },
      },
    };

    redisCacheService = {
      del: vi.fn(),
      get: vi.fn(),
      set: vi.fn(),
    };

    userCache = {
      getCoreProfile: vi.fn(),
    };

    taskCache = {
      setTaskMetaData: vi.fn(),
      getTaskMetaData: vi.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: PrismaService, useValue: prismaService },
        { provide: RedisCacheService, useValue: redisCacheService },
        { provide: GamificationService, useValue: { processXpGain: vi.fn() } },
        { provide: TasksCacheRepository, useValue: taskCache },
        { provide: GamificationCacheRepository, useValue: { getHashField: vi.fn() } },
        { provide: HabitLogService, useValue: { logHabit: vi.fn() } },
        { provide: HabitsService, useValue: { processHabitMetricsCompletion: vi.fn() } },
        { provide: TaskLogService, useValue: { createTaskLog: vi.fn(), getGoalTaskLogs: vi.fn() } },
        { provide: GoalsService, useValue: { calculateGoalProgress: vi.fn(), calculateGoalVelocity: vi.fn() } },
        { provide: UserCacheRepository, useValue: userCache },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Initialization', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });
  });

  describe('createTask', () => {
    it('should throw BadRequestException if task belongs to both habit and goal', async () => {
      const data = { habitId: 'h1', goalId: 'g1', title: 'Test Task' } as TaskDTO;
      
      await expect(service.createTask('user1', data, 'UTC'))
        .rejects.toThrow(BadRequestException);
    });

    it('should create a task successfully when valid data is provided', async () => {
      const data = { title: 'Test Task', priority: 'HIGH', type: 'Standard' } as TaskDTO;
      const mockUser = { timeZone: 'UTC', dayStartTime: '09:00' };
      const mockTask = { id: 'task1', ...data, userId: 'user1' };

      userCache.getCoreProfile.mockResolvedValue(mockUser);
      prismaService.client.task.create.mockResolvedValue(mockTask);
      taskCache.setTaskMetaData.mockResolvedValue(undefined);
      redisCacheService.del.mockResolvedValue(undefined);

      const result = await service.createTask('user1', data, 'UTC');

      expect(userCache.getCoreProfile).toHaveBeenCalledWith('user1');
      expect(prismaService.client.task.create).toHaveBeenCalled();
      expect(taskCache.setTaskMetaData).toHaveBeenCalledWith('task1', expect.any(Object));
      expect(redisCacheService.del).toHaveBeenCalledWith('user:user1:tasks');
      expect(result).toEqual(mockTask);
    });
  });

  describe('getAllTasks', () => {
    it('should return tasks from cache if available', async () => {
      const mockTasks = [{ id: 'task1', title: 'Test' }];
      redisCacheService.get.mockResolvedValue(JSON.stringify(mockTasks));

      const result = await service.getAllTasks('user1');

      expect(redisCacheService.get).toHaveBeenCalledWith('user:user1:tasks');
      expect(prismaService.client.task.findMany).not.toHaveBeenCalled();
      expect(result).toEqual(mockTasks);
    });

    it('should fetch from DB and set cache if cache misses', async () => {
      const mockTasks = [{ id: 'task1', title: 'Test from DB' }];
      redisCacheService.get.mockResolvedValue(null);
      prismaService.client.task.findMany.mockResolvedValue(mockTasks);

      const result = await service.getAllTasks('user1');

      expect(prismaService.client.task.findMany).toHaveBeenCalledWith({ where: { userId: 'user1' } });
      expect(redisCacheService.set).toHaveBeenCalledWith('user:user1:tasks', mockTasks, 3600);
      expect(result).toEqual(mockTasks);
    });
  });
});
