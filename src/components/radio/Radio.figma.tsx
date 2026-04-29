import type { RadioProps } from './Radio';

export const figma = {
  nodeId: '535:37004',
  props: {
    checked: [true, false],
    disabled: [true, false],
    invalid: [true, false],
    state: ['enabled', 'focus', 'disabled'],
    helpMessage: [true, false],
    errorMessage: [true, false],
  } satisfies Record<
    keyof Pick<
      RadioProps,
      'checked' | 'disabled' | 'invalid' | 'state' | 'helpMessage' | 'errorMessage'
    >,
    unknown
  >,
};
