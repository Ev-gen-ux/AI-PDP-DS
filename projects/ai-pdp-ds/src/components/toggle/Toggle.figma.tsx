import type { ToggleProps } from './Toggle';

/**
 * Code Connect: [toggle · 3415:32200](https://www.figma.com/design/i7T3ru2M0SyXgJeTda8f43/AI-PDP-DS?node-id=3415-32200)
 * Figma: `checked`, `isDisabled`, `inlineMessage`, `state` — в React: `checked`, `disabled`, `inlineMessage`, `state`.
 */
export const figma = {
  nodeId: '3415:32200',
  props: {
    checked: [true, false],
    disabled: [true, false],
    inlineMessage: [true, false],
    state: ['enabled', 'focus', 'disabled'],
  } satisfies Record<
    keyof Pick<ToggleProps, 'checked' | 'disabled' | 'inlineMessage' | 'state'>,
    unknown
  >,
};
