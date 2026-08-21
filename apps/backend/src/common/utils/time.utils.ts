import { TZDate } from '@date-fns/tz';

export function getLocalDateBounds(timezone: string, dayStartTime: string) {
  const [hours, minutes] = dayStartTime.split(':').map(Number);

  // 1. Create a date pinned to the user's local timezone
  const localNow = new TZDate(new Date(), timezone);

  // 2. Project the logical start point for today
  const logicalStart = new TZDate(localNow, timezone);
  logicalStart.setHours(hours, minutes, 0, 0);

  // 3. Handle all-nighter edge case: if current time is before the start window,
  // the user is logically still completing yesterday's tracking page.
  if (localNow < logicalStart) {
    logicalStart.setDate(logicalStart.getDate() - 1);
  }

  // 4. Cast out absolute boundaries
  const startOfToday = new Date(logicalStart.toISOString());
  const endOfToday = new Date(logicalStart.getTime() + 24 * 60 * 60 * 1000 - 1);

  return { startOfToday, endOfToday };
}

export function getUserLogicalDate(
  timeZone: string,
  dayStartTime: string = '05:00',
): string {
  const [startHours, startMinutes] = dayStartTime.split(':').map(Number);

  // 1. Get current local time in user's target timezone
  const localNow = new TZDate(new Date(), timeZone);

  // 2. Create timestamp for today's dayStartTime in local timezone
  const logicalDayStart = new TZDate(localNow, timeZone);
  logicalDayStart.setHours(startHours || 0, startMinutes || 0, 0, 0);

  // 3. If local time is before today's start offset, the active day started yesterday
  if (localNow < logicalDayStart) {
    logicalDayStart.setDate(logicalDayStart.getDate() - 1);
  }

  // 4. Return YYYY-MM-DD string natively formatted for target timezone
  return new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(logicalDayStart);
}
