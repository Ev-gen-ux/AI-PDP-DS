import {
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
  forwardRef,
  isValidElement,
  useCallback,
  useEffect,
  useId,
  useRef,
} from 'react';
import styled, { css } from 'styled-components';
import { Icon, metaIconGlyph } from '@/components/icon';
import { ModalButtonClose } from './ModalButtonClose';

const HEADER_ICON_SIZE = 24 as const;

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

function collectFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (el) => !el.hasAttribute('disabled') && el.tabIndex !== -1,
  );
}

export interface ModalProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Dialog heading (Figma: Header). */
  header: string;
  /** Main content (Figma: modal body). */
  children: ReactNode;
  /** Footer actions; omit to hide the footer region. */
  footer?: ReactNode;
  /** Leading icon in the header; `true` (default) uses the library meta icon. */
  iconBefore?: ReactNode | boolean;
  /**
   * Figma: show header slot before the title. When `true` and `contentBeforeSlot` is omitted,
   * renders the dashed placeholder (table cell children pattern).
   */
  contentBefore?: boolean;
  /**
   * Figma: show header slot after the title. When `true` and `contentAfterSlot` is omitted,
   * renders the dashed placeholder.
   */
  contentAfter?: boolean;
  /** Custom node for the `contentBefore` region (replaces default placeholder). */
  contentBeforeSlot?: ReactNode;
  /** Custom node for the `contentAfter` region (replaces default placeholder). */
  contentAfterSlot?: ReactNode;
  /** @deprecated Use `contentBeforeSlot`. */
  beforeTitle?: ReactNode;
  /** @deprecated Use `contentAfterSlot`. */
  afterTitle?: ReactNode;
  /** Figma: `isClosable` — show close control in the header. */
  closable?: boolean;
  onClose?: () => void;
  /** Move focus to the first focusable control (or the dialog root) when the modal mounts. */
  moveFocusOnMount?: boolean;
}

const Panel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  box-sizing: border-box;
  width: 100%;
  /* Never wider than the parent: avoids horizontal overflow that hides the inline-end close control. */
  min-width: min(${({ theme }) => theme.spacing.modal.minWidth}, 100%);
  min-height: ${({ theme }) => theme.spacing.modal.minHeight};
  max-width: ${({ theme }) => theme.spacing.modal.maxWidth};
  max-height: ${({ theme }) => theme.spacing.modal.maxHeight};
  border-radius: ${({ theme }) => theme.borderRadius.containerBase};
  border: 1px solid ${({ theme }) => theme.colors.modal.border.calm.enabled};
  background-color: ${({ theme }) => theme.colors.modal.background.calm.enabled};
  box-shadow: ${({ theme }) => theme.effects.overlay.modal};
  overflow: hidden;
  outline: none;
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.inner.related};
  flex-shrink: 0;
  width: 100%;
  min-width: 0;
  /* Do not clip: overflow:hidden here cut off the close control when the start cluster was wide. */
  padding: ${({ theme }) => `${theme.spacing.paddings.default} ${theme.spacing.paddings.relaxed}`};
  border-bottom: 1px solid ${({ theme }) => theme.colors.modal.border.calm.enabled};
`;

/** Pins `ModalButtonClose` to the inline-end; paints after HeaderStart so it stays visible on overlap. */
const HeaderEnd = styled.div`
  flex-shrink: 0;
  margin-inline-start: auto;
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
`;

const HeaderStart = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.inner.related};
  flex: 1;
  min-width: 0;
  overflow: hidden;
`;

const IconBeforeWrap = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  line-height: 0;
  color: ${({ theme }) => theme.colors.modal.icon.calm.enabled};
`;

/** Figma: dashed `children` slot in header (contentBefore / contentAfter). */
const HeaderSlotPlaceholder = styled.span`
  display: inline-block;
  box-sizing: border-box;
  width: ${({ theme }) => theme.spacing.height.xSmall};
  height: ${({ theme }) => theme.spacing.height.xSmall};
  flex-shrink: 0;
  border: 1px dashed ${({ theme }) => theme.colors.tableCell.children.border.calm};
  background: ${({ theme }) => theme.colors.tableCell.children.background.enabled};
  overflow: hidden;
`;

const Heading = styled.h2`
  margin: 0;
  padding: 0;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  font-family: ${({ theme }) => theme.typography.fontFamily.component};
  font-size: ${({ theme }) => theme.typography.fontSize.heading.h4};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
  line-height: ${({ theme }) => theme.typography.lineHeight.heading.h4};
  font-feature-settings:
    'lnum' 1,
    'tnum' 1;
  color: ${({ theme }) => theme.colors.text.base};
  white-space: nowrap;
`;

const Body = styled.div`
  flex: 1 1 auto;
  min-height: 0;
  overflow: auto;
  padding: ${({ theme }) => theme.spacing.paddings.relaxed};
`;

const FooterRow = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  padding: ${({ theme }) => `${theme.spacing.paddings.default} ${theme.spacing.paddings.relaxed}`};
  border-top: 1px solid ${({ theme }) => theme.colors.modal.border.calm.enabled};
`;

const footerActionsStyles = css`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.inner.related};
`;

const FooterActions = styled.div`
  ${footerActionsStyles}
`;

export const Modal = forwardRef<HTMLDivElement, ModalProps>(function Modal(
  {
    header,
    children,
    footer,
    iconBefore = true,
    contentBefore = true,
    contentAfter = true,
    contentBeforeSlot,
    contentAfterSlot,
    beforeTitle,
    afterTitle,
    closable = true,
    onClose,
    moveFocusOnMount = true,
    className,
    onKeyDown,
    ...rest
  },
  ref,
) {
  const headingId = useId();
  const panelRef = useRef<HTMLDivElement | null>(null);

  const assignRefs = useCallback(
    (node: HTMLDivElement | null) => {
      panelRef.current = node;
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    },
    [ref],
  );

  useEffect(() => {
    if (!moveFocusOnMount) {
      return;
    }
    const root = panelRef.current;
    if (!root) {
      return;
    }
    const focusables = collectFocusableElements(root);
    const target = focusables[0] ?? root;
    target.focus({ preventScroll: true });
  }, [moveFocusOnMount]);

  const resolveIconBefore = (): ReactNode => {
    if (iconBefore === undefined || iconBefore === null || iconBefore === false) {
      return null;
    }
    if (iconBefore === true) {
      return <Icon icon={metaIconGlyph} size={HEADER_ICON_SIZE} aria-hidden="true" />;
    }
    if (
      isValidElement(iconBefore) ||
      typeof iconBefore === 'string' ||
      typeof iconBefore === 'number'
    ) {
      return iconBefore;
    }
    return <Icon icon={metaIconGlyph} size={HEADER_ICON_SIZE} aria-hidden="true" />;
  };

  const iconBeforeNode = resolveIconBefore();

  const resolvedBeforeSlot = contentBeforeSlot ?? beforeTitle;
  const resolvedAfterSlot = contentAfterSlot ?? afterTitle;

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) {
      return;
    }

    if (event.key === 'Escape' && onClose) {
      event.stopPropagation();
      onClose();
      return;
    }

    if (event.key !== 'Tab') {
      return;
    }

    const root = panelRef.current;
    if (!root) {
      return;
    }

    const focusables = collectFocusableElements(root);
    if (focusables.length === 0) {
      return;
    }

    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (!first || !last) {
      return;
    }
    const active = document.activeElement as HTMLElement | null;

    if (event.shiftKey) {
      if (active === first || (active && !focusables.includes(active))) {
        event.preventDefault();
        last.focus();
      }
    } else if (active === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <Panel
      ref={assignRefs}
      role="dialog"
      aria-modal="true"
      aria-labelledby={headingId}
      tabIndex={-1}
      className={className}
      onKeyDown={handleKeyDown}
      {...rest}
    >
      <HeaderRow>
        <HeaderStart>
          {iconBeforeNode ? <IconBeforeWrap>{iconBeforeNode}</IconBeforeWrap> : null}
          {contentBefore
            ? (resolvedBeforeSlot ?? (
                <HeaderSlotPlaceholder
                  aria-hidden="true"
                  data-testid="modal-header-content-before"
                />
              ))
            : null}
          <Heading id={headingId}>{header}</Heading>
          {contentAfter
            ? (resolvedAfterSlot ?? (
                <HeaderSlotPlaceholder
                  aria-hidden="true"
                  data-testid="modal-header-content-after"
                />
              ))
            : null}
        </HeaderStart>
        {closable ? (
          <HeaderEnd>
            <ModalButtonClose {...(onClose ? { onClick: onClose } : {})} disabled={!onClose} />
          </HeaderEnd>
        ) : null}
      </HeaderRow>
      <Body>{children}</Body>
      {footer ? <FooterRow>{footer}</FooterRow> : null}
    </Panel>
  );
});

export const ModalFooterActions = FooterActions;
