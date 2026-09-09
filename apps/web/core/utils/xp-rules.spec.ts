import { describe, it, expect } from 'vitest';
import { getXpRequiredForNextLevel, getXpMultiplier, getTaskXp } from './xp-rules';

describe('xp-rules', () => {
  describe('getXpRequiredForNextLevel', () => {
    it('should compute base level requirement', () => {
      // Level 1: 100 + 1*1*0.8 + 0 = 100
      expect(getXpRequiredForNextLevel(1)).toBe(100);
    });

    it('should compute higher level requirement correctly', () => {
      // Level 10: 100 + 100*0.8 + 1*150 = 100 + 80 + 150 = 330
      expect(getXpRequiredForNextLevel(10)).toBe(330);
    });
  });

  describe('getXpMultiplier', () => {
    it('should be 1.0 for levels under 10', () => {
      expect(getXpMultiplier(5)).toBe(1);
    });

    it('should add 0.15 for every 10 levels', () => {
      expect(getXpMultiplier(15)).toBe(1.15);
      expect(getXpMultiplier(25)).toBe(1.30);
    });
  });

  describe('getTaskXp', () => {
    it('should correctly apply multipliers and round down', () => {
      expect(getTaskXp(15, 20)).toBe(23); // 20 * 1.15 = 23
    });
  });
});
