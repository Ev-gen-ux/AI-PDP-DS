import type { CheckboxProps } from './Checkbox';

export const figma = {
  nodeId: '533:34771',
  props: {
    checked: [true, false],
    indeterminate: [true, false],
    disabled: [true, false],
    invalid: [true, false],
    state: ['enabled', 'focus', 'disabled'],
    inlineMessage: [true, false],
    errorMessage: [true, false],
  } satisfies Record<
    keyof Pick<
      CheckboxProps,
      | 'checked'
      | 'indeterminate'
      | 'disabled'
      | 'invalid'
      | 'state'
      | 'inlineMessage'
      | 'errorMessage'
    >,
    unknown
  >,
};
