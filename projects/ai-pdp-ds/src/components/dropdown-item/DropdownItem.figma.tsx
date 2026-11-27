import type { DropdownItemProps } from './DropdownItem';

export const figma = {
  nodeId: '3249:7565',
  props: {
    state: ['enabled', 'hover', 'active', 'disabled'],
    disabled: [true, false],
    iconBefore: [true, false],
    description: [true, false],
  } satisfies Record<
    keyof Pick<DropdownItemProps, 'state' | 'disabled' | 'iconBefore' | 'description'>,
    unknown
  >,
};
