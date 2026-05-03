import type { YearPickerProps } from './YearPicker';

/**
 * Code Connect mapping — Figma `yearPicker` (Default).
 * @see https://www.figma.com/design/i7T3ru2M0SyXgJeTda8f43/AI-PDP-DS?node-id=3379-26655
 */
export const figma = {
  nodeId: '3379:26655',
  props: {
    rangeLabel: ['2001–2023'],
    leadYear: [2023],
    years: [Array.from({ length: 12 }, (_, i) => 2012 + i)],
    selectedYear: [2023, null],
  } satisfies Record<
    keyof Pick<YearPickerProps, 'rangeLabel' | 'leadYear' | 'years' | 'selectedYear'>,
    unknown
  >,
};
