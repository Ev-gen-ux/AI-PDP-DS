import type { InputTelProps } from './InputTel';

/**
 * Code Connect placeholder. Master: InputTel (AI-PDP-DS).
 * @see https://www.figma.com/design/i7T3ru2M0SyXgJeTda8f43/AI-PDP-DS?node-id=3392-29557
 */
export const figma = {
  nodeId: '3392:29557',
  props: {
    required: [true, false],
    disabled: [true, false],
    readOnly: [true, false],
    invalid: [true, false],
    success: [true, false],
  } satisfies Record<
    keyof Pick<InputTelProps, 'required' | 'disabled' | 'readOnly' | 'invalid' | 'success'>,
    unknown
  >,
};
