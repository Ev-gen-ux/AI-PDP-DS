import { forwardRef, useEffect, type MouseEvent } from 'react';
import { styled, css } from 'styled-components';
import { Modal, type ModalProps } from './Modal';

/**
 * Full-viewport shell for `Modal` (Figma `modalDialog` · node `3309:21489`):
 * `modal.fade` backdrop, padding `paddings.large` × `paddings.section`, panel above fade (`z-index`).
 */
export interface ModalDialogProps extends ModalProps {
  /** When `onClose` is set, clicking the dimmed backdrop invokes it. */
  closeOnBackdropClick?: boolean;
  /** Disable scrolling of the document while the overlay is mounted. */
  lockBodyScroll?: boolean;
}

const Shell = styled.div`
  position: fixed;
  inset: 0;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => `${theme.spacing.paddings.large} ${theme.spacing.paddings.section}`};
  isolation: isolate;
  overflow-x: hidden;
  overflow-y: auto;
`;

type BackdropProps = { $interactive: boolean };

const Backdrop = styled.div<BackdropProps>`
  position: absolute;
  inset: 0;
  z-index: 0;
  background-color: ${({ theme }) => theme.colors.modal.fade.enabled};
  ${({ $interactive }) =>
    $interactive
      ? css`
          cursor: pointer;
        `
      : css`
          pointer-events: none;
        `}
`;

const DialogLayer = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 100%;
  max-width: ${({ theme }) => theme.spacing.modal.maxWidth};
  flex-shrink: 0;
  margin-inline: auto;
`;

export const ModalDialog = forwardRef<HTMLDivElement, ModalDialogProps>(function ModalDialog(
  { closeOnBackdropClick = true, lockBodyScroll = true, onClose, ...modalProps },
  ref,
) {
  useEffect(() => {
    if (!lockBodyScroll) {
      return;
    }
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [lockBodyScroll]);

  const backdropClosable = Boolean(onClose && closeOnBackdropClick);

  const handleBackdropMouseDown = (event: MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleBackdropClick = () => {
    if (backdropClosable) {
      onClose?.();
    }
  };

  return (
    <Shell>
      <Backdrop
        $interactive={backdropClosable}
        aria-hidden="true"
        data-testid="modal-dialog-backdrop"
        onMouseDown={handleBackdropMouseDown}
        onClick={handleBackdropClick}
      />
      <DialogLayer>
        <Modal ref={ref} {...modalProps} {...(onClose !== undefined ? { onClose } : {})} />
      </DialogLayer>
    </Shell>
  );
});
