import type { StepperGroupProps } from './StepperGroup';

/**
 * Code Connect: мастера группы шагов.
 * - Horizontal: [stepperGroupHorizontal · 3415:31861](https://www.figma.com/design/i7T3ru2M0SyXgJeTda8f43/AI-PDP-DS?node-id=3415-31861)
 * - Vertical: [stepperGroupVertical · 3415:32072](https://www.figma.com/design/i7T3ru2M0SyXgJeTda8f43/AI-PDP-DS?node-id=3415-32072)
 */
export const figma = {
  nodeId: '3415:31861',
  props: {
    orientation: ['horizontal', 'vertical'],
    nestedContentStepIndex: [0, 1, 2],
  } satisfies Record<
    keyof Pick<StepperGroupProps, 'orientation' | 'nestedContentStepIndex'>,
    unknown
  >,
};
