import type { InputSearchProps } from './InputSearch';

/**
 * Code Connect placeholder. Master: InputSearch (AI-PDP-DS).
 * @see https://www.figma.com/design/i7T3ru2M0SyXgJeTda8f43/AI-PDP-DS?node-id=3392-29153
 */
export const figma = {
  nodeId: '3392:29153',
  props: {
    required: [true, false],
    disabled: [true, false],
    readOnly: [true, false],
    invalid: [true, false],
  } satisfies Record<
    keyof Pick<InputSearchProps, 'required' | 'disabled' | 'readOnly' | 'invalid'>,
    unknown
  >,
};
