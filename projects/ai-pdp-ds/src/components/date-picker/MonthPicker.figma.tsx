import type { MonthPickerProps } from './MonthPicker';

/**
 * Code Connect mapping — Figma `monthPicker` (Default).
 * @see https://www.figma.com/design/i7T3ru2M0SyXgJeTda8f43/AI-PDP-DS?node-id=3379-26793
 */
export const figma = {
  nodeId: '3379:26793',
  props: {
    year: [2023],
    rangeLabel: ['2001–2023'],
    selectedMonthIndex: [5, null],
    locale: ['ru-RU', 'en-US'],
  } satisfies Record<
    keyof Pick<MonthPickerProps, 'year' | 'rangeLabel' | 'selectedMonthIndex' | 'locale'>,
    unknown
  >,
};
