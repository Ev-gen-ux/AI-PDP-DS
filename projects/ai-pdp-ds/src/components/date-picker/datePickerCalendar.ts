/** Monday-first offset: Monday → 0 … Sunday → 6 */
export function getMondayFirstIndex(jsSundayBasedIndex: number): number {
  return (jsSundayBasedIndex + 6) % 7;
}

export function buildMonthGrid(year: number, monthIndex: number, weekStartsOn: 0 | 1): Date[] {
  const first = new Date(year, monthIndex, 1);
  let leading = first.getDay();
  if (weekStartsOn === 1) {
    leading = getMondayFirstIndex(leading);
  }
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const cells: Date[] = [];
  for (let i = 0; i < leading; i += 1) {
    const day = 1 - leading + i;
    cells.push(new Date(year, monthIndex, day));
  }
  for (let d = 1; d <= daysInMonth; d += 1) {
    cells.push(new Date(year, monthIndex, d));
  }
  /* Без добивки днями следующего месяца: последняя строка короче 7, пустые ячейки — в разметке. */
  return cells;
}

export function isSameCalendarDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function isInMonth(d: Date, year: number, monthIndex: number): boolean {
  return d.getFullYear() === year && d.getMonth() === monthIndex;
}

/** Суббота и воскресенье в локальной таймзоне (акцент `datePicker/label/calm/red` в макете). */
export function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}

export function weekdayLabels(weekStartsOn: 0 | 1, locale: string): string[] {
  const base = weekStartsOn === 1 ? new Date(2024, 0, 1) : new Date(2024, 0, 7);
  const fmt = new Intl.DateTimeFormat(locale, { weekday: 'short' });
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    return fmt.format(d);
  });
}

/**
 * Короткая подпись месяца для первой ячейки сетки (макет: «Сен» под строкой дней недели).
 * Для ru укорачиваем «сент.» → «Сен»; для en оставляем «Sep» и т.п.
 */
/** «сентябрь 2025 г.» → «Сентябрь 2025 г.» — заголовок месяца в шапке календаря. */
export function formatMonthYearTitle(year: number, monthIndex: number, locale: string): string {
  const d = new Date(year, monthIndex, 1);
  const raw = new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(d);
  if (!raw) return raw;
  return raw.charAt(0).toLocaleUpperCase(locale) + raw.slice(1);
}

export function formatMonthAbbrev(year: number, monthIndex: number, locale: string): string {
  const d = new Date(year, monthIndex, 1);
  const raw = new Intl.DateTimeFormat(locale, { month: 'short' }).format(d);
  const noDot = raw.replace(/\.$/, '').trim();
  const lower = noDot.toLocaleLowerCase(locale);

  if (locale.toLowerCase().startsWith('ru')) {
    return lower.charAt(0).toLocaleUpperCase(locale) + lower.slice(1, 3);
  }

  return noDot.charAt(0).toLocaleUpperCase(locale) + noDot.slice(1);
}
