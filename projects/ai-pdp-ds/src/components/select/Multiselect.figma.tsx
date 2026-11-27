import type { MultiselectProps } from './Multiselect';

/**
 * Placeholder Code Connect mapping.
 * @see https://www.figma.com/design/i7T3ru2M0SyXgJeTda8f43/AI-PDP-DS?node-id=3392-30070
 */
export const figma = {
  nodeId: '3392:30070',
  props: {
    label: ['Label'],
    placeholder: ['Multiselect'],
    disabled: [true, false],
    invalid: [true, false],
    required: [true, false],
  } satisfies Record<
    keyof Pick<MultiselectProps, 'label' | 'placeholder' | 'disabled' | 'invalid' | 'required'>,
    unknown
  >,
};
