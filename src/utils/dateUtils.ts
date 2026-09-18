import { MelbourneEvent, MonthOption, CalculatedEventStatus } from '../types';

/**
 * Returns the user's current local date in ISO YYYY-MM-DD format based on browser/device date.
 */
export function getLocalDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Returns the current local month string in YYYY-MM format.
 */
export function getLocalCurrentMonthKey(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

/**
 * Returns the month key for the month immediately preceding the given month key (e.g. '2026-09' -> '2026-08').
 */
export function getPreviousMonthKey(yearMonth: string): string {
  const parts = yearMonth.split('-');
  if (parts.length !== 2) return yearMonth;
  let year = parseInt(parts[0], 10);
  let month = parseInt(parts[1], 10) - 1;
  if (month === 0) {
    month = 12;
    year -= 1;
  }
  return `${year}-${String(month).padStart(2, '0')}`;
}

/**
 * Returns the effective end date of an event (endDate if provided, otherwise startDate).
 */
export function getEffectiveEndDate(event: MelbourneEvent): string {
  return event.endDate || event.startDate;
}

/**
 * Dynamically calculates the event's status based on current browser date:
 * - Preserves 'Postponed', 'Cancelled', and 'TBC' statuses
 * - 'Upcoming': effective end date >= today
 * - 'Completed': effective end date < today
 */
export function getCalculatedEventStatus(
  event: MelbourneEvent,
  todayStr: string = getLocalDateString()
): CalculatedEventStatus {
  if (event.status === 'Postponed') return 'Postponed';
  if (event.status === 'Cancelled') return 'Cancelled';
  if (event.status === 'TBC') return 'TBC';

  const effectiveEnd = getEffectiveEndDate(event);
  if (effectiveEnd < todayStr) {
    return 'Completed';
  }
  return 'Upcoming';
}

/**
 * Returns true if the event is completed/in the past.
 */
export function isEventCompleted(
  event: MelbourneEvent,
  todayStr: string = getLocalDateString()
): boolean {
  return getCalculatedEventStatus(event, todayStr) === 'Completed';
}

/**
 * Returns true if the event is upcoming (and not cancelled).
 */
export function isEventUpcoming(
  event: MelbourneEvent,
  todayStr: string = getLocalDateString()
): boolean {
  if (event.status === 'Cancelled') return false;
  return !isEventCompleted(event, todayStr);
}

/**
 * Formats an ISO month key (e.g. '2026-10') into a human-friendly string ('October 2026').
 */
export function formatMonthLabel(monthKey: string): string {
  const parts = monthKey.split('-');
  if (parts.length !== 2) return monthKey;
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const d = new Date(year, month, 1);
  return d.toLocaleDateString('en-AU', { month: 'long', year: 'numeric' });
}

/**
 * Determines the default month to show on initial load:
 * 1. Current month stays active until the month changes.
 * 2. Next future month containing events.
 * 3. Fallback to 'all-upcoming'.
 */
export function getDefaultMonthKey(
  events: MelbourneEvent[],
  todayStr: string = getLocalDateString()
): string {
  const currentMonthKey = todayStr.substring(0, 7);

  // 1. Current month tab stays first until the month changes
  const hasEventsInCurrent = events.some((e) => e.startDate.startsWith(currentMonthKey));
  if (hasEventsInCurrent) {
    return currentMonthKey;
  }

  // 2. Find next future month chronologically containing events
  const distinctMonths = Array.from(
    new Set(events.map((e) => e.startDate.substring(0, 7)))
  ).sort();

  const futureMonths = distinctMonths.filter((m) => m > currentMonthKey);
  if (futureMonths.length > 0) {
    return futureMonths[0];
  }

  // 3. Fallback: check if any month has upcoming events
  for (const m of distinctMonths) {
    const hasUpcoming = events.some(
      (e) => e.startDate.startsWith(m) && isEventUpcoming(e, todayStr)
    );
    if (hasUpcoming) {
      return m;
    }
  }

  return 'all-upcoming';
}

/**
 * Dynamically builds month navigation options from all events in the dataset:
 * 1. "All Upcoming" tab.
 * 2. Current month tab (e.g. September 2026), stays until month changes even with passed events.
 * 3. Next 3 future months tabs (e.g. October, November, December 2026).
 * 4. "Past Events (Archive)" tab at the end (all past months go straight here).
 */
export function generateMonthOptions(
  events: MelbourneEvent[],
  todayStr: string = getLocalDateString()
): MonthOption[] {
  const currentMonthKey = todayStr.substring(0, 7);

  const monthMap = new Map<
    string,
    { total: number; upcoming: number; completed: number }
  >();

  events.forEach((e) => {
    const key = e.startDate.substring(0, 7);
    if (!monthMap.has(key)) {
      monthMap.set(key, { total: 0, upcoming: 0, completed: 0 });
    }
    const stat = monthMap.get(key)!;
    stat.total += 1;
    if (isEventCompleted(e, todayStr)) {
      stat.completed += 1;
    } else {
      stat.upcoming += 1;
    }
  });

  const sortedMonthKeys = Array.from(monthMap.keys()).sort();
  const options: MonthOption[] = [];

  // 1. "All Upcoming" option
  const totalUpcoming = events.filter((e) => isEventUpcoming(e, todayStr)).length;
  options.push({
    key: 'all-upcoming',
    label: 'All Upcoming',
    available: totalUpcoming > 0,
    eventCount: totalUpcoming,
    isSpecial: true,
  });

  // 2. Current Month tab (shows first next to All Upcoming, and stays until the month changes)
  const currentStats = monthMap.get(currentMonthKey) || { total: 0, upcoming: 0, completed: 0 };
  options.push({
    key: currentMonthKey,
    label: formatMonthLabel(currentMonthKey),
    available: true,
    eventCount: currentStats.total,
    upcomingCount: currentStats.upcoming,
    completedCount: currentStats.completed,
    isPast: false,
    isCurrent: true,
  });

  // 3. Next 3 future months tabs (e.g. October, November, December)
  const futureMonthKeys = sortedMonthKeys.filter((mKey) => mKey > currentMonthKey).slice(0, 3);
  futureMonthKeys.forEach((mKey) => {
    const stats = monthMap.get(mKey)!;
    options.push({
      key: mKey,
      label: formatMonthLabel(mKey),
      available: true,
      eventCount: stats.total,
      upcomingCount: stats.upcoming,
      completedCount: stats.completed,
      isPast: false,
      isCurrent: false,
    });
  });

  // 4. "Past Events / Archive" option at the end (past months go straight here)
  const totalCompleted = events.filter((e) => isEventCompleted(e, todayStr)).length;
  options.push({
    key: 'archive',
    label: 'Past Events (Archive)',
    available: totalCompleted > 0,
    eventCount: totalCompleted,
    isSpecial: true,
    isArchive: true,
  });

  return options;
}
