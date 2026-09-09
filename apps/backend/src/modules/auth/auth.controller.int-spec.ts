import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from 'vitest';
import { AppModule } from '../../app.module'; 
import { PrismaService } from 'src/common/prisma/prisma.service';
import { RedisCacheService } from 'src/common/redis-cache/redis-cache.service';

describe('AuthController (Integration)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule], 
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
    await prisma.client.user.deleteMany();
  });

  describe('POST /auth/signup', () => {
    it('should reject signup if fields are missing', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/signup')
        .send({ email: 'test@example.com' }) // missing password, etc
        .expect(400);

      expect(response.body.message).toBeInstanceOf(Array);
    });
  });
});
