import { describe, expect, it } from 'vitest';
import {
  buildMonthGrid,
  formatMonthAbbrev,
  getMondayFirstIndex,
  isInMonth,
  isWeekend,
  weekdayLabels,
} from './datePickerCalendar';

describe('datePickerCalendar', () => {
  it('getMondayFirstIndex maps Sunday to 6', () => {
    expect(getMondayFirstIndex(0)).toBe(6);
  });

  it('getMondayFirstIndex maps Monday to 0', () => {
    expect(getMondayFirstIndex(1)).toBe(0);
  });

  it('buildMonthGrid for September 2025 Monday-first has 30 in-month days, no trailing next-month fill', () => {
    const cells = buildMonthGrid(2025, 8, 1);
    const inMonth = cells.filter((d) => isInMonth(d, 2025, 8));
    expect(inMonth).toHaveLength(30);
    expect(cells).toHaveLength(30);
    const last = cells[cells.length - 1];
    expect(last?.getDate()).toBe(30);
    expect(last?.getMonth()).toBe(8);
  });

  it('weekdayLabels returns 7 labels', () => {
    expect(weekdayLabels(1, 'en-US')).toHaveLength(7);
  });

  it('isWeekend is true for Saturday and Sunday', () => {
    expect(isWeekend(new Date(2025, 8, 6))).toBe(true); // Sat
    expect(isWeekend(new Date(2025, 8, 7))).toBe(true); // Sun
    expect(isWeekend(new Date(2025, 8, 8))).toBe(false); // Mon
  });

  it('formatMonthAbbrev matches Figma-style Russian labels', () => {
    expect(formatMonthAbbrev(2025, 8, 'ru-RU')).toBe('Сен');
    expect(formatMonthAbbrev(2025, 9, 'ru-RU')).toBe('Окт');
  });
});
