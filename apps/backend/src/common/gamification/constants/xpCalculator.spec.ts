import { describe, it, expect } from 'vitest';
import { getXpRequiredForNextLevel, getXpMultiplier, getTaskXp } from './xpCalculator';

describe('xpCalculator', () => {
  describe('getXpRequiredForNextLevel', () => {
    it('should calculate required XP correctly for level 1', () => {
      // 100 + 1 * 1 * 0.8 + 0 = 100.8 -> floor -> 100
      expect(getXpRequiredForNextLevel(1)).toBe(100);
    });

    it('should calculate required XP correctly for level 10', () => {
      // 100 + 10 * 10 * 0.8 + 1 * 150 = 100 + 80 + 150 = 330
      expect(getXpRequiredForNextLevel(10)).toBe(330);
    });
  });

  describe('getXpMultiplier', () => {
    it('should return 1 for levels below 10', () => {
      expect(getXpMultiplier(5)).toBe(1);
    });

    it('should return 1.15 for levels between 10 and 19', () => {
      expect(getXpMultiplier(15)).toBe(1.15);
    });
  });

  describe('getTaskXp', () => {
    it('should multiply base xp by multiplier and floor it', () => {
      expect(getTaskXp(15, 10)).toBe(11); // 10 * 1.15 = 11.5 -> floor -> 11
    });
  });
});
