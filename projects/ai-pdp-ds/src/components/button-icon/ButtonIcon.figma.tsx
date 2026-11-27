import type { ButtonIconProps } from './ButtonIcon';

export const figma = {
  nodeId: '238:698',
  props: {
    appearance: ['primary', 'secondary'],
    size: ['large', 'medium', 'small'],
    disabled: [true, false],
    loading: [true, false],
  } satisfies Record<
    keyof Pick<ButtonIconProps, 'appearance' | 'size' | 'disabled' | 'loading'>,
    unknown
  >,
};
