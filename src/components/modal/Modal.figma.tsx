import type { ModalProps } from './Modal';

export const figma = {
  nodeId: '3301:19639',
  props: {
    header: ['Header'],
    closable: [true, false],
    iconBefore: [true, false],
    contentBefore: [true, false],
    contentAfter: [true, false],
  } satisfies Record<
    keyof Pick<ModalProps, 'header' | 'closable' | 'iconBefore' | 'contentBefore' | 'contentAfter'>,
    unknown
  >,
};
