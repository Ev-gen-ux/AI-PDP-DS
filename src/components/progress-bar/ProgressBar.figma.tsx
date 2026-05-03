import type { ProgressBarProps } from './ProgressBar';

/**
 * Code Connect mapping (Figma `progress bar`).
 * @see https://www.figma.com/design/i7T3ru2M0SyXgJeTda8f43/AI-PDP-DS?node-id=3392-29873
 */
export const figma = {
  nodeId: '3392:29873',
  props: {
    indeterminate: [false, true],
    value: [0, 20, 40, 60, 80, 100],
    max: [100],
  } satisfies Record<keyof Pick<ProgressBarProps, 'indeterminate' | 'value' | 'max'>, unknown>,
};
