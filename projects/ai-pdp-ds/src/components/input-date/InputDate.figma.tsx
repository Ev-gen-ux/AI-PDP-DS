import type { InputDateProps } from './InputDate';

/**
 * Code Connect mapping (Figma component set `inputDate`).
 * @see https://www.figma.com/design/i7T3ru2M0SyXgJeTda8f43/AI-PDP-DS?node-id=3358-23415
 */
export const figma = {
  nodeId: '3358:23415',
  props: {
    disabled: [true, false],
    invalid: [true, false],
    defaultValue: ['', '2024-06-15'],
  } satisfies Record<keyof Pick<InputDateProps, 'disabled' | 'invalid' | 'defaultValue'>, unknown>,
};
