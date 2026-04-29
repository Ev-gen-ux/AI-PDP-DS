import type { StatusMarkProps } from './StatusMark';

export const figma = {
  nodeId: '3223:6178',
  props: {
    appearance: ['success'],
    size: ['Extra Extra Small 8px', 'Extra Small 12px', 'Small 16px'],
  } satisfies Record<keyof Pick<StatusMarkProps, 'appearance' | 'size'>, unknown>,
};
