import { describe, it, expect } from 'vitest';
import { calculateXpProgression } from './calculateXpProgression';

describe('calculateXpProgression', () => {
  it('should not level up if xp is insufficient', () => {
    // level 1 needs 100 xp. Current 50, gained 20 -> 70.
    const result = calculateXpProgression(1, 50, 20, 'GENERAL');
    expect(result.newLevel).toBe('1');
    expect(result.newXp).toBe('70');
  });

  it('should level up once if xp crosses threshold', () => {
    // level 1 needs 100. Current 90, gained 20 -> 110.
    // Next level 2 needs 100 + 4*0.8 = 103.2 -> 103
    // Remaining xp: 110 - 100 = 10.
    const result = calculateXpProgression(1, 90, 20, 'GENERAL');
    expect(result.newLevel).toBe('2');
    expect(result.newXp).toBe('10');
  });

  it('should handle multiple level ups at once', () => {
    // level 1 needs 100. level 2 needs 103.
    // Current 0, gained 250 -> level 3, remaining xp 250 - 100 - 103 = 47.
    const result = calculateXpProgression(1, 0, 250, 'GENERAL');
    expect(result.newLevel).toBe('3');
    expect(result.newXp).toBe('47');
  });
});
