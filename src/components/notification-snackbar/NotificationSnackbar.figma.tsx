import type { NotificationSnackbarProps } from './NotificationSnackbar';

export const figma = {
  nodeId: '240:2165',
  props: {
    appearance: ['success', 'information', 'alert', 'error'],
    closable: [true, false],
  } satisfies Record<keyof Pick<NotificationSnackbarProps, 'appearance' | 'closable'>, unknown>,
};
