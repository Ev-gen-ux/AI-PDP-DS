import type { CounterProps } from './Counter';

/**
 * Code Connect mapping (Figma `counter`).
 * @see https://www.figma.com/design/i7T3ru2M0SyXgJeTda8f43/AI-PDP-DS?node-id=3367-23536
 */
export const figma = {
  nodeId: '3367:23536',
  props: {
    appearance: ['primary', 'secondary'],
    size: ['extra small (16px)', 'small (24px)'],
    value: [0, 8, 42, 150, 1200],
  } satisfies Record<keyof Pick<CounterProps, 'appearance' | 'size' | 'value'>, unknown>,
};
