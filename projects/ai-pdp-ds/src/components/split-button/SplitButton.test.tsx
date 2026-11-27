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

  it('toggles menu state via main button click', () => {
    const onMenuToggle = vi.fn();
    render(
      <ThemeProvider theme={theme}>
        <SplitButton menuOpen={false} onMenuToggle={onMenuToggle} />
      </ThemeProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: /Button Label/i }));
    expect(onMenuToggle).toHaveBeenCalledWith(true);
  });

  it('opens dropdown in uncontrolled mode on click', () => {
    render(
      <ThemeProvider theme={theme}>
        <SplitButton dropdownContent={<div data-testid="dropdown-content">Dropdown content</div>} />
      </ThemeProvider>,
    );

    expect(screen.queryByTestId('dropdown-content')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: /Button Label/i }));
    expect(screen.getByTestId('dropdown-content')).toBeInTheDocument();
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
