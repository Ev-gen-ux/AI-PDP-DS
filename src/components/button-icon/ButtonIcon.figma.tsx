import type { ButtonIconProps } from './ButtonIcon';

export const figma = {
  nodeId: '238:698',
  props: {
    appearance: ['primary', 'secondary'],
    disabled: [true, false],
    loading: [true, false],
  } satisfies Record<keyof Pick<ButtonIconProps, 'appearance' | 'disabled' | 'loading'>, unknown>,
};
