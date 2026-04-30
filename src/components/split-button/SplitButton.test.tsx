import { fireEvent, render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { describe, expect, it, vi } from 'vitest';
import { theme } from '@/theme/tokens';
import { SplitButton } from './SplitButton';

describe('SplitButton', () => {
  it('renders button text', () => {
    render(
      <ThemeProvider theme={theme}>
        <SplitButton text="Button Label" />
      </ThemeProvider>,
    );

    expect(screen.getByText('Button Label')).toBeInTheDocument();
  });

  it('toggles menu state via split trigger callback', () => {
    const onMenuToggle = vi.fn();
    render(
      <ThemeProvider theme={theme}>
        <SplitButton menuOpen={false} onMenuToggle={onMenuToggle} />
      </ThemeProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Toggle dropdown' }));
    expect(onMenuToggle).toHaveBeenCalledWith(true);
  });

  it('disables both buttons while loading', () => {
    render(
      <ThemeProvider theme={theme}>
        <SplitButton loading />
      </ThemeProvider>,
    );

    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(2);
    expect(buttons[0]).toBeDisabled();
    expect(buttons[1]).toBeDisabled();
  });
});
