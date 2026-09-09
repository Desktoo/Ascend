import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { AppModule } from '../../../app.module'; 
import { PrismaService } from 'src/common/prisma/prisma.service';
import { HabitTaskProcessor } from './habit-tasks.processor';
import { HABIT_JOBS } from 'src/common/queues/queue-names';
import { Job } from 'bullmq';

describe('HabitTaskProcessor (Integration)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let processor: HabitTaskProcessor;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule], 
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    
    prisma = app.get<PrismaService>(PrismaService);
    processor = app.get<HabitTaskProcessor>(HabitTaskProcessor);
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await prisma.client.task.deleteMany();
    await prisma.client.habit.deleteMany();
    await prisma.client.user.deleteMany();
  });

  describe('Process INITIALIZE_TIMEZONE_TASKS', () => {
    it('should run gracefully when triggered', async () => {
      const mockJob = {
        name: HABIT_JOBS.INITIALIZE_TIMEZONE_TASKS,
        data: {
          timeZone: 'UTC',
          windowStartMinutes: 0,
          windowEndMinutes: 60,
          localDateString: '2026-09-09',
        }
      } as Job;

      await expect(processor.process(mockJob)).resolves.not.toThrow();
    });
  });
});
