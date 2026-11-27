export type PaginationItem = { type: 'page'; page: number } | { type: 'ellipsis'; id: string };

const rangePages = (from: number, to: number): PaginationItem[] =>
  Array.from({ length: to - from + 1 }, (_, i) => ({
    type: 'page' as const,
    page: from + i,
  }));

/**
 * Набор элементов для отрисовки (страницы и «…») при большом `pageCount`.
 * При `pageCount <= 7` возвращаются все страницы подряд.
 */
export function buildPaginationItems(page: number, pageCount: number): PaginationItem[] {
  if (pageCount < 1) {
    return [];
  }

  if (pageCount <= 7) {
    return Array.from({ length: pageCount }, (_, i) => ({
      type: 'page' as const,
      page: i + 1,
    }));
  }

  const delta = 1;
  const items: PaginationItem[] = [];
  const left = Math.max(2, page - delta);
  const right = Math.min(pageCount - 1, page + delta);

  items.push({ type: 'page', page: 1 });

  if (left > 2) {
    items.push({ type: 'ellipsis', id: 'start' });
  }

  items.push(...rangePages(left, right));

  if (right < pageCount - 1) {
    items.push({ type: 'ellipsis', id: 'end' });
  }

  if (pageCount > 1) {
    items.push({ type: 'page', page: pageCount });
  }

  return items;
}
