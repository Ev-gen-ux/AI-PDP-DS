import { type RefObject, useCallback, useEffect, useLayoutEffect } from 'react';

/** Отступ под полем как у `theme.spacing.inner.related` (для fixed без margin-коллапса), как в `InputDate`. */
export function readRelatedGapPx(): number {
  if (typeof window === 'undefined' || typeof document === 'undefined') return 8;
  const raw = window
    .getComputedStyle(document.documentElement)
    .getPropertyValue('--spacing-inner-related')
    .trim();
  if (raw.endsWith('px')) {
    const n = Number.parseFloat(raw);
    return Number.isFinite(n) ? n : 8;
  }
  return 8;
}

/**
 * Позиционирование выпадающего списка Select/Multiselect: `fixed` под якорем,
 * обновление при scroll/resize (как попап календаря в `InputDate`).
 */
export function useSelectListPopover(
  open: boolean,
  anchorRef: RefObject<HTMLElement | null>,
  popoverRef: RefObject<HTMLElement | null>,
): void {
  const position = useCallback(() => {
    const anchor = anchorRef.current;
    const panel = popoverRef.current;
    if (!anchor || !panel || !open) return;
    const rect = anchor.getBoundingClientRect();
    const gap = readRelatedGapPx();
    panel.style.top = `${rect.bottom + gap}px`;
    panel.style.left = `${rect.left}px`;
    panel.style.width = `${rect.width}px`;
  }, [open, anchorRef, popoverRef]);

  useLayoutEffect(() => {
    position();
  }, [position]);

  useEffect(() => {
    if (!open) return;
    window.addEventListener('resize', position);
    window.addEventListener('scroll', position, true);
    return () => {
      window.removeEventListener('resize', position);
      window.removeEventListener('scroll', position, true);
    };
  }, [open, position]);
}
