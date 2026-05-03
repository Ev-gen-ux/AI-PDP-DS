import type { SelectProps } from './Select';

/**
 * Placeholder Code Connect mapping.
 * @see https://www.figma.com/design/i7T3ru2M0SyXgJeTda8f43/AI-PDP-DS?node-id=3392-29918
 */
export const figma = {
  nodeId: '3392:29918',
  props: {
    label: ['Label'],
    placeholder: ['Select value'],
    disabled: [true, false],
    invalid: [true, false],
    required: [true, false],
  } satisfies Record<
    keyof Pick<SelectProps, 'label' | 'placeholder' | 'disabled' | 'invalid' | 'required'>,
    unknown
  >,
};
