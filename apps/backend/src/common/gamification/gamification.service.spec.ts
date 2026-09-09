import { Test, TestingModule } from '@nestjs/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GamificationService } from './gamification.service';
import { PrismaService } from '../prisma/prisma.service';
import { RedisCacheService } from '../redis-cache/redis-cache.service';
import { GamificationCacheRepository } from './repos/gamification-cache.repo';
import { EventEmitter2 } from '@nestjs/event-emitter';

describe('GamificationService', () => {
  let service: GamificationService;
  let cacheRepo: any;
  let eventEmitter: any;
  let prisma: any;

  beforeEach(async () => {
    cacheRepo = {
      getFullHash: vi.fn(),
      setHashFields: vi.fn(),
      markUserAsDirty: vi.fn(),
    };
    eventEmitter = { emit: vi.fn() };
    prisma = {
      client: { user: { findUnique: vi.fn() } }
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GamificationService,
        { provide: PrismaService, useValue: prisma },
        { provide: RedisCacheService, useValue: {} },
        { provide: GamificationCacheRepository, useValue: cacheRepo },
        { provide: EventEmitter2, useValue: eventEmitter },
      ],
    }).compile();

    service = module.get<GamificationService>(GamificationService);
  });

  describe('processXpGain', () => {
    it('should process XP from DB if cache misses and emit rank up', async () => {
      cacheRepo.getFullHash.mockResolvedValue(null);
      prisma.client.user.findUnique.mockResolvedValue({
        level: 1, xp: 0, rank: 'NOVICE', theme: 'GENERAL'
      });

      // Give 200 XP which levels up to 2
      await service.processXpGain('user1', 200);

      expect(prisma.client.user.findUnique).toHaveBeenCalled();
      expect(cacheRepo.setHashFields).toHaveBeenCalledWith('user1', expect.objectContaining({
        level: "2",
        xp: "100" // 200 - 100 for level 1
      }));
      expect(eventEmitter.emit).toHaveBeenCalledWith('user.rank.up', expect.anything());
      expect(cacheRepo.markUserAsDirty).toHaveBeenCalledWith('user1');
    });

    it('should use cached values if available', async () => {
      cacheRepo.getFullHash.mockResolvedValue({ level: '1', xp: '0', rank: 'NOVICE' });
      prisma.client.user.findUnique.mockResolvedValue({ theme: 'GENERAL', rank: 'NOVICE' });

      await service.processXpGain('user1', 50);

      expect(cacheRepo.setHashFields).toHaveBeenCalledWith('user1', expect.objectContaining({
        level: "1",
        xp: "50"
      }));
    });
  });
});
