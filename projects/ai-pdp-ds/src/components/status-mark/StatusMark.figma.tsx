import type { StatusMarkProps } from './StatusMark';

/**
 * Placeholder Code Connect mapping.
 * Update nodeId when publishing mapping to Figma.
 */
export const figma = {
  nodeId: '3294:18313',
  props: {
    appearance: ['success', 'error', 'alert', 'information', 'wait'],
    size: ['Extra Extra Small 8px', 'Extra Small 12px', 'Small 16px'],
  } satisfies Record<keyof Pick<StatusMarkProps, 'appearance' | 'size'>, unknown>,
};
