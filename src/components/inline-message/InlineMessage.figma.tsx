import type { InlineMessageProps } from './InlineMessage';

export const figma = {
  nodeId: '529:24944',
  props: {
    status: ['default', 'error'],
  } satisfies Record<keyof Pick<InlineMessageProps, 'status'>, unknown>,
};
