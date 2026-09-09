import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import { getLocalDateBounds, getUserLogicalDate } from './time.utils';

describe('time.utils', () => {
  beforeAll(() => {
    // Mock system time to a fixed UTC date for predictable tests
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-07-15T08:00:00Z')); 
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  describe('getUserLogicalDate', () => {
    it('should return today if current time is after start offset', () => {
      // 08:00 UTC is 13:30 IST. dayStart is 05:00 IST. Since 13:30 > 05:00, it's the same day.
      const dateStr = getUserLogicalDate('Asia/Kolkata', '05:00');
      expect(dateStr).toBe('2026-07-15');
    });

    it('should return yesterday if current time is before start offset (all nighter)', () => {
      // 08:00 UTC is 04:00 America/New_York (DST). dayStart is 05:00.
      // Since 04:00 < 05:00, it's still technically yesterday.
      const dateStr = getUserLogicalDate('America/New_York', '05:00');
      expect(dateStr).toBe('2026-07-14');
    });
  });

  describe('getLocalDateBounds', () => {
    it('should calculate 24 hour bounds from start time', () => {
      // 08:00 UTC is 08:00 in UTC timezone. Start is 05:00.
      const { startOfToday, endOfToday } = getLocalDateBounds('UTC', '05:00');
      
      expect(startOfToday.toISOString()).toBe('2026-07-15T05:00:00.000Z');
      expect(endOfToday.toISOString()).toBe('2026-07-16T04:59:59.999Z');
    });
  });
});
