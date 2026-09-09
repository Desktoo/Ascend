import { vi } from 'vitest';
import RedisMock from 'ioredis-mock';

// Globally intercept all 'ioredis' imports across the entire NestJS ecosystem
vi.mock('ioredis', () => {
  return {
    default: RedisMock,
    Redis: RedisMock, // BullMQ specifically imports { Redis } from 'ioredis'
  };
});
