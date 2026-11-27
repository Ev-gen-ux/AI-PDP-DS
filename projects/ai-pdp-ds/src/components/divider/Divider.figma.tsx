import type { DividerProps } from './Divider';

/**
 * Code Connect mapping (Figma `divider`).
 * @see https://www.figma.com/design/i7T3ru2M0SyXgJeTda8f43/AI-PDP-DS?node-id=3367-24263
 */
export const figma = {
  nodeId: '3367:24263',
  props: {
    appearance: ['calm', 'loud'],
    orientation: ['horizontal', 'vertical'],
  } satisfies Record<keyof Pick<DividerProps, 'appearance' | 'orientation'>, unknown>,
};
