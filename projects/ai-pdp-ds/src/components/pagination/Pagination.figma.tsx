import type { PaginationProps } from './Pagination';

/**
 * Code Connect mapping (Figma `pagination`).
 * @see https://www.figma.com/design/i7T3ru2M0SyXgJeTda8f43/AI-PDP-DS?node-id=3358-23472
 */
export const figma = {
  nodeId: '3358:23472',
  props: {
    page: [1, 2, 3],
    pageCount: [3, 10],
    disabled: [true, false],
  } satisfies Record<keyof Pick<PaginationProps, 'page' | 'pageCount' | 'disabled'>, unknown>,
};
