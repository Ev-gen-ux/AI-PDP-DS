import type { DatePickerProps } from './DatePicker';

/**
 * Code Connect mapping (Figma `datePicker`, master `State=Today date`).
 * @see https://www.figma.com/design/i7T3ru2M0SyXgJeTda8f43/AI-PDP-DS?node-id=3378-24452
 */
export const figma = {
  nodeId: '3378:24452',
  props: {
    year: [2025],
    monthIndex: [8],
    weekStartsOn: [0, 1],
    locale: ['ru-RU', 'en-US'],
  } satisfies Record<
    keyof Pick<DatePickerProps, 'year' | 'monthIndex' | 'weekStartsOn' | 'locale'>,
    unknown
  >,
};
