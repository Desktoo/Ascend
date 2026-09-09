import { vi } from 'vitest';

// 🚀 1. GLOBAL REDIS MOCK: Must be at the absolute top of the file
// This intercepts real ioredis calls and forces them to use memory-mock
vi.mock('ioredis', () => {
  const RedisMock = require('ioredis-mock');
  return {
    default: RedisMock,
    Redis: RedisMock,
  };
});

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import {
  describe,
  it,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
} from 'vitest';

// Adjust these relative paths to match your project structure
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { RedisCacheService } from 'src/common/redis-cache/redis-cache.service';
import { AuthGaurd } from 'src/common/gaurds/auth.gaurds';

describe('TasksController (Integration)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule], // 👈 Import AppModule so all dependencies (Gamification, etc.) resolve properly
    })
      .overrideGuard(AuthGaurd)
      .useValue({
        canActivate: (context: any) => {
          const req = context.switchToHttp().getRequest();
          req.user = { userId: req.headers['x-user-id'] };
          return true;
        },
      })
      .overrideProvider(RedisCacheService)
      .useValue({
        get: vi.fn().mockResolvedValue(null),
        set: vi.fn().mockResolvedValue(undefined),
        del: vi.fn().mockResolvedValue(undefined),
        hgetall: vi.fn().mockResolvedValue({}),
        hset: vi.fn().mockResolvedValue(1),
        hdel: vi.fn().mockResolvedValue(1),
        expire: vi.fn().mockResolvedValue(1),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
    
    prisma = app.get<PrismaService>(PrismaService);
  }, 30000); // 30-second timeout for full app bootstrapping

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  beforeEach(async () => {
    // Clean slate before each test
    await prisma.client.task.deleteMany();
    await prisma.client.user.deleteMany();
  });

  describe('POST /tasks/create', () => {
    it('should successfully create a task and persist it to the real database', async () => {
      const mockUser = await prisma.client.user.create({
        data: {
          email: 'test@example.com',
          userName: 'testuser',
          timeZone: 'UTC',
        },
      });

      const taskPayload = {
        title: 'Integration Test Task',
        priority: 'HIGH',
        type: 'Standard',
        scheduledDate: '2026-09-09',
        dueTime: '2026-09-09T14:00:00Z',
      };

      const response = await request(app.getHttpServer())
        .post('/tasks/create')
        .set('x-user-id', mockUser.id)
        .set('x-user-timezone', 'UTC')
        .send(taskPayload)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe(taskPayload.title);

      const dbTask = await prisma.client.task.findUnique({
        where: { id: response.body.id },
      });

      expect(dbTask).toBeDefined();
      expect(dbTask?.title).toBe('Integration Test Task');
      expect(dbTask?.userId).toBe(mockUser.id);
    });

    it('should return 400 Bad Request if required fields are missing', async () => {
      const invalidPayload = {
        priority: 'HIGH',
      };

      const response = await request(app.getHttpServer())
        .post('/tasks/create')
        .set('x-user-id', 'random-uuid-string')
        .set('x-user-timezone', 'UTC')
        .send(invalidPayload)
        .expect(400);

      expect(response.body.message).toBeInstanceOf(Array);
      expect(response.body.error).toBe('Bad Request');
    });
  });
});