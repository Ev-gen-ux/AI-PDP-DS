import type { ButtonProps } from './Button';

/**
 * Placeholder Code Connect mapping.
 * Update nodeId when publishing mapping to Figma.
 */
export const figma = {
  nodeId: '3001:15051',
  props: {
    appearance: ['primary', 'outline', 'flat'],
    size: ['large', 'medium'],
    disabled: [true, false],
    loading: [true, false],
  } satisfies Record<
    keyof Pick<ButtonProps, 'appearance' | 'size' | 'disabled' | 'loading'>,
    unknown
  >,
};
