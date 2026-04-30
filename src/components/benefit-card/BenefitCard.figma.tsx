import type { BenefitCardProps } from './BenefitCard';

export const figma = {
  nodeId: '506:16735',
  props: {
    appearance: ['primary', 'secondary'],
    contentBefore: [true, false],
    contentAfter: [true, false],
    hasIcon: [true, false],
    hasLabel: [true, false],
    hasButtonPrimary: [true, false],
    hasButtonOutline: [true, false],
    childrenBody: [true, false],
  } satisfies Record<
    keyof Pick<
      BenefitCardProps,
      | 'appearance'
      | 'contentBefore'
      | 'contentAfter'
      | 'hasIcon'
      | 'hasLabel'
      | 'hasButtonPrimary'
      | 'hasButtonOutline'
      | 'childrenBody'
    >,
    unknown
  >,
};
