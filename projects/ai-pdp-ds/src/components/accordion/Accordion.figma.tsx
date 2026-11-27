import type { AccordionProps } from './Accordion';

/**
 * Placeholder Code Connect mapping.
 * Update nodeId when publishing mapping to Figma.
 */
export const figma = {
  nodeId: '3294:16164',
  props: {
    appearance: ['default', 'calm', 'accent'],
    open: [true, false],
  } satisfies Record<keyof Pick<AccordionProps, 'appearance' | 'open'>, unknown>,
};
