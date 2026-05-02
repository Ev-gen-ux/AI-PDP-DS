import { fireEvent, render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { describe, expect, it, vi } from 'vitest';
import { theme } from '@/theme/tokens';
import { Modal } from './Modal';

describe('Modal', () => {
  it('renders header and body', () => {
    render(
      <ThemeProvider theme={theme}>
        <Modal header="Dialog title" moveFocusOnMount={false}>
          Body text
        </Modal>
      </ThemeProvider>,
    );

    expect(screen.getByRole('dialog', { name: 'Dialog title' })).toBeInTheDocument();
    expect(screen.getByText('Body text')).toBeInTheDocument();
  });

  it('renders Figma contentBefore/contentAfter placeholders by default', () => {
    render(
      <ThemeProvider theme={theme}>
        <Modal header="Title" moveFocusOnMount={false} onClose={() => {}}>
          Body
        </Modal>
      </ThemeProvider>,
    );

    expect(screen.getByTestId('modal-header-content-before')).toBeInTheDocument();
    expect(screen.getByTestId('modal-header-content-after')).toBeInTheDocument();
  });

  it('hides header slots when contentBefore and contentAfter are false', () => {
    render(
      <ThemeProvider theme={theme}>
        <Modal header="Title" contentBefore={false} contentAfter={false} moveFocusOnMount={false}>
          Body
        </Modal>
      </ThemeProvider>,
    );

    expect(screen.queryByTestId('modal-header-content-before')).toBeNull();
    expect(screen.queryByTestId('modal-header-content-after')).toBeNull();
  });

  it('calls onClose when close is clicked', () => {
    const onClose = vi.fn();
    render(
      <ThemeProvider theme={theme}>
        <Modal header="Title" onClose={onClose} moveFocusOnMount={false}>
          X
        </Modal>
      </ThemeProvider>,
    );

    expect(screen.getByTestId('modal-button-close')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Close dialog' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('renders close control with a long header (header row flex leaves room for button)', () => {
    const onClose = vi.fn();
    render(
      <ThemeProvider theme={theme}>
        <Modal
          header="Very long modal title that must shrink so the close button stays in the layout"
          onClose={onClose}
          moveFocusOnMount={false}
        >
          Body
        </Modal>
      </ThemeProvider>,
    );

    expect(screen.getByTestId('modal-button-close')).toBeInTheDocument();
  });

  it('calls onClose on Escape', () => {
    const onClose = vi.fn();
    render(
      <ThemeProvider theme={theme}>
        <Modal header="Title" onClose={onClose} moveFocusOnMount={false}>
          Body
        </Modal>
      </ThemeProvider>,
    );

    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('hides close button when not closable', () => {
    render(
      <ThemeProvider theme={theme}>
        <Modal header="Title" closable={false} moveFocusOnMount={false}>
          Body
        </Modal>
      </ThemeProvider>,
    );

    expect(screen.queryByRole('button', { name: 'Close dialog' })).toBeNull();
  });
});
