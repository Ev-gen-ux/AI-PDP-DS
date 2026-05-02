import type { ModalDialogProps } from './ModalDialog';

export const figma = {
  nodeId: '3309:21489',
  props: {
    header: ['Header'],
    closable: [true, false],
    iconBefore: [true, false],
    contentBefore: [true, false],
    contentAfter: [true, false],
    closeOnBackdropClick: [true, false],
    lockBodyScroll: [true, false],
  } satisfies Record<
    keyof Pick<
      ModalDialogProps,
      | 'header'
      | 'closable'
      | 'iconBefore'
      | 'contentBefore'
      | 'contentAfter'
      | 'closeOnBackdropClick'
      | 'lockBodyScroll'
    >,
    unknown
  >,
};
