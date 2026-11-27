import type { SidebarNavigationItemProps } from './SidebarNavigationItem';

export const figma = {
  nodeId: '369:3025',
  props: {
    state: ['enabled', 'hover', 'active'],
    label: [true, false],
  } satisfies Record<keyof Pick<SidebarNavigationItemProps, 'state' | 'label'>, unknown>,
};
