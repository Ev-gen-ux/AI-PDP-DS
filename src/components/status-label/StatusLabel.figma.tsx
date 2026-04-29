import type { StatusLabelProps } from './StatusLabel';

export const figma = {
  nodeId: '240:694',
  props: {
    appearance: ['primary', 'secondary'],
    size: ['medium', 'small'],
    status: ['success', 'information', 'alert', 'wait', 'error'],
    withIcon: [true, false],
  } satisfies Record<
    keyof Pick<StatusLabelProps, 'appearance' | 'size' | 'status' | 'withIcon'>,
    unknown
  >,
};
