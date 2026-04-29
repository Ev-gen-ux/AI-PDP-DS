import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { describe, expect, it } from 'vitest';
import { theme } from '@/theme/tokens';
import { ToggleButton } from './ToggleButton';

describe('ToggleButton', () => {
  it('renders primary text button', () => {
    render(
      <ThemeProvider theme={theme}>
        <ToggleButton appearance="primary" text="Toggle Button" />
      </ThemeProvider>,
    );

    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByText('Toggle Button')).toBeInTheDocument();
  });

  it('renders secondary with sun icon', () => {
    const { container } = render(
      <ThemeProvider theme={theme}>
        <ToggleButton appearance="secondary" />
      </ThemeProvider>,
    );

    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('sets disabled while loading', () => {
    render(
      <ThemeProvider theme={theme}>
        <ToggleButton loading />
      </ThemeProvider>,
    );

    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
});
