import styled from 'styled-components';
import { Icon, xIconGlyph } from '@/components/icon';

/** Figma `icon / X` in modal header (`modal/buttonClose/*`) — 24×24. */
const MODAL_CLOSE_ICON_SIZE = 24 as const;

export interface ModalButtonCloseProps {
  onClick?: () => void;
  /** @default 'Close dialog' */
  'aria-label'?: string;
  disabled?: boolean;
  className?: string;
}

const StyledClose = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-sizing: border-box;
  width: ${({ theme }) => theme.spacing.height.xSmall};
  height: ${({ theme }) => theme.spacing.height.xSmall};
  margin: 0;
  padding: 0;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.componentInner};
  background: transparent;
  color: ${({ theme }) => theme.colors.modal.buttonClose.calm.enabled};
  cursor: pointer;
  transition: color 0.15s ease;

  &:hover:enabled {
    color: ${({ theme }) => theme.colors.modal.buttonClose.calm.hover};
  }

  &:active:enabled {
    color: ${({ theme }) => theme.colors.modal.buttonClose.calm.active};
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0px 0px 0px 2px ${({ theme }) => theme.colors.focus.ring.default};
  }

  &:disabled {
    color: ${({ theme }) => theme.colors.modal.buttonClose.calm.disabled};
    cursor: not-allowed;
  }
`;

/**
 * Close control for the modal header (Figma node `3301:19639` · `buttonClose` / `icon / X`).
 */
export function ModalButtonClose({
  onClick,
  'aria-label': ariaLabel = 'Close dialog',
  disabled,
  className,
}: ModalButtonCloseProps) {
  return (
    <StyledClose
      type="button"
      aria-label={ariaLabel}
      data-testid="modal-button-close"
      onClick={onClick}
      disabled={disabled}
      className={className}
    >
      <Icon icon={xIconGlyph} size={MODAL_CLOSE_ICON_SIZE} aria-hidden="true" />
    </StyledClose>
  );
}
