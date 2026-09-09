import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from 'vitest';
import { AppModule } from '../../app.module'; 
import { PrismaService } from 'src/common/prisma/prisma.service';
import { AuthGaurd } from 'src/common/gaurds/auth.gaurds';
import { RedisCacheService } from 'src/common/redis-cache/redis-cache.service';

describe('GoalsController (Integration)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule], 
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
      })
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
    
    prisma = app.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await prisma.client.goal.deleteMany();
    await prisma.client.user.deleteMany();
  });

  describe('GET /goals/all', () => {
    it('should retrieve goals successfully', async () => {
      const mockUser = await prisma.client.user.create({
        data: { email: 'goal@test.com', userName: 'goal_tester', timeZone: 'UTC' },
      });

      const response = await request(app.getHttpServer())
        .get('/goals/all')
        .set('x-user-id', mockUser.id)
        .expect(200);

      expect(response.body).toEqual([]);
    });
  });
});
