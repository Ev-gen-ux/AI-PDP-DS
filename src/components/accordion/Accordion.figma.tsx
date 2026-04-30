import type { AccordionProps } from './Accordion';

export const figma = {
  nodeId: '3257:13142',
  props: {
    open: [true, false],
  } satisfies Record<keyof Pick<AccordionProps, 'open'>, unknown>,
};
