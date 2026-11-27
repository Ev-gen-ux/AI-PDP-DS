import { fireEvent, render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { describe, expect, it, vi } from 'vitest';
import { theme } from '@/theme/tokens';
import { ModalDialog } from './ModalDialog';

describe('ModalDialog', () => {
  it('renders dialog and fade triggers onClose when configured', () => {
    const onClose = vi.fn();
    render(
      <ThemeProvider theme={theme}>
        <ModalDialog
          header="T"
          onClose={onClose}
          moveFocusOnMount={false}
          lockBodyScroll={false}
          closeOnBackdropClick
        >
          Body
        </ModalDialog>
      </ThemeProvider>,
    );

    expect(screen.getByRole('dialog', { name: 'T' })).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('modal-dialog-backdrop'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not close on backdrop when closeOnBackdropClick is false', () => {
    const onClose = vi.fn();
    render(
      <ThemeProvider theme={theme}>
        <ModalDialog
          header="T"
          onClose={onClose}
          moveFocusOnMount={false}
          lockBodyScroll={false}
          closeOnBackdropClick={false}
        >
          Body
        </ModalDialog>
      </ThemeProvider>,
    );

    fireEvent.click(screen.getByTestId('modal-dialog-backdrop'));
    expect(onClose).not.toHaveBeenCalled();
  });
});
