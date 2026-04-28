import type { InputTextProps } from './InputText';

export const figma = {
  nodeId: '128:18497',
  props: {
    required: [true, false],
    disabled: [true, false],
    readOnly: [true, false],
    invalid: [true, false],
    success: [true, false],
  } satisfies Record<
    keyof Pick<InputTextProps, 'required' | 'disabled' | 'readOnly' | 'invalid' | 'success'>,
    unknown
  >,
};
