import type { InputFileProps } from './InputFile';

/**
 * Code Connect placeholder. Master: InputFile в AI-PDP-DS.
 * @see https://www.figma.com/design/i7T3ru2M0SyXgJeTda8f43/AI-PDP-DS?node-id=3392-28550
 */
export const figma = {
  nodeId: '3392:28550',
  props: {
    required: [true, false],
    disabled: [true, false],
    invalid: [true, false],
    success: [true, false],
  } satisfies Record<
    keyof Pick<InputFileProps, 'required' | 'disabled' | 'invalid' | 'success'>,
    unknown
  >,
};
