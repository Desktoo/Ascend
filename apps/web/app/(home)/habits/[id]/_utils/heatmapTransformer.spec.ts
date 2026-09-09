import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import { transformLogsToHeatmapData } from './heatmapTransformer';

describe('heatmapTransformer', () => {
  beforeAll(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-07-15T12:00:00Z'));
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  it('should generate a full rolling 365-day calendar base', () => {
    const data = transformLogsToHeatmapData([]);
    // Since it's from 2025-07-15 to 2026-07-15 inclusive, it should be 366 days (leap year possible, but 365 + 1 inclusive days).
    expect(data.length).toBeGreaterThanOrEqual(365);
    // Ensure the last item is today
    expect(data[data.length - 1].date).toBe('2026-07-15');
    // Ensure default values
    expect(data[0].count).toBe(0);
    expect(data[0].level).toBe(0);
  });

  it('should overlay completed days correctly', () => {
    const backendLogs = [
      {
        yearMonth: '2026-07',
        history: 'DSDSSSSSSSSSSSSSSSSSSSSSSSSSSSS', // Day 1 is Done, Day 2 Skipped, Day 3 Done
      }
    ];

    const data = transformLogsToHeatmapData(backendLogs);
    
    const day1 = data.find(d => d.date === '2026-07-01');
    const day2 = data.find(d => d.date === '2026-07-02');
    const day3 = data.find(d => d.date === '2026-07-03');

    expect(day1?.count).toBe(1);
    expect(day1?.level).toBe(4);

    expect(day2?.count).toBe(0);
    expect(day2?.level).toBe(0);

    expect(day3?.count).toBe(1);
    expect(day3?.level).toBe(4);
  });

  it('should filter out invalid padded dates (like Feb 30)', () => {
    const backendLogs = [
      {
        yearMonth: '2026-02',
        // Provide 31 characters even for Feb to simulate padded backend strings
        history: 'D'.repeat(31), 
      }
    ];

    const data = transformLogsToHeatmapData(backendLogs);
    
    // Feb 2026 has 28 days
    const feb28 = data.find(d => d.date === '2026-02-28');
    const feb29 = data.find(d => d.date === '2026-02-29');
    const feb30 = data.find(d => d.date === '2026-02-30');

    expect(feb28?.count).toBe(1);
    expect(feb29).toBeUndefined();
    expect(feb30).toBeUndefined();
  });
});
