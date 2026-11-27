import type { SplitButtonProps } from './SplitButton';

export const figma = {
  nodeId: '613:25539',
  props: {
    appearance: ['primary', 'secondary'],
    buttonState: ['enabled', 'hover', 'active', 'loading', 'disabled'],
    splitState: ['enabled', 'hover', 'active', 'loading', 'disabled'],
    loading: [true, false],
    disabled: [true, false],
  } satisfies Record<
    keyof Pick<
      SplitButtonProps,
      'appearance' | 'buttonState' | 'splitState' | 'loading' | 'disabled'
    >,
    unknown
  >,
};
