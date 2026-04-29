import { fireEvent, render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { describe, expect, it, vi } from 'vitest';
import { theme } from '@/theme/tokens';
import { NotificationSnackbar } from './NotificationSnackbar';

describe('NotificationSnackbar', () => {
  it('renders title and description', () => {
    render(
      <ThemeProvider theme={theme}>
        <NotificationSnackbar title="Saved" description="Changes applied" />
      </ThemeProvider>,
    );

    expect(screen.getByText('Saved')).toBeInTheDocument();
    expect(screen.getByText('Changes applied')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn();
    render(
      <ThemeProvider theme={theme}>
        <NotificationSnackbar onClose={onClose} />
      </ThemeProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Close notification' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('can hide close button', () => {
    render(
      <ThemeProvider theme={theme}>
        <NotificationSnackbar closable={false} />
      </ThemeProvider>,
    );

    expect(screen.queryByRole('button', { name: 'Close notification' })).toBeNull();
  });
});
