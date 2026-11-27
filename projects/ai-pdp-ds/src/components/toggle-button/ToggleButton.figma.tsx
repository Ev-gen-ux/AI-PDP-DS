import type { ToggleButtonProps } from './ToggleButton';

export const figma = {
  nodeId: '615:32565',
  props: {
    appearance: ['primary', 'secondary'],
    state: ['enabled', 'hover', 'active', 'focus', 'disabled'],
    selected: [true, false],
    loading: [true, false],
    disabled: [true, false],
  } satisfies Record<
    keyof Pick<ToggleButtonProps, 'appearance' | 'state' | 'selected' | 'loading' | 'disabled'>,
    unknown
  >,
};
