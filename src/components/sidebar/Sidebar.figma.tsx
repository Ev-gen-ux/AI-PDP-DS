import type { SidebarProps } from './Sidebar';

export const figma = {
  nodeId: '3254:8843',
  props: {
    state: ['default', 'collapse'],
  } satisfies Record<keyof Pick<SidebarProps, 'state'>, unknown>,
};
