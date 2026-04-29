import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { describe, expect, it } from 'vitest';
import { theme } from '@/theme/tokens';
import { ButtonLink } from './ButtonLink';

describe('ButtonLink', () => {
  it('renders as button with text', () => {
    render(
      <ThemeProvider theme={theme}>
        <ButtonLink text="Link Label" />
      </ThemeProvider>,
    );

    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByText('Link Label')).toBeInTheDocument();
  });

  it('sets disabled while loading', () => {
    render(
      <ThemeProvider theme={theme}>
        <ButtonLink loading />
      </ThemeProvider>,
    );

    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
});
