import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { AppModule } from '../../../app.module'; 
import { NotificationProcessor } from './notification.processor';
import { Job } from 'bullmq';

describe('NotificationProcessor (Integration)', () => {
  let app: INestApplication;
  let processor: NotificationProcessor;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule], 
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    
    processor = app.get<NotificationProcessor>(NotificationProcessor);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Process notification-queue', () => {
    it('should gracefully handle an unknown template ID', async () => {
      const mockJob = {
        id: 'job-123',
        data: {
          userId: 'user-uuid',
          category: 'PROGRESS',
          templateId: 'UNKNOWN_TEMPLATE',
          context: {},
        }
      } as Job;

      const result = await processor.process(mockJob);
      expect(result.success).toBe(false);
      expect(result.reason).toBe('TEMPLATE_NOT_FOUND');
    });
  });
});
