import type { StepperProps } from './Stepper';

/**
 * Code Connect (мастер Figma `stepper` · 3415:30346).
 * Мастер: `state`, `orientation`, `invalid`, `heading`, `paragraph`, описание, переключатели `body` и `footer`.
 * React: `items[]` — `state`, `invalid`, `heading`, `paragraph`, `description`, `body`, `children`, `footer`, `footerContent`.
 * @see https://www.figma.com/design/i7T3ru2M0SyXgJeTda8f43/AI-PDP-DS?node-id=3415-30346
 */
export const figma = {
  nodeId: '3415:30346',
  props: {
    orientation: ['horizontal', 'vertical'],
  } satisfies Record<keyof Pick<StepperProps, 'orientation'>, unknown>,
};
