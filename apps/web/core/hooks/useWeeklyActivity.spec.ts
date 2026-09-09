import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useWeeklyActivity, TaskItem } from './useWeeklyActivity';
import useSWR from 'swr';

// Mock SWR to control the data returned to the hook
vi.mock('swr');

describe('useWeeklyActivity', () => {
  beforeAll(() => {
    // Freeze time to a known Wednesday
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-07-15T12:00:00Z')); // Wednesday
  });

  afterAll(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('should generate empty buckets for the current week if no tasks', () => {
    (useSWR as any).mockReturnValue({
      data: [],
      error: undefined,
      isLoading: false,
    });

    const { result } = renderHook(() => useWeeklyActivity());

    expect(result.current.weeklyData).toHaveLength(7);
    expect(result.current.weeklyData[0].name).toBe('Mon');
    expect(result.current.weeklyData[6].name).toBe('Sun');
    
    // Check that all tasks/habits counts are 0
    result.current.weeklyData.forEach(day => {
      expect(day.tasks).toBe(0);
      expect(day.habits).toBe(0);
    });
  });

  it('should correctly sort completed tasks and habits into their respective days', () => {
    // 2026-07-13 is Monday, 2026-07-14 is Tuesday
    const mockTasks: Partial<TaskItem>[] = [
      { id: '1', type: 'Standard', status: 'DONE', dueTime: '2026-07-13T10:00:00Z' }, // Monday Task
      { id: '2', type: 'HabitTask', status: 'DONE', scheduledDate: '2026-07-14' }, // Tuesday Habit
      { id: '3', type: 'GoalTask', status: 'DONE', createdAt: '2026-07-13T09:00:00Z' }, // Monday Task
      { id: '4', type: 'Standard', status: 'PENDING', dueTime: '2026-07-13T10:00:00Z' }, // Ignored (Pending)
    ];

    (useSWR as any).mockReturnValue({
      data: mockTasks,
    });

    const { result } = renderHook(() => useWeeklyActivity());

    const monday = result.current.weeklyData[0];
    const tuesday = result.current.weeklyData[1];

    expect(monday.tasks).toBe(2);
    expect(monday.habits).toBe(0);

    expect(tuesday.tasks).toBe(0);
    expect(tuesday.habits).toBe(1);
  });
});
