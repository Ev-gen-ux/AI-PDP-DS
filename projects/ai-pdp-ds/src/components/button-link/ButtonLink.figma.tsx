import type { ButtonLinkProps } from './ButtonLink';

export const figma = {
  nodeId: '667:2897',
  props: {
    appearance: ['primary', 'secondary'],
    state: ['enabled', 'hover', 'active', 'focus', 'disabled'],
    iconBefore: [true, false],
    iconAfter: [true, false],
    loading: [true, false],
    disabled: [true, false],
  } satisfies Record<
    keyof Pick<
      ButtonLinkProps,
      'appearance' | 'state' | 'iconBefore' | 'iconAfter' | 'loading' | 'disabled'
    >,
    unknown
  >,
};
